document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.dropdown').forEach(function(dropdown) {
        var button = dropdown.querySelector('button');
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                var dropdownContent = this.nextElementSibling;
                dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
            });
        }
    });
    document.querySelectorAll('a[href]').forEach(function(element) {
        element.classList.add('has-link');
    });
    
    
    
    document.getElementById('theme-toggle').addEventListener('click', function() {
        if (document.body.classList.contains('light-theme')) {
            document.body.classList.remove('light-theme');
            document.documentElement.style.setProperty('--background-color', '#02022a');
            document.documentElement.style.setProperty('--text-color', '#ffffff');
            document.documentElement.style.setProperty('--secondary-color', '#01011b');
        } else {
            document.body.classList.add('light-theme');
            document.documentElement.style.setProperty('--background-color', '#ffffff');
            document.documentElement.style.setProperty('--text-color', '#000000');
            document.documentElement.style.setProperty('--secondary-color', '#EEE');
        }
    });
    
    
    document.querySelectorAll('.dropdown-toggle').forEach(function(toggle) {
        toggle.addEventListener('click', function(event) {
            event.preventDefault();
            var content = this.parentElement.querySelector('ul');
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });
});


