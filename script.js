document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       CUSTOM CURSOR
       ========================================================================== */
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    if (cursor && cursorDot) {
        document.addEventListener('mousemove', (e) => {
            // Smoothly track mouse movements
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
        });

        // Hover scale effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .portfolio-item-card, .filter-btn');
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                cursor.style.borderColor = 'transparent';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = 'transparent';
                cursor.style.borderColor = 'var(--gold)';
            });
        });
    }

    /* ==========================================================================
       LIGHT & DARK THEME SWITCHER
       Dark is the default; the selected theme is remembered between visits.
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');

    const readSavedTheme = () => {
        try { return localStorage.getItem('theme'); }
        catch (error) { return null; }
    };

    const applyTheme = (theme, save = false) => {
        const isLight = theme === 'light';
        document.body.classList.toggle('light-theme', isLight);
        document.documentElement.classList.toggle('light-theme', isLight);
        document.documentElement.style.colorScheme = isLight ? 'light' : 'dark';

        if (themeToggleBtn) {
            themeToggleBtn.setAttribute('aria-pressed', String(isLight));
            themeToggleBtn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
            themeToggleBtn.setAttribute('title', isLight ? 'Switch to dark mode' : 'Switch to light mode');
        }

        if (save) {
            try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); }
            catch (error) { /* Theme still works when storage is unavailable. */ }
        }
    };

    const savedTheme = readSavedTheme();
    applyTheme(savedTheme === 'light' ? 'light' : 'dark');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const nextTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
            applyTheme(nextTheme, true);
        });
    }

    /* ==========================================================================
       MOBILE NAVIGATION OVERLAY
       ========================================================================== */
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    const toggleMobileMenu = () => {
        hamburgerBtn.classList.toggle('active');
        mobileNavOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    };
    
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Close menu after clicking link
            if (mobileNavOverlay.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    /* ==========================================================================
       REVEAL ON SCROLL & ACTIVE NAV SYNC (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealItems = document.querySelectorAll('.reveal-item, .service-card, .timeline-item, .portfolio-item-card');
    
    // Configure observer
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing after animation triggers
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealItems.forEach(item => {
        // Prepare initial classes for grid items/cards dynamically
        if (!item.classList.contains('reveal-item')) {
            item.classList.add('reveal-item');
        }
        revealObserver.observe(item);
    });

    // Navigation Link Highlighter
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
    
    const activeSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        root: null,
        threshold: 0.5,
        rootMargin: '-80px 0px -50% 0px'
    });
    
    sections.forEach(section => activeSectionObserver.observe(section));

    /* ==========================================================================
       PORTFOLIO CATEGORY FILTERING
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Set active class
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === category) {
                    item.classList.remove('hide');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.classList.add('hide');
                    }, 400); // Matches transitions
                }
            });
        });
    });

    /* ======================================================================
       SQUARE GALLERY POPUP - posters and logos
    ====================================================================== */
    const galleryModal = document.getElementById('na-image-modal');
    const galleryImage = document.getElementById('na-modal-image');
    const galleryTitle = document.getElementById('na-modal-title');
    const galleryCategory = document.getElementById('na-modal-category');
    const galleryClose = galleryModal ? galleryModal.querySelector('.na-modal-close') : null;

    // Add extra poster/logo files by listing them in assets/gallery.json.
    // Static browser pages cannot automatically enumerate every file in a folder.
    const buildPosterCard = (item) => {
        const src = String(item.src || '').trim();
        if (!src) return null;
        const title = String(item.title || 'Creative Design');
        const category = String(item.category || 'Graphic Design');
        const card = document.createElement('article');
        card.className = 'na-poster-card portfolio-item-card';
        const button = document.createElement('button');
        button.className = 'na-gallery-trigger';
        button.type = 'button';
        button.setAttribute('aria-label', `Open ${title}`);
        button.dataset.image = src;
        button.dataset.title = title;
        button.dataset.category = category;
        const imageWrap = document.createElement('span');
        imageWrap.className = 'na-poster-image';
        const image = document.createElement('img');
        image.className = 'project-img';
        image.src = src; image.alt = title; image.loading = 'lazy';
        imageWrap.appendChild(image);
        const caption = document.createElement('span');
        caption.className = 'na-poster-caption';
        caption.innerHTML = `<span class="project-meta"><span class="project-category"></span><span class="project-title"></span></span><span class="btn-view-project" aria-hidden="true">↗</span>`;
        caption.querySelector('.project-category').textContent = category;
        caption.querySelector('.project-title').textContent = title;
        button.append(imageWrap, caption); card.appendChild(button);
        return card;
    };
    const buildLogoCard = (item) => {
        const src = String(item.src || '').trim();
        if (!src) return null;
        const title = String(item.title || 'Brand Logo');
        const card = document.createElement('button');
        card.className = 'na-logo-card na-gallery-trigger';
        card.type = 'button'; card.dataset.image = src; card.dataset.title = title;
        card.dataset.category = 'Brand Identity';
        card.setAttribute('aria-label', `View ${title}`);
        const inner = document.createElement('span'); inner.className = 'na-logo-inner';
        const image = document.createElement('img'); image.src = src; image.alt = title; image.loading = 'lazy';
        inner.appendChild(image);
        const open = document.createElement('span'); open.className = 'na-logo-open'; open.textContent = 'VIEW LOGO ↗';
        card.append(inner, open); return card;
    };
    const prepareMarquees = async () => {
        try {
            const response = await fetch('assets/gallery.json', { cache: 'no-cache' });
            if (response.ok) {
                const additions = await response.json();
                const posterTracks = document.querySelectorAll('.na-poster-track');
                const logoTrack = document.querySelector('.na-logo-track-main');
                (Array.isArray(additions.extraPosters) ? additions.extraPosters : []).forEach((item, index) => {
                    const card = buildPosterCard(item);
                    if (card && posterTracks.length) posterTracks[index % posterTracks.length].appendChild(card);
                });
                (Array.isArray(additions.extraLogos) ? additions.extraLogos : []).forEach(item => {
                    const card = buildLogoCard(item);
                    if (card && logoTrack) logoTrack.appendChild(card);
                });
            }
        } catch (error) {
            // Keep the original portfolio visible if the optional JSON file is missing.
        }
        document.querySelectorAll('.na-poster-track, .na-logo-track-main').forEach(track => {
            if (track.dataset.loopReady === '1') return;
            Array.from(track.children).forEach(item => {
                const clone = item.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                clone.querySelectorAll('button').forEach(button => button.setAttribute('tabindex', '-1'));
                track.appendChild(clone);
            });
            track.dataset.loopReady = '1';
        });
    };
    prepareMarquees();

    const openGalleryModal = (trigger) => {
        if (!galleryModal || !galleryImage) return;
        const image = trigger.dataset.image || trigger.querySelector('img')?.getAttribute('src');
        if (!image) return;
        galleryImage.src = image;
        galleryImage.alt = trigger.dataset.title || trigger.querySelector('img')?.alt || 'Portfolio preview';
        galleryTitle.textContent = trigger.dataset.title || galleryImage.alt;
        galleryCategory.textContent = trigger.dataset.category || 'Portfolio';
        galleryModal.classList.add('is-open');
        galleryModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('na-modal-active');
        if (galleryClose) galleryClose.focus();
    };
    const closeGalleryModal = () => {
        if (!galleryModal) return;
        galleryModal.classList.remove('is-open');
        galleryModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('na-modal-active');
        window.setTimeout(() => { if (galleryImage) galleryImage.src = ''; }, 250);
    };
    document.addEventListener('click', (event) => {
        const trigger = event.target.closest('.na-gallery-trigger');
        if (trigger && !trigger.closest('[aria-hidden="true"]')) {
            event.preventDefault();
            openGalleryModal(trigger);
        }
    });
    if (galleryClose) galleryClose.addEventListener('click', closeGalleryModal);
    if (galleryModal) galleryModal.addEventListener('click', event => {
        if (event.target === galleryModal) closeGalleryModal();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && galleryModal?.classList.contains('is-open')) closeGalleryModal();
    });

    /* ==========================================================================
       DYNAMIC CV GENERATION & DOWNLOAD
       ========================================================================== */
    const downloadCvButtons = document.querySelectorAll('.btn-cv-download, #download-cv-btn');
    
    downloadCvButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create a rich text resume layout content dynamically
            const cvContent = `
=========================================
NAWAS AHAMED - GRAPHIC DESIGNER RESUME
=========================================
Phone: +91 86101 83525
Specialization: Branding, Print Design, Social Media Creatives, Visual Identity

PROFILE
-----------------------------------------
Creative and highly motivated Graphic Designer specializing in developing unique corporate branding identities, digital marketing creatives, social media packages, and premium layout systems for print media. Dedicated to creating bespoke design solutions that improve conversions and raise brand authority.

TECHNICAL EXPERTISE
-----------------------------------------
- Design Tools: Adobe Photoshop, Adobe Illustrator, Adobe InDesign, Canva
- Skills: Typography, Color Theory, Brand Layouts, Package Branding, Vector Graphics, Pre-press Setup

PROFESSIONAL EXPERIENCE
-----------------------------------------
1. Graphic Designer
   Zylox Infotech | 2025 - 2026
   - Concepted and developed custom corporate brand design assets.
   - Crafted high-performance social media promotional creatives.
   - Designed visiting cards, letterheads, and logo files for diverse business sectors.

2. Graphic Designer
   Crescent Webtech | 2023 - 2024
   - Developed custom corporate branding assets and vector publications.
   - Designed advertising flyers, marketing materials, and digital creatives.
   - Collaborated with layout teams to ensure visual standard accuracy.

3. Graphic Designer
   Chroma - Chennai | 2021 - 2022
   - Structured visual print publications, corporate brochures, and flyers.
   - Assured exact layout checks and color calibration for physical press runs.
   - Collaborated with creative leads to refine digital visual marketing approaches.

SERVICES
-----------------------------------------
- Corporate Branding & Complete Visual Kits
- Scalable Logo Design & Wordmarks
- Print Layouts (Brochures, Catalogues, Leaflets)
- Visiting Cards & Custom Stationery Kits
- Web Banners & Social Media Creative Layouts
=========================================
Thank you for downloading Nawas Ahamed's Professional Portfolio CV.
`;
            
            // Generate Blob and trigger download
            const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', 'Nawas_Ahamed_Graphic_Designer_CV.txt');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });



    // Set active year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});


/* Nawas Ahamed portfolio enhancements: safe interaction helpers */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.na-poster-card .btn-view-project').forEach(function (button) {
    button.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); button.click(); }
    });
  });
  document.querySelectorAll('.na-site-preview, .na-site-link').forEach(function (link) {
    link.setAttribute('rel', 'noopener noreferrer');
    link.setAttribute('target', '_blank');
  });
});


// If a website screenshot service is unavailable, keep the branded fallback visible.
document.addEventListener('error', (event) => {
    if (event.target && event.target.classList && event.target.classList.contains('na-site-shot')) {
        event.target.remove();
    }
}, true);
