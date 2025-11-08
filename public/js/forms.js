/**
 * Forms.js - Formulier handling voor Creation.nl
 * Handles contact form en banner offerte form submissions
 */

(function() {
    'use strict';

    // Helper functie om AJAX POST request te doen
    function submitFormData(url, formData, onSuccess, onError) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    onSuccess(response);
                } catch (e) {
                    onError('Invalid response from server');
                }
            } else {
                try {
                    var response = JSON.parse(xhr.responseText);
                    onError(response.message || 'Er is een fout opgetreden');
                } catch (e) {
                    onError('Er is een fout opgetreden bij het verzenden');
                }
            }
        };

        xhr.onerror = function() {
            onError('Netwerkfout - controleer je internetverbinding');
        };

        xhr.send(formData);
    }

    // Contact Form Handler
    function initContactForm() {
        var contactForm = document.querySelector('#wf-form-Contact-Form');
        if (!contactForm) return;

        var successDiv = contactForm.parentElement.querySelector('.success-message');
        var errorDiv = contactForm.parentElement.querySelector('.w-form-fail');
        var submitButton = contactForm.querySelector('input[type="submit"]');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Hide previous messages
            if (successDiv) successDiv.style.display = 'none';
            if (errorDiv) errorDiv.style.display = 'none';

            // Disable submit button
            var originalValue = submitButton.value;
            submitButton.disabled = true;
            submitButton.value = submitButton.getAttribute('data-wait') || 'Verzenden...';

            // Collect form data
            var formData = new FormData();
            formData.append('name', contactForm.querySelector('[name="naam"]').value);
            formData.append('email', contactForm.querySelector('[name="Email"]').value);
            formData.append('phone', contactForm.querySelector('[name="telefoon"]').value);
            formData.append('message', contactForm.querySelector('[name="bericht"]').value);

            // Honeypot field voor spam protectie (hidden field)
            formData.append('website', '');

            // Submit to API
            submitFormData(
                '/api/contact.php',
                formData,
                function(response) {
                    // Success
                    submitButton.disabled = false;
                    submitButton.value = originalValue;

                    if (response.success) {
                        // Show success message
                        if (successDiv) {
                            successDiv.style.display = 'block';
                        }

                        // Reset form
                        contactForm.reset();

                        // Redirect na 2 seconden (zoals origineel)
                        setTimeout(function() {
                            window.location.href = '/contact-bedankt.html';
                        }, 2000);
                    } else {
                        // Show error
                        if (errorDiv) {
                            var errorText = errorDiv.querySelector('div') || errorDiv;
                            errorText.innerHTML = response.message || 'Er is een fout opgetreden';
                            errorDiv.style.display = 'block';
                        }
                    }
                },
                function(errorMessage) {
                    // Error
                    submitButton.disabled = false;
                    submitButton.value = originalValue;

                    if (errorDiv) {
                        var errorText = errorDiv.querySelector('div') || errorDiv;
                        errorText.innerHTML = errorMessage;
                        errorDiv.style.display = 'block';
                    }
                }
            );
        });
    }

    // Banner Offerte Form Handler
    function initBannerOfferteForm() {
        // Support beide form IDs: custom banner-offerte-form of Webflow's wf-form-Email-Form
        var offerteForm = document.querySelector('#banner-offerte-form') ||
                          document.querySelector('#wf-form-Email-Form');
        if (!offerteForm) return;

        var successDiv = offerteForm.parentElement.querySelector('.success-message');
        var errorDiv = offerteForm.parentElement.querySelector('.w-form-fail');
        var submitButton = offerteForm.querySelector('input[type="submit"]');

        offerteForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Hide previous messages
            if (successDiv) successDiv.style.display = 'none';
            if (errorDiv) errorDiv.style.display = 'none';

            // Disable submit button
            var originalValue = submitButton.value;
            submitButton.disabled = true;
            submitButton.value = submitButton.getAttribute('data-wait') || 'Verzenden...';

            // Collect form data - support verschillende field namen
            var formData = new FormData();

            // Naam (support: naam, Naam)
            var nameField = offerteForm.querySelector('[name="naam"]') ||
                            offerteForm.querySelector('[name="Naam"]');
            if (nameField) formData.append('name', nameField.value);

            // Email
            var emailField = offerteForm.querySelector('[name="email"]') ||
                             offerteForm.querySelector('[name="Email"]');
            if (emailField) formData.append('email', emailField.value);

            // Telefoon
            var phoneField = offerteForm.querySelector('[name="telefoon"]') ||
                             offerteForm.querySelector('[name="Telefoon"]');
            if (phoneField) formData.append('phone', phoneField.value);

            // Bedrijf (optioneel)
            var companyField = offerteForm.querySelector('[name="bedrijf"]') ||
                               offerteForm.querySelector('[name="Bedrijf"]');
            if (companyField) {
                formData.append('company', companyField.value);
            } else {
                // Als bedrijf niet bestaat, gebruik "Particulier"
                formData.append('company', 'Particulier');
            }

            // Banner formats - collect alle checked checkboxes
            var formatCheckboxes = offerteForm.querySelectorAll('input[type="checkbox"]:checked');
            var selectedFormats = [];
            formatCheckboxes.forEach(function(checkbox) {
                // Skip non-format checkboxes
                if (checkbox.name !== 'AdForm' &&
                    checkbox.name !== 'Facebook' &&
                    checkbox.name !== 'Google-Ads' &&
                    checkbox.name !== 'Google-Ad-Manager') {
                    selectedFormats.push(checkbox.name);
                }
            });

            if (selectedFormats.length > 0) {
                formData.append('formats', selectedFormats.join(', '));
            } else {
                formData.append('formats', 'Nog te bepalen');
            }

            // Quantity - gebruik "Banner levertijd" of "aantal"
            var quantityField = offerteForm.querySelector('[name="aantal"]') ||
                                offerteForm.querySelector('[name="Banner-levertijd"]') ||
                                offerteForm.querySelector('[name="Banner levertijd"]');
            if (quantityField) {
                formData.append('quantity', quantityField.value || '1');
            } else {
                formData.append('quantity', '1');
            }

            // Message - verschillende mogelijke veldnamen
            var messageField = offerteForm.querySelector('[name="bericht"]') ||
                               offerteForm.querySelector('[name="Vraag"]') ||
                               offerteForm.querySelector('[name="vraag"]') ||
                               offerteForm.querySelector('[name="banner-boodschap"]') ||
                               offerteForm.querySelector('[name="banner boodschap"]');
            if (messageField) {
                formData.append('message', messageField.value || '');
            } else {
                formData.append('message', '');
            }

            // Honeypot field voor spam protectie
            formData.append('website', '');

            // Submit to API
            submitFormData(
                '/api/banner-offerte.php',
                formData,
                function(response) {
                    // Success
                    submitButton.disabled = false;
                    submitButton.value = originalValue;

                    if (response.success) {
                        // Show success message
                        if (successDiv) {
                            var successText = successDiv.querySelector('div') || successDiv;
                            successText.innerHTML = '<strong>Bedankt!</strong><br>' + response.message;
                            successDiv.style.display = 'block';
                        }

                        // Reset form
                        offerteForm.reset();

                        // Optioneel: scroll naar success message
                        if (successDiv) {
                            successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    } else {
                        // Show error
                        if (errorDiv) {
                            var errorText = errorDiv.querySelector('div') || errorDiv;
                            errorText.innerHTML = response.message || 'Er is een fout opgetreden';
                            errorDiv.style.display = 'block';
                        }
                    }
                },
                function(errorMessage) {
                    // Error
                    submitButton.disabled = false;
                    submitButton.value = originalValue;

                    if (errorDiv) {
                        var errorText = errorDiv.querySelector('div') || errorDiv;
                        errorText.innerHTML = errorMessage;
                        errorDiv.style.display = 'block';
                    }
                }
            );
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initContactForm();
            initBannerOfferteForm();
        });
    } else {
        initContactForm();
        initBannerOfferteForm();
    }

})();
