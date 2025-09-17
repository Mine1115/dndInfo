//code to fetch species data from the github repository if there is a varable in the url else featch species list
const urlParams = new URLSearchParams(window.location.search);
const speciesParam = urlParams.get('species');
if (speciesParam) {
    fetch(`https://raw.githubusercontent.com/Mine1115/dndInfo/refs/heads/main/Species/${speciesParam}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Process the species data
            console.log(data);
            fetch(`https://raw.githubusercontent.com/Mine1115/dndInfo/refs/heads/main/Species/${speciesParam}.md`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                // Process the species data
                console.log(data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
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