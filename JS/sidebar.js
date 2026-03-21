document.addEventListener('DOMContentLoaded', function() {
    const sidebarContainer = document.querySelector('#sidebar');
    const toggle = document.getElementById('theme-toggle');

    try {
        // Theme Management
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
        
        let label = document.getElementById('theme-label');
        if (!label) {
            label = document.createElement('p');
            label.id = 'theme-label';
            toggle.parentNode.insertBefore(label, toggle.nextSibling);
        }
        label.textContent = theme;
        
        toggle.classList.add('rotate');
        setTimeout(() => toggle.classList.remove('rotate'), 600);
        
        // Final reveal
        document.body.style.display = "grid";
    }

    // Media query listener for when in 'System' mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
        if (localStorage.getItem('theme') === 'System') {
            // CSS handles this automatically now via media query
            // but we can force a repaint or update labels if needed
        }
    });

    // 0. Path & Root calculation (for relative path portability on GH Pages)
    const scriptSrc = document.querySelector('script[src*="sidebar.js"]').src;
    const rootPath = scriptSrc.split('/JS/sidebar.js')[0]; // Extract the full domain + repo subfolder

    // 2. Sidebar Loading & Rendering
    if (sidebarContainer) {
        fetch(rootPath + '/JSON/sidebar.json?v=' + Date.now())
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

        const homeLink = document.createElement('a');
        homeLink.href = rootPath + '/index.html';
        homeLink.className = 'sidebar-home-link';
        homeLink.textContent = 'Home';
        sidebarContainer.appendChild(homeLink);

        data.forEach(category => {
            const container = document.createElement('div');
            container.className = 'sidebar-category';
            
            const head = document.createElement('div');
            head.className = 'category-header collapsed';
            head.textContent = category.name;
            head.addEventListener('click', (e) => {
                const content = e.currentTarget.nextElementSibling;
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? 'block' : 'none';
                e.currentTarget.classList.toggle('collapsed', !isHidden);
            });
            
            const content = document.createElement('div');
            content.className = 'category-content';
            content.style.display = 'none'; // Collapsed by default
            content.appendChild(buildList(category.content));
            
            container.appendChild(head);
            container.appendChild(content);
            sidebarContainer.appendChild(container);
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
                if (item.path.startsWith('http') || item.path.startsWith('#')) {
                    a.href = item.path;
                } else {
                    a.href = rootPath + '/' + item.path;
                }
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
                div.appendChild(toggleBtn);
                
                li.appendChild(div);
                const subUl = buildList(item.children);
                subUl.style.display = 'none'; // Collapsed by default
                li.appendChild(subUl);
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
        const currentURL = window.location.href.split('?')[0].split('#')[0].replace(/\/$/, "").toLowerCase();
        console.log("Sidebar: Attempting to highlight active link for:", currentURL);
        
        const links = sidebarContainer.querySelectorAll('a.has-link');
        let activeLink = null;

        console.log("Sidebar: Checking " + links.length + " links...");

        links.forEach(link => {
            const rawHref = link.getAttribute('href');
            if (!rawHref || rawHref === '#' || rawHref.startsWith('javascript:')) return;

            try {
                const linkURL = new URL(link.href, window.location.origin).href.split('?')[0].split('#')[0].replace(/\/$/, "").toLowerCase();
                if (currentURL === linkURL) {
                    activeLink = link;
                }
            } catch(e) { }
        });

        if (activeLink) {
            console.log("Sidebar: MATCH FOUND!", activeLink.href);
            activeLink.classList.add('active');
            
            // 1. Force Expand ALL Parents (Bottom-Up)
            let current = activeLink.parentElement;
            while (current && current !== sidebarContainer) {
                // Expand Sub-menus (ULs)
                if (current.tagName === 'UL') {
                    current.style.display = 'block';
                    const row = current.parentElement.querySelector('.sidebar-item-row');
                    if (row) {
                        const toggle = row.querySelector('.submenu-toggle');
                        if (toggle) toggle.classList.add('expanded');
                    }
                }
                
                // Expand Main Categories (category-content)
                if (current.classList.contains('category-content')) {
                    current.style.display = 'block';
                    const head = current.previousElementSibling;
                    if (head && head.classList.contains('category-header')) {
                        head.classList.remove('collapsed');
                    }
                }
                
                current = current.parentElement;
            }

            // 2. Aggressive Center Scroll
            setTimeout(() => {
                activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            
            setTimeout(() => {
                activeLink.scrollIntoView({ behavior: 'auto', block: 'center' });
            }, 600);
        } else {
            console.warn("Sidebar: No active link match found for:", currentURL);
        }
    }

    function buildBreadcrumbs(data) {
        const path = window.location.pathname;
        const breadcrumb = document.getElementById('breadcrumb');
        if (!breadcrumb) return;

        // Clean path (strip repo prefix if present)
        let cleanPath = path;
        const repoPrefix = "/MegaloDocs";
        if (cleanPath.startsWith(repoPrefix)) {
            cleanPath = cleanPath.slice(repoPrefix.length);
        }

        const segments = cleanPath.split('/').filter(s => s);
        const crumbs = [{ title: 'Home', path: rootPath + '/index.html' }];
        
        let buildingPath = "";
        segments.forEach((seg, i) => {
            buildingPath += "/" + seg;
            // Last crumb might be the current page h1 title
            let title = seg.replace(".html", "").replace(/-/g, " ");
            title = title.charAt(0).toUpperCase() + title.slice(1);
            
            if (i === segments.length - 1) {
                const mainH1 = document.querySelector('main h1');
                if (mainH1) title = mainH1.textContent;
            }
            
            crumbs.push({ 
                title: title, 
                path: rootPath + buildingPath 
            });
        });

        breadcrumb.innerHTML = crumbs.map((c, i) => {
            if (i === crumbs.length - 1) return `<span>${c.title}</span>`;
            return `<a href="${c.path}">${c.title}</a>`;
        }).join(' <i class="fas fa-chevron-right separator"></i> ');
    }

    function buildPageTOC() {
        const headings = document.querySelectorAll('#main h2');
        if (headings.length < 2) return;

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

    function filterSidebar(query) {
        const categories = sidebarContainer.querySelectorAll('.sidebar-category');
        
        if (!query) {
            categories.forEach(c => {
                c.style.display = 'block';
                // Reset internal list items if needed or leave as is if we want to keep state
            });
            return;
        }

        categories.forEach(cat => {
            let hasMatch = false;
            const items = cat.querySelectorAll('li');
            items.forEach(li => {
                const link = li.querySelector('a');
                const text = link.textContent.toLowerCase();
                if (text.includes(query)) {
                    li.style.display = 'block';
                    hasMatch = true;
                    // Expand parents if searching
                    let p = li.parentElement.closest('ul');
                    while (p) { p.style.display = 'block'; p = p.parentElement.closest('ul'); }
                } else {
                    li.style.display = 'none';
                }
            });
            cat.style.display = hasMatch ? 'block' : 'none';
            if (hasMatch) {
                const head = cat.querySelector('.category-header');
                const content = cat.querySelector('.category-content');
                if (head) head.classList.remove('collapsed');
                if (content) content.style.display = 'block';
            }
        });
    }

    setTimeout(buildPageTOC, 500);

    window.addEventListener('load', () => {
        document.body.style.display = 'grid';
    });
});
