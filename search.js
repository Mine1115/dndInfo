function filterItems() {
    // Get the search input value
    const searchValue = document.getElementById('searchInput').value.toLowerCase();

    // Get all list items
    const items = document.getElementById('itemList').getElementsByTagName('li');

    // Loop through all list items and hide those that don't match the search term
    for (let i = 0; i < items.length; i++) {
            let itemText = items[i].textContent.toLowerCase();
        if (itemText.includes(searchValue)) {
            items[i].style.display = ''; // Show the item
        } else {
            items[i].style.display = 'none'; // Hide the item
        }
    }
}
