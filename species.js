// code to fetch species data from the github repository if there is a variable in the url else fetch species list
const urlParams = new URLSearchParams(window.location.search);
const speciesParam = urlParams.get('species');

// Helper: find a field by trying multiple possible names and case-insensitive keys
function getAny(obj, names) {
    if (!obj) return undefined;
    for (const name of names) {
        if (name in obj) return obj[name];
        const found = Object.keys(obj).find(k => k.toLowerCase() === name.toLowerCase());
        if (found) return obj[found];
    }
    return undefined;
}

function asArray(val) {
    if (!val && val !== 0) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return val.split(/,\s*/).filter(Boolean);
    return [val];
}

if (speciesParam) {
    const jsonUrl = `https://raw.githubusercontent.com/Mine1115/dndInfo/refs/heads/main/Species/${speciesParam}.json`;
    const mdUrl = `https://raw.githubusercontent.com/Mine1115/dndInfo/refs/heads/main/Species/${speciesParam}.md`;

    // Fetch both resources in parallel; allow markdown to be empty if missing
    Promise.all([
        fetch(jsonUrl).then(r => { if (!r.ok) throw new Error('JSON fetch failed'); return r.json(); }),
        fetch(mdUrl).then(r => r.ok ? r.text() : '')
    ])
    .then(([jsonData, mdText]) => {
        const speciesData = jsonData;
        const speciesMarkdown = mdText || '';
        console.log('species JSON', speciesData);
        console.log('species MD length', speciesMarkdown.length);

        // normalize fields with common alternatives and typos
        const size = getAny(speciesData, ['size', 'Size']) || 'Unknown';
        // speed may be an object like { walk: 30 }
        const rawSpeed = getAny(speciesData, ['speed', 'Speed']) || {};
        let speedDisplay = '';
        if (typeof rawSpeed === 'object' && rawSpeed !== null) {
            if ('walk' in rawSpeed) speedDisplay = `${rawSpeed.walk} ft.`;
            else if ('Walk' in rawSpeed) speedDisplay = `${rawSpeed.Walk} ft.`;
            else speedDisplay = JSON.stringify(rawSpeed);
        } else if (rawSpeed) {
            speedDisplay = String(rawSpeed);
        } else {
            speedDisplay = 'Unknown';
        }

        const languages = asArray(getAny(speciesData, ['languages', 'Languages']));
        const traits = asArray(getAny(speciesData, ['traits', 'ability', 'Ability']));
        const proficiencies = asArray(getAny(speciesData, ['proficiencies', 'Proficiencies', 'proficentys', 'proficiencys']));
        const subraces = asArray(getAny(speciesData, ['subraces', 'Subraces', 'Subrace', 'Subraces']));
        const abilityScoreIncrease = getAny(speciesData, ['abilityScoreIncrease', 'AbilityScoreIncrease', 'ability_score_increase']) || '';

        // Update page elements
        document.title = speciesParam;
        const backLink = document.createElement('a');
        backLink.href = 'species.html';
        backLink.textContent = 'Back to Species List';
        document.body.appendChild(backLink);

        const speciesDiv = document.createElement('div');
        speciesDiv.id = 'speciesData';
        document.body.appendChild(speciesDiv);

        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.style.display = 'none';
        const itemList = document.getElementById('itemList');
        if (itemList) itemList.style.display = 'none';
        const titleEl = document.getElementById('Title');
        if (titleEl) titleEl.innerHTML = speciesParam;

        // Safely join arrays only when present
        const languagesText = languages.length ? languages.join(', ') : 'None';
        const traitsText = traits.length ? traits.join(', ') : 'None';
        const profText = proficiencies.length ? proficiencies.join(', ') : 'None';
        const subracesText = subraces.length ? subraces.join(', ') : 'None';

        // Convert markdown to HTML if possible, sanitize the result
        let markdownHtml = '';
        try {
            if (typeof marked !== 'undefined') {
                const rawHtml = marked.parse ? marked.parse(speciesMarkdown) : marked(speciesMarkdown);
                if (typeof DOMPurify !== 'undefined' && DOMPurify.sanitize) {
                    markdownHtml = DOMPurify.sanitize(rawHtml);
                } else {
                    // No sanitizer available, use raw HTML but this is unsafe if content is untrusted
                    markdownHtml = rawHtml;
                }
            } else {
                // marked not available — escape HTML and wrap in <pre> for readability
                const escaped = speciesMarkdown
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                markdownHtml = `<pre>${escaped}</pre>`;
            }
        } catch (e) {
            console.error('Markdown conversion failed', e);
            const escaped = speciesMarkdown
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            markdownHtml = `<pre>${escaped}</pre>`;
        }

        speciesDiv.innerHTML = `
            <h1>${speciesParam}</h1>
            <div class="species-details">
                <div>Size: ${size}</div>
                <div>Speed: ${speedDisplay}</div>
                <div>Ability Score Increase: ${abilityScoreIncrease}</div>
                <div>Languages: ${languagesText}</div>
                <div>Traits: ${traitsText}</div>
                <div>Proficiencies: ${profText}</div>
                <div>Subraces: ${subracesText}</div>
            </div>
            <div class="species-markdown">${markdownHtml}</div>
            <div><h2>Subraces</h2><ul></ul></div>
        `;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        const err = document.createElement('div');
        err.textContent = 'Failed to load species data.';
        document.body.appendChild(err);
    });
} else {
    // Fetch the species list
    fetch('https://raw.githubusercontent.com/Mine1115/dndInfo/refs/heads/main/Species/list.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // Process the species list
            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}