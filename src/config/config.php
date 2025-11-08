<?php
// Database Configuration
define('DB_HOST', 'db');
define('DB_NAME', 'creation_db');
define('DB_USER', 'creation_user');
define('DB_PASS', 'creation_password');
define('DB_CHARSET', 'utf8mb4');

// Application Configuration
define('SITE_NAME', 'Creation.nl');
define('SITE_URL', 'http://localhost:8080');

// Environment
define('ENVIRONMENT', 'development');

// Error Reporting (alleen voor development)
if (ENVIRONMENT === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Timezone
date_default_timezone_set('Europe/Amsterdam');

// Email Configuration
define('MAIL_FROM_EMAIL', 'info@creation.nl');
define('MAIL_FROM_NAME', 'Creation Online Marketing');
define('ADMIN_EMAIL', 'info@creation.nl');  // Waar formulier emails naartoe gaan

// SMTP Configuration
if (ENVIRONMENT === 'production') {
    define('USE_SMTP', false);  // Uses server's mail()
    define('MAIL_DISABLE', false);  // Emails enabled in production
} else {
    define('USE_SMTP', false);
    define('MAIL_DISABLE', true);  // Emails disabled in development (alleen logging)
}
