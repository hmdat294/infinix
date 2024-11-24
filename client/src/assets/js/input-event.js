/* Search Input */
document.querySelectorAll('.search-control').forEach(function (searchControl) {
    var clearButton = searchControl.querySelector('.clear-content-button');
    var input = searchControl.querySelector('input');
    clearButton.addEventListener('click', function () {
        input.value = '';
        clearButton.style.display = input.value ? 'block' : 'none';
    });

    searchControl.addEventListener('input', function () {
        clearButton.style.display = input.value ? 'block' : 'none';
    });
});

/* Number Input */
document.querySelectorAll('.number-control').forEach(function (numberControl) {

    var input = numberControl.querySelector('input');
    var incrementButton = numberControl.querySelector('.increase-number-button');
    var decrementButton = numberControl.querySelector('.decrease-number-button');
    var min = input.getAttribute('min') || null;
    var max = input.getAttribute('max') || null;

    incrementButton.addEventListener('click', function () {
        if (max && parseInt(input.value) >= parseInt(max)) {
            return;
        }
        input.value = parseInt(input.value) + 1;
    });

    decrementButton.addEventListener('click', function () {
        if (min && parseInt(input.value) <= parseInt(min)) {
            return;
        }
        input.value = parseInt(input.value) - 1;
    });

    input.addEventListener('input', function () {
        input.value = input.value.replace(/[^0-9]/g, '');
    });
});

/* Search Dropdown Input */
document.querySelectorAll('.search-dropdown-control').forEach(function (searchDropdownControl) {
    var searchControl = searchDropdownControl.querySelector('.search-control');

    searchControl.addEventListener('click', function () {
        if (searchDropdownControl.classList.contains('visible')) {
            return;
        }
        searchDropdownControl.classList.add('visible');
    });

    document.addEventListener('click', function(event) {
        if (!searchDropdownControl.contains(event.target)) {
            searchDropdownControl.classList.remove('visible');
        }
    });
});

/* Password Input */
document.querySelectorAll('.password-control').forEach(function (passwordControl) {
    var input = passwordControl.querySelector('input');
    var showButton = passwordControl.querySelector('.show-password-button');

    passwordControl.addEventListener('input', function () {
        if (input.value) {
            showButton.style.display = 'block';
        } else {
            showButton.style.display = 'none';
        }
    });

    showButton.addEventListener('click', function () {
        if (input.getAttribute('type') === 'password') {
            input.setAttribute('type', 'text');
            showButton.classList.add('active');
        } else {
            input.setAttribute('type', 'password');
            showButton.classList.remove('active');
        }
    });
});

/* Dropdown Input */
document.querySelectorAll('.dropdown-control').forEach(function (dropdownControl) {
    var button = dropdownControl.querySelector('.button');
    var dropdownMenu = dropdownControl.querySelector('.dropdown-menu');

    /* Event Scope */
    button.addEventListener('click', function () {
        if (dropdownControl.classList.contains('visible')) {
            return;
        }
        dropdownControl.classList.add('visible');
    });

    dropdownMenu.addEventListener('click', function (event) {
        dropdownControl.classList.remove('visible');
    });

    document.addEventListener('click', function(event) {
        if (!dropdownControl.contains(event.target)) {
            dropdownControl.classList.remove('visible');
        }
    });
    /* End Event Scope */

    /* Data Scope */
    var selectedItem = null;
    var listItems = dropdownMenu.querySelectorAll('.list-item');
    var listItemsArray = Array.from(listItems);

    (function init() {
        listItemsArray.forEach(function (item) {
            if (item.classList.contains('active')) {
                selectedItem = item;
            }
        });
        if (!selectedItem) {
            selectedItem = listItemsArray[0];
            selectedItem.classList.add('active');
        }

        button.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                child.remove();
            }
        });

        button.innerHTML = selectedItem.querySelector('.text-body').innerText + button.innerHTML;
    })();

    listItems.forEach(function (item) {
        item.addEventListener('click', function () {
            selectedItem.classList.remove('active');
            item.classList.add('active');
            selectedItem = item;
            button.childNodes.forEach(child => {
                if (child.nodeType === Node.TEXT_NODE) {
                    child.remove();
                }
            });
            button.innerHTML = selectedItem.querySelector('.text-body').innerText + button.innerHTML;
        });
    });
    /* End Data Scope */
});

/* Text Area */

// document.querySelectorAll('.text-area-control').forEach(function (textAreaControl) {
//     textAreaControl.addEventListener('input', function() {
//         textAreaControl.style.height = '32px';
//         textAreaControl.style.height = `${textAreaControl.scrollHeight}px`;
//     });
    
//     window.addEventListener('load', function() {
//         textAreaControl.style.height = '32px';
//         textAreaControl.style.height = `${textAreaControl.scrollHeight}px`;
//     });
// });

