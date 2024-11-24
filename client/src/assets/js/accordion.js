document.querySelectorAll('.accordion-header').forEach((header) => {
    header.addEventListener('click', function() {
        const panel = this.nextElementSibling;
        const icon = this.querySelector('.icon');

        // Toggle the active class for the header and panel
        this.classList.toggle('active');
        panel.classList.toggle('open');

        // Toggle the height of the accordion panel
        if (panel.classList.contains('open')) {
            panel.style.maxHeight = panel.scrollHeight + "px";
        } else {
            panel.style.maxHeight = 0 + "px";
        }
    });
});
