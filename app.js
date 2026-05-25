document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================================
    // 1. STICKY HEADER BEHAVIOR
    // =========================================================================
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Dynamic navigation link active states on scroll
        updateActiveNavLink();
    });

    // =========================================================================
    // 2. MOBILE MENU & BURGER TOGGLE
    // =========================================================================
    const burgerToggle = document.getElementById('burger-toggle');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const headerCtaBtn = document.getElementById('header-cta-btn');
    const mobileCtaBtn = document.getElementById('mobile-cta-btn');
    const heroExploreBtn = document.getElementById('hero-explore-btn');
    
    function toggleMobileMenu() {
        burgerToggle.classList.toggle('open');
        mobileMenuOverlay.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    }

    burgerToggle.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuOverlay.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // Scroll to form from CTA buttons
    const scrollToForm = (e) => {
        e.preventDefault();
        const contactSection = document.getElementById('contacts');
        
        if (mobileMenuOverlay.classList.contains('open')) {
            toggleMobileMenu();
        }
        
        contactSection.scrollIntoView({ behavior: 'smooth' });
        // Focus name field
        setTimeout(() => {
            document.getElementById('user-name').focus();
        }, 800);
    };

    headerCtaBtn.addEventListener('click', scrollToForm);
    mobileCtaBtn.addEventListener('click', scrollToForm);

    const heroCta = document.getElementById('hero-cta-btn');
    if (heroCta) heroCta.addEventListener('click', scrollToForm);

    if (heroExploreBtn) {
        heroExploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('construction').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // =========================================================================
    // 3. STICKY SCROLL CONSTRUCTION DIAGRAM
    // =========================================================================
    const svgProfile = document.getElementById('svg-profile');
    const svgLight = document.getElementById('svg-light');
    const svgCanvas = document.getElementById('svg-canvas');
    const stageDots = document.querySelectorAll('.stage-dot');
    const stageBlocks = document.querySelectorAll('.stage-block');
    const tabNextBtn = document.getElementById('tab-next-btn');

    function activateSvgLayer(stageKey) {
        if (stageKey === 'profile') {
            svgProfile.classList.add('active');
            svgLight.classList.remove('active');
            svgCanvas.classList.remove('active');
        } else if (stageKey === 'lighting') {
            svgProfile.classList.add('active');
            svgLight.classList.add('active');
            svgCanvas.classList.remove('active');
        } else if (stageKey === 'canvas') {
            svgProfile.classList.add('active');
            svgLight.classList.add('active');
            svgCanvas.classList.add('active');
        }
        stageDots.forEach(dot => {
            dot.classList.toggle('active', dot.getAttribute('data-stage') === stageKey);
        });
    }

    const stageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activateSvgLayer(entry.target.getAttribute('data-stage'));
            }
        });
    }, {
        threshold: 0.4,
        rootMargin: '-15% 0px -15% 0px'
    });

    stageBlocks.forEach(block => stageObserver.observe(block));

    if (tabNextBtn) {
        tabNextBtn.addEventListener('click', () => {
            document.getElementById('contacts').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => document.getElementById('user-name').focus(), 800);
        });
    }

    // =========================================================================
    // 4. PORTFOLIO LIGHTBOX / MODAL VIEWER
    // =========================================================================
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
    const reviewWrappers = document.querySelectorAll('.review-image-wrapper');

    reviewWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const img = wrapper.querySelector('.review-img');
            const cardBody = wrapper.closest('.review-card').querySelector('.review-body');
            const clientName = cardBody.querySelector('.review-client').textContent;
            const projectDetails = cardBody.querySelector('.review-project').textContent;
            
            lightboxModal.style.display = 'block';
            lightboxImg.src = img.src;
            lightboxCaption.textContent = `${clientName} — ${projectDetails}`;
            document.body.classList.add('no-scroll');
        });
    });

    function closeLightbox() {
        lightboxModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }

    lightboxCloseBtn.addEventListener('click', closeLightbox);
    
    // Close lightbox when clicking outside the image
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Close lightbox on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            closeSuccessModal();
        }
    });

    // =========================================================================
    // 5. PHONE FIELD AUTO-FORMATTING (MASK)
    // =========================================================================
    const phoneInput = document.getElementById('user-phone');

    phoneInput.addEventListener('input', (e) => {
        let input = e.target.value.replace(/\D/g, ''); // strip all non-digits
        
        // Remove leading country code if entered
        if (input.startsWith('7') || input.startsWith('8')) {
            input = input.substring(1);
        }
        
        // Max 10 digits
        input = input.substring(0, 10);
        
        let formatted = '+7 (';
        
        if (input.length > 0) {
            formatted += input.substring(0, 3);
        }
        if (input.length >= 4) {
            formatted += ') ' + input.substring(3, 6);
        }
        if (input.length >= 7) {
            formatted += '-' + input.substring(6, 8);
        }
        if (input.length >= 9) {
            formatted += '-' + input.substring(8, 10);
        }
        
        e.target.value = input.length === 0 ? '' : formatted;
    });

    // Handle backspace properly for formatting chars
    phoneInput.addEventListener('keydown', (e) => {
        const value = e.target.value;
        if (e.key === 'Backspace') {
            // If deleting parenthesis or hyphens, strip them automatically
            if (value.endsWith(') ') || value.endsWith('-') || value.endsWith('(')) {
                e.preventDefault();
                const digits = value.replace(/\D/g, '');
                // remove last digit
                const newDigits = digits.substring(0, digits.length - 1);
                phoneInput.value = '';
                // trigger input event to re-evaluate
                const inputEvent = new Event('input');
                phoneInput.value = newDigits;
                phoneInput.dispatchEvent(inputEvent);
            }
        }
    });

    // =========================================================================
    // 6. FORM VALIDATION & SUCCESS MODAL
    // =========================================================================
    const leadForm = document.getElementById('lead-form');
    const nameInput = document.getElementById('user-name');
    const successModal = document.getElementById('success-modal');
    const successModalCloseBtn = document.getElementById('success-modal-close-btn');
    const successModalOkBtn = document.getElementById('success-modal-ok-btn');
    const successClientName = document.getElementById('success-client-name');
    const successClientPhone = document.getElementById('success-client-phone');

    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // 1. Validate Name
        const nameVal = nameInput.value.trim();
        const nameGroup = nameInput.closest('.form-group');
        if (nameVal.length < 2) {
            nameGroup.classList.add('has-error');
            isValid = false;
        } else {
            nameGroup.classList.remove('has-error');
        }
        
        // 2. Validate Phone
        const phoneVal = phoneInput.value.trim();
        const phoneGroup = phoneInput.closest('.form-group');
        // A fully formatted phone matches: +7 (999) 999-99-99 (18 characters)
        if (phoneVal.length < 18) {
            phoneGroup.classList.add('has-error');
            isValid = false;
        } else {
            phoneGroup.classList.remove('has-error');
        }
        
        // If form valid, submit and show modal
        if (isValid) {
            successClientName.textContent = nameVal;
            successClientPhone.textContent = phoneVal;
            
            // Show modal
            successModal.classList.add('open');
            document.body.classList.add('no-scroll');
            
            // Reset form
            leadForm.reset();
        }
    });

    function closeSuccessModal() {
        successModal.classList.remove('open');
        document.body.classList.remove('no-scroll');
    }

    successModalCloseBtn.addEventListener('click', closeSuccessModal);
    successModalOkBtn.addEventListener('click', closeSuccessModal);
    
    // Close modal when clicking outside dialog
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeSuccessModal();
        }
    });

    // =========================================================================
    // 7. SYNC NAVIGATION ACTIVE LINK ON SCROLL
    // =========================================================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNavLink() {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
});
