document.addEventListener('DOMContentLoaded', function() {
    const sidebarContainer = document.querySelector('#sidebar');
    const toggle = document.getElementById('theme-toggle');

    try {
        // 1. Theme Management
        const savedTheme = localStorage.getItem('theme') || 'System';
        applyTheme(savedTheme);

        toggle.addEventListener('click', function() {
            let currentTheme = localStorage.getItem('theme') || 'System';
            let nextTheme;
            if (currentTheme === 'Light') nextTheme = 'Dark';
            else if (currentTheme === 'Dark') nextTheme = 'System';
            else nextTheme = 'Light';

            applyTheme(nextTheme);
        });

    } catch (e) {
        console.error("Initialization error:", e);
        document.body.style.display = "grid";
    }

    function applyTheme(theme) {
        localStorage.setItem('theme', theme);
        document.body.classList.remove('Light', 'Dark', 'System');
        document.body.classList.add(theme);
        setThemeColors(theme);
        
        toggle.classList.add('rotate');
        setTimeout(() => toggle.classList.remove('rotate'), 600);
    }

    // Compatibility for matchMedia listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = e => {
        if (localStorage.getItem('theme') === 'System') {
            setThemeColors('System');
        }
    };
    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleThemeChange);
    } else {
        mediaQuery.addListener(handleThemeChange);
    }

    function setThemeColors(theme) {
        let actualTheme = theme;
        if (theme === 'System') {
            actualTheme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'Dark' : 'Light';
        }

        const colors = {
            'Light': { bg: '#ffffff', text: '#000000', sec: '#f0f0f0', h1: '#e0e0e0', h2: '#d0d0d0' },
            'Dark': { bg: '#1b1b1b', text: '#ffffff', sec: '#4e4e4e', h1: '#000080', h2: '#05055f' }
        }[actualTheme];

        document.documentElement.style.setProperty('--background-color', colors.bg);
        document.documentElement.style.setProperty('--text-color', colors.text);
        document.documentElement.style.setProperty('--secondary-color', colors.sec);
        document.documentElement.style.setProperty('--hover-anim-primary', colors.h1);
        document.documentElement.style.setProperty('--hover-anim-secondary', colors.h2);

        document.body.classList.remove('actual-dark', 'actual-light');
        document.body.classList.add(actualTheme === 'Dark' ? 'actual-dark' : 'actual-light');
        document.body.style.display = "grid"; 

        let label = document.getElementById('theme-label');
        if (!label) {
            label = document.createElement('p');
            label.id = 'theme-label';
            toggle.parentNode.insertBefore(label, toggle.nextSibling);
        }
        label.textContent = theme;
    }

    // 2. Sidebar Loading & Rendering
    if (sidebarContainer) {
        fetch('/JSON/sidebar.json?v=' + Date.now())
            .then(r => r.json())
            .then(data => {
                renderSidebar(data);
                highlightActive();
                buildBreadcrumbs(data);
            })
            .catch(err => {
                console.error("Sidebar fetch failed:", err);
            })
            .finally(() => {
                // Ensure the page is shown even if fetch fails
                document.body.style.display = "grid";
            });
    } else {
        document.body.style.display = "grid";
    }

    function renderSidebar(data) {
        // Add Search Bar
        sidebarContainer.innerHTML = '';
        const searchContainer = document.createElement('div');
        searchContainer.className = 'sidebar-search';
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search docs...';
        searchInput.addEventListener('input', (e) => {
            filterSidebar(e.target.value.toLowerCase());
        });
        searchContainer.appendChild(searchInput);
        sidebarContainer.appendChild(searchContainer);

        sidebarContainer.innerHTML += '<a href="/index.html" class="sidebar-home-link">Home</a>';
        data.forEach(category => {
            const container = document.createElement('div');
            container.className = 'sidebar-category';
            
            const head = document.createElement('div');
            head.className = 'category-header';
            head.textContent = category.name;
            head.addEventListener('click', (e) => {
                const content = e.currentTarget.nextElementSibling;
                content.style.display = content.style.display === 'block' ? 'none' : 'block';
                e.currentTarget.classList.toggle('collapsed');
            });
            
            const content = document.createElement('div');
            content.className = 'category-content';
            content.style.display = 'block'; // Expanded by default
            content.appendChild(buildList(category.content));
            
            container.appendChild(head);
            container.appendChild(content);
            sidebarContainer.appendChild(container);
        });
    }

    function filterSidebar(query) {
        const rows = sidebarContainer.querySelectorAll('.sidebar-item-row');
        const categories = sidebarContainer.querySelectorAll('.sidebar-category');
        
        if (!query) {
            // Reset visibility
            rows.forEach(r => {
                r.parentElement.style.display = 'block';
                r.style.opacity = '1';
            });
            categories.forEach(c => c.style.display = 'block');
            return;
        }

        categories.forEach(cat => {
            let hasMatch = false;
            const items = cat.querySelectorAll('li');
            items.forEach(li => {
                const text = li.querySelector('a').textContent.toLowerCase();
                if (text.includes(query)) {
                    li.style.display = 'block';
                    hasMatch = true;
                    // Ensure parents are visible
                    let p = li.parentElement.closest('li');
                    while (p) { p.style.display = 'block'; p = p.parentElement.closest('li'); }
                } else {
                    li.style.display = 'none';
                }
            });
            cat.style.display = hasMatch ? 'block' : 'none';
        });
    }

    function buildList(items) {
        const ul = document.createElement('ul');
        items.forEach(item => {
            const li = document.createElement('li');
            li.style.listStyle = 'none';
            
            const div = document.createElement('div');
            div.className = 'sidebar-item-row';
            div.style.display = 'flex';
            div.style.alignItems = 'center';

            const a = document.createElement('a');
            a.textContent = item.title;
            a.style.flexGrow = '1';
            if (item.path) {
                a.href = item.path;
                a.classList.add('has-link');
            } else {
                a.href = '#';
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    toggleSubmenu(li);
                });
            }
            
            div.appendChild(a);

            if (item.children) {
                const toggleBtn = document.createElement('span');
                toggleBtn.className = 'submenu-toggle';
                toggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    toggleSubmenu(li);
                });
                div.appendChild(toggleBtn); // Put arrow on the right
                
                li.appendChild(div);
                const subUl = buildList(item.children);
                subUl.style.display = 'block'; // Expanded by default
                li.appendChild(subUl);
                toggleBtn.classList.add('expanded');
            } else {
                li.appendChild(div);
            }
            
            ul.appendChild(li);
        });
        return ul;
    }

    function toggleSubmenu(li) {
        const sub = li.querySelector('ul');
        const toggle = li.querySelector('.submenu-toggle');
        if (sub) {
            const isHidden = sub.style.display === 'none';
            sub.style.display = isHidden ? 'block' : 'none';
            if (toggle) {
                toggle.classList.toggle('expanded', isHidden);
            }
        }
    }

    function highlightActive() {
        const path = window.location.pathname.replace(/\/$/, "");
        const links = sidebarContainer.querySelectorAll('a');
        links.forEach(link => {
            if (link.pathname === path || (path === "" && link.pathname === "/index.html")) {
                link.classList.add('active');
                let parent = link.closest('li');
                while (parent) {
                    const sub = parent.querySelector('ul');
                    if (sub) {
                        sub.style.display = 'block';
                        const toggle = parent.querySelector('.submenu-toggle');
                        if (toggle) toggle.classList.add('expanded');
                    }
                    const grandParentLi = parent.parentElement.closest('li');
                    if (!grandParentLi) {
                        // Check if we are in a top-level category
                        const categoryContent = parent.closest('.category-content');
                        if (categoryContent) {
                            categoryContent.style.display = 'block';
                        }
                        break;
                    }
                    parent = grandParentLi;
                }
            }
        });
    }

    function buildBreadcrumbs(data) {
        const path = window.location.pathname;
        const breadcrumb = document.getElementById('breadcrumb');
        if (!breadcrumb) return;

        const segments = path.replace(/^\/|\/$/g, '').split('/');
        const crumbs = [{ title: 'Home', path: '/index.html' }];
        
        // Try to find titles from path in sidebar data
        let currentPath = "";
        segments.forEach(seg => {
            if (seg.toLowerCase() === "megalodocs") return;
            currentPath += "/" + seg;
            // Simple lookup logic or just capitalize segment
            crumbs.push({ title: seg.charAt(0).toUpperCase() + seg.slice(1).replace(".html", ""), path: currentPath });
        });

        breadcrumb.innerHTML = crumbs.map(c => `<a href="${c.path}">${c.title}</a>`).join(' > ');
    }

    function buildPageTOC() {
        const headings = document.querySelectorAll('#main h2');
        if (headings.length < 2) return;

        // ... Existing TOC logic ...
        const tocWrapper = document.createElement('div');
        tocWrapper.id = 'page-toc-wrapper';
        const tocTitle = document.createElement('h3');
        tocTitle.textContent = 'On this page';
        tocWrapper.appendChild(tocTitle);

        const ul = document.createElement('ul');
        headings.forEach((h, i) => {
            if (!h.id) h.id = 'heading-' + i;
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#' + h.id;
            a.textContent = h.textContent;
            li.appendChild(a);
            ul.appendChild(li);

            // Addition: Make H2 collapsible
            h.style.cursor = 'pointer';
            h.innerHTML = `<span class="h2-toggle"></span>` + h.innerHTML;
            h.addEventListener('click', () => {
                h.classList.toggle('collapsed');
                let next = h.nextElementSibling;
                while (next && next.tagName !== 'H2') {
                    next.style.display = h.classList.contains('collapsed') ? 'none' : 'block';
                    next = next.nextElementSibling;
                }
            });
        });
        tocWrapper.appendChild(ul);
        document.body.appendChild(tocWrapper);
    }

    // Call it after some delay to ensure content is there
    setTimeout(buildPageTOC, 500);

    // Final fallback reveal for Firefox or any other browser issues
    window.addEventListener('load', () => {
        document.body.style.display = 'grid';
    });
});
