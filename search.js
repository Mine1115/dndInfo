function filterItems() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();

    const items = document.getElementById('itemList').getElementsByTagName('li');

    for (let i = 0; i < items.length; i++) {
            let itemText = items[i].textContent.toLowerCase();
        if (itemText.includes(searchValue)) {
            items[i].style.display = '';
        } else {
            items[i].style.display = 'none';
        }
    }
}
