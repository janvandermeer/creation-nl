/**
 * Banner Pages Logo Fix
 * Shows the Creation logo in the subnavigation when the main navigation becomes sticky
 * This replaces the non-functioning Webflow scroll animation
 */

(function() {
    'use strict';

    // Find the logo and main navigation
    const logo = document.querySelector('.subnavigatie .image-24');
    const mainNav = document.querySelector('#nav');

    if (!logo || !mainNav) return;

    // Function to check if main nav is sticky (user has scrolled)
    function updateLogoVisibility() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Show logo when scrolled more than 100px (main nav becomes sticky)
        if (scrollTop > 100) {
            logo.style.display = 'block';
        } else {
            logo.style.display = 'none';
        }
    }

    // Listen to scroll events with throttling for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateLogoVisibility();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial check on page load
    updateLogoVisibility();
})();
