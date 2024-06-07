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


