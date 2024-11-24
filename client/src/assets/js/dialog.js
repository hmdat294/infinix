document.querySelectorAll('.dialog').forEach(dialog => {
    var button = dialog.querySelector('button');
    var panel = dialog.querySelector('.dialog-panel');

    button.addEventListener('click', function() {
        dialog.classList.toggle('visible');
    });

    panel.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            dialog.classList.remove('visible');
        });
    });
});