document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav');
    const navToggle = nav.querySelector('.toggle');
    const navOverlay = nav.querySelector('div[role="presentation"]');
    const navPanel = nav.querySelector('nav');
    const position = navPanel.dataset.position || 'left';
    
    // Handle focus trap inside nav when open
    const focusableElements = navPanel.querySelectorAll(
        'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    function handleFocusTrap(e) {
        const isTabPressed = e.key === 'Tab';
        
        if (!isTabPressed) return;
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    }
    
    function toggleNav(open) {
        navToggle.setAttribute('aria-expanded', open);
        if (open) {
            nav.classList.add('open');
            // Trap focus inside nav when open
            document.addEventListener('keydown', handleFocusTrap);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            // Focus first focusable element
            firstFocusable?.focus();
        } else {
            nav.classList.remove('open');
            // Remove focus trap
            document.removeEventListener('keydown', handleFocusTrap);
            // Restore body scroll
            document.body.style.overflow = '';
            // Return focus to toggle
            navToggle.focus();
        }
    }

    // Toggle nav on button click
    navToggle.addEventListener('click', () => {
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
        toggleNav(!isOpen);
    });

    // Close nav on overlay click
    navOverlay.addEventListener('click', () => {
        toggleNav(false);
    });

    // Close nav on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
            toggleNav(false);
        }
    });

    // Handle touch events
    let touchStartX = 0;
    let touchEndX = 0;

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        const isLeftNav = position === 'left';
        const isRightNav = position === 'right';
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (isLeftNav && ((isOpen && swipeDistance < 0) || (!isOpen && swipeDistance > 0))) {
                toggleNav(!isOpen);
            } else if (isRightNav && ((isOpen && swipeDistance > 0) || (!isOpen && swipeDistance < 0))) {
                toggleNav(!isOpen);
            }
        }
    }

    navPanel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    navPanel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
});
