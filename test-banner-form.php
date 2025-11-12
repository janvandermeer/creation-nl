<?php
/**
 * Test script voor banner offerte formulier
 * Run dit op de server om te checken of emails worden verstuurd
 */

// Load configuration
require_once __DIR__ . '/src/config/config.php';
require_once __DIR__ . '/src/includes/email-functions.php';

echo "=== Banner Offerte Form Test ===\n\n";

echo "Configuration:\n";
echo "- ADMIN_EMAIL: " . ADMIN_EMAIL . "\n";
echo "- MAIL_FROM_EMAIL: " . MAIL_FROM_EMAIL . "\n";
echo "- MAIL_DISABLE: " . (MAIL_DISABLE ? 'true (EMAILS DISABLED!)' : 'false') . "\n";
echo "- ENVIRONMENT: " . ENVIRONMENT . "\n\n";

// Test data
$testData = [
    'name' => 'Test Gebruiker',
    'email' => 'test@example.com',
    'phone' => '06-12345678',
    'company' => 'Test BV',
    'formats' => '300x250, 728x90, 300x600',
    'quantity' => '5 banners',
    'message' => 'Dit is een test bericht voor banner offerte'
];

echo "Testing Banner Offerte Email...\n";
$adminEmailSent = sendBannerOfferteEmail($testData);
echo "Admin email sent: " . ($adminEmailSent ? 'YES ✓' : 'NO ✗') . "\n\n";

echo "Testing Banner Offerte Confirmation...\n";
$confirmationSent = sendBannerOfferteConfirmation($testData);
echo "Confirmation email sent: " . ($confirmationSent ? 'YES ✓' : 'NO ✗') . "\n\n";

echo "=== Test Complete ===\n";
echo "\nCheck the following:\n";
echo "1. Server logs: tail -f logs/php-errors.log\n";
echo "2. Email inbox at: " . ADMIN_EMAIL . "\n";
echo "3. Confirmation inbox at: test@example.com\n";
