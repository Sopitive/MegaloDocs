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
    const toggle = document.getElementById('theme-toggle');
    // --hover-anim-primary: #000080;
    // --hover-anim-secondary: #05055f;
    
    // Load the theme from localStorage
var savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.classList.add(savedTheme);
    setThemeColors(savedTheme);
}
if (!savedTheme) {
    //Apply system theme
    document.body.classList.add("System");
    setThemeColors("System");
}

document.body.style.display = "grid";

toggle.addEventListener('click', function() {
    document.body.style.transition = "background 0.4s";
    document.querySelector("#main").style.transition = "background 0.6s";
    document.querySelector("#sidebar").style.transition = "background 0.6s";
    document.querySelector(".dropdown-content").style.transition = "background 0.6s";
    document.querySelector("header").style.transition = "background 0.6s";
    document.querySelector(".dropdown-toggle").style.transition = "background 0.6s";
    document.querySelector(".dropdown").style.transition = "background 0.6s";
    var theme;
    if (document.body.classList.contains('Light')) {
        document.body.classList.remove('Light');
        document.body.classList.add('Dark');
        theme = 'Dark';
    } else if (document.body.classList.contains('Dark')) {
        document.body.classList.remove('Dark');
        theme = 'System';
    } else {
        document.body.classList.add('Light');
        theme = 'Light';
    }
    setThemeColors(theme);
    // Save the theme to localStorage
    localStorage.setItem('theme', theme);

    // Remove and re-add the animation class to replay the animation
    this.classList.remove('rotate');
    void this.offsetWidth; // Trigger a reflow
    this.classList.add('rotate');
});

function setThemeColors(theme) {
    if (theme === 'Light') {
        document.documentElement.style.setProperty('--background-color', '#ffffff');
        document.documentElement.style.setProperty('--text-color', '#000000');
        document.documentElement.style.setProperty('--secondary-color', '#EEE');
        document.documentElement.style.setProperty('--hover-anim-primary', '#AAA');
        document.documentElement.style.setProperty('--hover-anim-secondary', '#EEE');
    } else if (theme === 'Dark') {
        document.documentElement.style.setProperty('--background-color', '#1b1b1b');
        document.documentElement.style.setProperty('--text-color', '#ffffff');
        document.documentElement.style.setProperty('--secondary-color', '#4e4e4e');
        document.documentElement.style.setProperty('--hover-anim-primary', '#000080');
        document.documentElement.style.setProperty('--hover-anim-secondary', '#05055f');
    } else {
        // Use system theme
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Dark theme
            document.documentElement.style.setProperty('--background-color', '#1b1b1b');
            document.documentElement.style.setProperty('--text-color', '#ffffff');
            document.documentElement.style.setProperty('--secondary-color', '#4e4e4e');
            document.documentElement.style.setProperty('--hover-anim-primary', '#000080');
            document.documentElement.style.setProperty('--hover-anim-secondary', '#05055f');
        } else {
            // Light theme
            document.documentElement.style.setProperty('--background-color', '#ffffff');
            document.documentElement.style.setProperty('--text-color', '#000000');
            document.documentElement.style.setProperty('--secondary-color', '#EEE');
            document.documentElement.style.setProperty('--hover-anim-primary', '#AAA');
            document.documentElement.style.setProperty('--hover-anim-secondary', '#EEE');
        }
    }

    // Remove the existing theme label, if any
var existingLabel = document.getElementById('theme-label');
if (existingLabel) {
    existingLabel.remove();
}

// Create a new text node and append it to the toggle element
var label = document.createElement('p');
label.id = 'theme-label';
label.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
toggle.parentNode.insertBefore(label, toggle.nextSibling);

}
    
    
    document.querySelectorAll('.dropdown-toggle').forEach(function(toggle) {
        toggle.addEventListener('click', function(event) {
            event.preventDefault();
            var content = this.parentElement.querySelector('ul');
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Get the current URL path
    var path = window.location.pathname;

    // Remove the leading and trailing slashes
    path = path.replace(/^\/|\/$/g, '');

    // Split the path into segments
    var segments = path.split('/');

    // Create an array to hold the breadcrumb elements
    var breadcrumbElements = [];

    // Create an anchor element for 'Home' and add it to the array
    var homeElement = document.createElement('a');
    homeElement.textContent = 'Home';
    homeElement.href = '/MegaloDocs';
    breadcrumbElements.push(homeElement);

    // Create an anchor element for each segment
    for (var i = 0; i < segments.length; i++) {
        var segment = segments[i];
    
        // Skip the segment if it's "MegaloDocs"
        if (segment.toLowerCase() === "megalodocs") continue;
    
        // Remove the .html extension from the segment name
        segment = segment.replace(/\.html$/, '');
    
        // Capitalize the first letter of the segment
        var capitalizedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);
    
        // Create an anchor element
        var element = document.createElement('a');
        element.textContent = capitalizedSegment;
    
        // Set the href attribute to the path up to this segment
        // If the segment is "script", make the link unclickable
        element.href = (segment === "script" || segment === "api") ? "javascript:void(0);" : '/' + segments.slice(0, i + 1).join('/');
        element.style.pointerEvents = (segment === "script" || segment === "api") ? "none" : "all";   
        // Add the element to the array
        breadcrumbElements.push(element);
    }

    // Join the breadcrumb elements with ' > ' and display them in the element
var breadcrumbElement = document.getElementById('breadcrumb');
breadcrumbElement.innerHTML = breadcrumbElements.map(function(element) {
    return element.outerHTML;
}).join(' > ');


// Get the current path
var path = window.location.pathname;

// Split the path into segments
var segments = path.split('/');

// Remove the first segment if it's empty (because the path starts with /)
if (segments[0] === '') {
    segments.shift();
}

// Get the last segment from the breadcrumb
var lastSegment = segments[segments.length - 1];

// Find the a element that has the text for the final breadcrumb segment
const sidebar = document.querySelector("#sidebar");
var element = sidebar.querySelector(`a[href$='${lastSegment}']`);

// If the element was found
if (element) {
    element.classList.add("active")
    // Go up through the parent elements and display any dropdown toggles or dropdown-content
    var parent = element.parentElement;
    while (parent && parent !== sidebar) {
        if (parent.classList.contains('dropdown-content')) {
            parent.style.display = 'block';
        }
        parent = parent.parentElement;
    }
}
});


