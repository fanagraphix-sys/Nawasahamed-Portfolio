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
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        document.body.classList.add('light-theme');
    }
    
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        // Save user preference
        if (document.body.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });

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

    /* ==========================================================================
       LIGHTBOX POPUP
       ========================================================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxClose = document.querySelector('.lightbox-close');
    const viewButtons = document.querySelectorAll('.btn-view-project');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Find relative card information
            const card = btn.closest('.portfolio-item-card');
            const img = card.querySelector('.project-img');
            const title = card.querySelector('.project-title').textContent;
            const category = card.querySelector('.project-category').textContent;
            
            lightboxImg.src = img.src;
            lightboxCategory.textContent = category;
            lightboxTitle.textContent = title;
            
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
        });
    });
    
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    };
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        // Close if click is outside target content image
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
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
