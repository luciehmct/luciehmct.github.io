// This file contains JavaScript code for interactivity on the website, such as form validation or dynamic content loading.

document.addEventListener('DOMContentLoaded', function() {
    // Form validation for the contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                event.preventDefault();
                alert('Please fill in all fields.');
                return;
            }

            // For now we'll prevent a real submit and show a friendly message
            event.preventDefault();
            alert('Thanks ' + name + '! I received your message (demo).');
            contactForm.reset();
        });
    }

    // Load projects dynamically from projects.json
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
        fetch('./data/projects.json')
            .then(response => response.json())
            .then(data => renderProjects(data.projects || []))
            .catch(error => {
                console.error('Error loading projects:', error);
                projectsContainer.innerHTML = '<p>Unable to load projects.</p>';
            });
    }

    function renderProjects(projects) {
        const container = document.getElementById('projects-container');
        if (!container) return;
        container.innerHTML = '';
        projects.forEach(p => {
            const div = document.createElement('article');
            div.className = 'project';
            const tagsHtml = (p.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join(' ');
            const thumbHtml = p.presentation_thumbnail ? `<p><a href="${p.presentation || p.link || '#'}" target="_blank" rel="noopener"><img class="project-thumb" src="${p.presentation_thumbnail}" alt="${escapeHtml(p.title)} slide"></a></p>` : '';
                // Build action buttons. If both repo + read more exist, render repo on the left and read-more on the right.
                const readMoreHtml = p.page ? `<a class="btn small read-more-link" href="${p.page}">Read more</a>` : '';
                const repoHtml = p.link ? `<a class="btn small repo-link" href="${p.link}" target="_blank" rel="noopener">Repository / Link</a>` : '';
                let actionsHtml = '';
                if (repoHtml && readMoreHtml) {
                    // repo left, read more right with space between
                    actionsHtml = `<p class="project-actions two">${repoHtml}${readMoreHtml}</p>`;
                } else if (repoHtml) {
                    actionsHtml = `<p class="project-actions single">${repoHtml}</p>`;
                } else if (readMoreHtml) {
                    actionsHtml = `<p class="project-actions single">${readMoreHtml}</p>`;
                }

                div.innerHTML = `
                    ${thumbHtml}
                    <h3>${escapeHtml(p.title)}</h3>
                    <p class="affiliation">${p.affiliation ? escapeHtml(p.affiliation) : ''}</p>
                    <p>${escapeHtml(p.description)}</p>
                    ${p.notes ? `<p class="notes">${escapeHtml(p.notes)}</p>` : ''}
                    ${tagsHtml ? `<p class="tags">${tagsHtml}</p>` : ''}
                    ${actionsHtml}
                `;
            container.appendChild(div);
        });
    }

    function escapeHtml(str){
        if(!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // (removed) footer year autopopulate — footer removed from pages

    // Slide navigation: next/prev buttons and keyboard arrows
    document.querySelectorAll('.slide-control button[data-target]').forEach(btn => {
        btn.addEventListener('click', e => {
            const target = document.querySelector(btn.getAttribute('data-target'));
            if (target) target.scrollIntoView({behavior: 'smooth', block: 'start'});
        });
    });

    // keyboard navigation: left/right arrows
    const slides = Array.from(document.querySelectorAll('.slide'));
    function currentSlideIndex(){
        // If we have a scrollable slides container (main#slides), prefer its scrollTop/offsetTop
        if (slidesContainer) {
            const scrollTop = slidesContainer.scrollTop;
            for (let i = 0; i < slides.length; i++) {
                const top = slides[i].offsetTop;
                const height = slides[i].offsetHeight;
                if (scrollTop + 20 >= top && scrollTop < top + height - 20) return i;
            }
            return 0;
        }
        // Fallback: page-level scrolling
        const scrollY = window.scrollY || window.pageYOffset;
        for (let i = 0; i < slides.length; i++) {
            const rect = slides[i].getBoundingClientRect();
            const top = rect.top + window.scrollY;
            if (scrollY + 20 >= top && scrollY < top + rect.height - 20) return i;
        }
        return 0;
    }

    window.addEventListener('keydown', (e)=>{
        if (e.key === 'ArrowRight' || e.key === 'PageDown'){
            const idx = currentSlideIndex();
            const next = slides[idx+1] || slides[idx];
            // Prefer scrolling the slides container if present
            if (slidesContainer) {
                slidesContainer.scrollTo({ top: next.offsetTop, behavior: 'smooth' });
            } else {
                next.scrollIntoView({behavior:'smooth', block:'start'});
            }
        }
        if (e.key === 'ArrowLeft' || e.key === 'PageUp'){
            const idx = currentSlideIndex();
            const prev = slides[idx-1] || slides[idx];
            if (slidesContainer) {
                slidesContainer.scrollTo({ top: prev.offsetTop, behavior: 'smooth' });
            } else {
                prev.scrollIntoView({behavior:'smooth', block:'start'});
            }
        }
    });

    // Show header when the slides container is at the top of the page
    const slidesContainer = document.getElementById('slides');
    const headerEl = document.querySelector('header');
    function updateHeaderVisibility(){
        if(!slidesContainer || !headerEl) return;
        // show header when at very top
        if (slidesContainer.scrollTop <= 10) {
            headerEl.classList.add('visible');
        } else {
            headerEl.classList.remove('visible');
        }
    }
    // initialize and listen for scrolls
    updateHeaderVisibility();
    slidesContainer && slidesContainer.addEventListener('scroll', updateHeaderVisibility, {passive:true});

    // Also reveal header when the mouse is near the top of the viewport.
    // This uses requestAnimationFrame to avoid flooding with mousemove events.
    const MOUSE_TOP_THRESHOLD = 70; // px from top
    let rafId = null;
    let hideHeaderTimeout = null;

    function handleMouseNearTop(clientY){
        if(!headerEl || !slidesContainer) return;
        if (clientY <= MOUSE_TOP_THRESHOLD) {
            // pointer near top -> show header immediately
            headerEl.classList.add('visible');
            if (hideHeaderTimeout) { clearTimeout(hideHeaderTimeout); hideHeaderTimeout = null; }
        } else {
            // pointer moved away from top: hide header only if user is not at the very top
            if (slidesContainer.scrollTop > 10) {
                // small delay to reduce flicker when pointer briefly leaves
                if (hideHeaderTimeout) clearTimeout(hideHeaderTimeout);
                hideHeaderTimeout = setTimeout(() => {
                    headerEl.classList.remove('visible');
                    hideHeaderTimeout = null;
                }, 220);
            }
        }
    }

    window.addEventListener('mousemove', (e) => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            handleMouseNearTop(e.clientY);
            rafId = null;
        });
    }, {passive: true});

    // Hide header when user touches (mobile) unless at top — keep behavior consistent
    window.addEventListener('touchstart', () => {
        if (!slidesContainer || !headerEl) return;
        if (slidesContainer.scrollTop > 10) headerEl.classList.remove('visible');
    }, {passive: true});

    // Touch / swipe support for mobile: vertical swipes navigate slides
    let touchStartY = null;
    let touchStartX = null;
    let lastSwipeAt = 0;
    const SWIPE_THRESHOLD = 60; // pixels
    const SWIPE_DEBOUNCE_MS = 300;

    function handleSwipe(deltaY){
        const now = Date.now();
        if (now - lastSwipeAt < SWIPE_DEBOUNCE_MS) return;
        lastSwipeAt = now;
        const idx = currentSlideIndex();
        if (deltaY < -SWIPE_THRESHOLD){
            // swipe up -> next
            const next = slides[idx+1] || slides[idx];
            if (slidesContainer) slidesContainer.scrollTo({ top: next.offsetTop, behavior: 'smooth' });
            else next.scrollIntoView({behavior:'smooth', block:'start'});
        } else if (deltaY > SWIPE_THRESHOLD){
            // swipe down -> previous
            const prev = slides[idx-1] || slides[idx];
            if (slidesContainer) slidesContainer.scrollTo({ top: prev.offsetTop, behavior: 'smooth' });
            else prev.scrollIntoView({behavior:'smooth', block:'start'});
        }
    }

    let touchScrollableEl = null;
    function findScrollableAncestor(el){
        while(el && el !== document.body){
            const style = window.getComputedStyle(el);
            const overflowY = style.overflowY;
            if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight){
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }

    window.addEventListener('touchstart', function(e){
        if (!e.touches || e.touches.length > 1) return;
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        touchScrollableEl = findScrollableAncestor(e.target);
    }, {passive: true});

    window.addEventListener('touchend', function(e){
        if (touchStartY === null) return;
        const touch = e.changedTouches && e.changedTouches[0];
        if (!touch) { touchStartY = null; touchStartX = null; touchScrollableEl = null; return; }
        const deltaY = touch.clientY - touchStartY;
        const deltaX = touch.clientX - touchStartX;
        // ignore mostly-horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY)){
            touchStartY = null; touchStartX = null; touchScrollableEl = null; return;
        }
        // If touch started inside a scrollable element that can scroll in the swipe direction, don't trigger slide navigation
        if (touchScrollableEl){
            if (deltaY < 0 && (touchScrollableEl.scrollTop + touchScrollableEl.clientHeight < touchScrollableEl.scrollHeight)){
                // swiped up but inner element can scroll down further -> don't navigate
                touchStartY = null; touchStartX = null; touchScrollableEl = null; return;
            }
            if (deltaY > 0 && (touchScrollableEl.scrollTop > 0)){
                // swiped down but inner element can scroll up -> don't navigate
                touchStartY = null; touchStartX = null; touchScrollableEl = null; return;
            }
        }
        handleSwipe(deltaY);
        touchStartY = null; touchStartX = null; touchScrollableEl = null;
    }, {passive: true});

    // Trackpad / wheel gesture support for desktop: accumulate wheel delta and navigate when threshold reached
    let wheelAccum = 0;
    let lastWheelTimeStamp = 0;
    const WHEEL_TIMEOUT = 300; // ms window to accumulate
    const WHEEL_THRESHOLD = 120; // accumulated delta to trigger
    const WHEEL_DEBOUNCE_MS = 500; // debounce between navigations
    let lastWheelNav = 0;

    window.addEventListener('wheel', function(e){
        // ignore wheel when focus is on inputs or if ctrl/meta pressed (zoom/pinch)
        const tag = document.activeElement && document.activeElement.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable) return;
        if (e.ctrlKey || e.metaKey) return;

        // if the wheel event happened inside a scrollable container that can scroll further in this direction, allow native scroll
        const sc = findScrollableAncestor(e.target);
        if (sc){
            if (e.deltaY > 0 && (sc.scrollTop + sc.clientHeight < sc.scrollHeight)) return;
            if (e.deltaY < 0 && (sc.scrollTop > 0)) return;
        }

        const now = Date.now();
        if (now - lastWheelNav < WHEEL_DEBOUNCE_MS) return;

        if (now - lastWheelTimeStamp > WHEEL_TIMEOUT) {
            wheelAccum = 0;
        }
        wheelAccum += e.deltaY;
        lastWheelTimeStamp = now;

            if (Math.abs(wheelAccum) >= WHEEL_THRESHOLD) {
            // trigger navigation
            const idx = currentSlideIndex();
            if (wheelAccum > 0) {
                // scroll down -> next
                const next = slides[idx+1] || slides[idx];
                if (slidesContainer) slidesContainer.scrollTo({ top: next.offsetTop, behavior: 'smooth' });
                else next.scrollIntoView({behavior:'smooth', block:'start'});
            } else {
                // scroll up -> prev
                const prev = slides[idx-1] || slides[idx];
                if (slidesContainer) slidesContainer.scrollTo({ top: prev.offsetTop, behavior: 'smooth' });
                else prev.scrollIntoView({behavior:'smooth', block:'start'});
            }
            wheelAccum = 0;
            lastWheelNav = now;
        }
    }, {passive: true});

    // If on a project page, populate the left TOC and prev/next arrows from data/projects.json
    (function setupProjectNav(){
        const tocList = document.getElementById('project-toc-list');
        const prevBtn = document.getElementById('project-prev');
        const nextBtn = document.getElementById('project-next');
        if (!tocList && !prevBtn && !nextBtn) return;

        // Resolve projects.json path depending on location
        let projectsPath = './data/projects.json';
        if (window.location.pathname.indexOf('/projects/') !== -1) projectsPath = '../data/projects.json';
        // also try absolute if needed
        fetch(projectsPath)
            .then(r => r.json())
            .then(data => {
                const projects = data.projects || [];
                // Populate TOC
                if (tocList) {
                    tocList.innerHTML = '';
                    projects.forEach((p, i) => {
                        const li = document.createElement('li');
                        const a = document.createElement('a');
                        // root-relative link so it works from any location
                        a.href = '/' + p.page;
                        // Display full title, but replace em-dash with a simple hyphen for readability
                        const displayTitle = (p.title || '').replace(/\s*—\s*/g, ' - ');
                        a.textContent = displayTitle;
                        li.appendChild(a);
                        tocList.appendChild(li);
                    });
                }

                // Determine current project index
                const pathname = window.location.pathname;
                // pathname like /projects/cadmium-catcher.html
                let currentIndex = projects.findIndex(p => pathname.endsWith(p.page.replace(/^projects\//, '')) || pathname.endsWith('/' + p.page) || pathname === ('/' + p.page));
                // Fallback: match by title slug
                if (currentIndex === -1) {
                    const file = pathname.split('/').pop();
                    currentIndex = projects.findIndex(p => p.page && p.page.endsWith(file));
                }
                if (currentIndex === -1) return;

                // Highlight active TOC entry
                if (tocList) {
                    const items = tocList.querySelectorAll('li');
                    items.forEach((li, idx) => {
                        if (idx === currentIndex) {
                            li.classList.add('active');
                            const link = li.querySelector('a');
                            if (link) link.setAttribute('aria-current', 'true');
                        } else {
                            li.classList.remove('active');
                        }
                    });
                }

                // Set prev/next links
                if (prevBtn) {
                    const prevIdx = (currentIndex - 1 + projects.length) % projects.length;
                    prevBtn.href = '/' + projects[prevIdx].page;
                    prevBtn.title = 'Previous: ' + projects[prevIdx].title;
                }
                if (nextBtn) {
                    const nextIdx = (currentIndex + 1) % projects.length;
                    nextBtn.href = '/' + projects[nextIdx].page;
                    nextBtn.title = 'Next: ' + projects[nextIdx].title;
                }
            })
            .catch(err => console.error('Could not load projects for project navigation', err));
    })();

    // Position the left project-nav arrow dynamically to sit just right of the TOC.
    // This avoids hard-coded pixel tweaks and keeps the arrow aligned across widths.
    (function positionLeftArrow(){
        const leftArrow = () => document.querySelector('.proj-nav.left');
        const tocEl = () => document.querySelector('.project-toc');

        function update() {
            const arrow = leftArrow();
            if (!arrow) return;
            const toc = tocEl();
            const gap = 12; // px gap between TOC and arrow
            const extraLeftShift = -48; // negative moves arrow further left from toc.right + gap
            if (toc) {
                const rect = toc.getBoundingClientRect();
                // rect.right is relative to viewport; use it directly since arrow is fixed
                const newLeft = Math.round(rect.right + gap + extraLeftShift);
                arrow.style.left = newLeft + 'px';
            } else {
                // fallback: keep it near the left edge
                arrow.style.left = '22px';
            }
        }

        // debounce helper
        let t = null;
        function debouncedUpdate() {
            if (t) clearTimeout(t);
            t = setTimeout(() => { update(); t = null; }, 80);
        }

        // run after a brief delay to allow fonts/images to layout
        setTimeout(update, 120);
        window.addEventListener('resize', debouncedUpdate, {passive:true});
        // if layout changes (images load), observe size changes of the TOC
        if (window.ResizeObserver && tocEl()) {
            const ro = new ResizeObserver(debouncedUpdate);
            ro.observe(tocEl());
        }
    })();

    // Hide/show floating contact when the Presentation slide is visible.
    const floatingContact = document.getElementById('floating-contact');
    const presentationSection = document.getElementById('presentation');
    if (floatingContact && presentationSection && 'IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    floatingContact.classList.add('hidden-by-presentation');
                } else {
                    floatingContact.classList.remove('hidden-by-presentation');
                }
            });
        }, { root: null, threshold: 0.6 });
        obs.observe(presentationSection);
    }
});