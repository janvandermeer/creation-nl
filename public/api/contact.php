<?php
/**
 * API Endpoint voor Contactformulier
 * Handles POST requests van contact.html formulier
 */

// Security headers
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Load configuration and functions
require_once __DIR__ . '/../../src/config/config.php';
require_once __DIR__ . '/../../src/includes/email-functions.php';

// Simple rate limiting (prevent spam)
session_start();
$now = time();
$rate_limit_key = 'contact_form_last_submit';
$rate_limit_seconds = 60; // 1 minute tussen submissions

if (isset($_SESSION[$rate_limit_key])) {
    $time_since_last = $now - $_SESSION[$rate_limit_key];
    if ($time_since_last < $rate_limit_seconds) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Je hebt dit formulier recent al verzonden. Wacht even en probeer het opnieuw.'
        ]);
        exit;
    }
}

// Get POST data
$data = [];
$data['name'] = trim($_POST['name'] ?? '');
$data['email'] = trim($_POST['email'] ?? '');
$data['phone'] = trim($_POST['phone'] ?? '');
$data['message'] = trim($_POST['message'] ?? '');

// Validation
$errors = [];

if (empty($data['name']) || strlen($data['name']) < 2) {
    $errors[] = 'Naam is verplicht en moet minimaal 2 karakters bevatten.';
}

if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Een geldig e-mailadres is verplicht.';
}

if (empty($data['phone'])) {
    $errors[] = 'Telefoonnummer is verplicht.';
}

if (empty($data['message']) || strlen($data['message']) < 10) {
    $errors[] = 'Bericht is verplicht en moet minimaal 10 karakters bevatten.';
}

// Additional spam protection: honeypot field
// (voeg een hidden field toe in de HTML met name="website" - bots vullen dit in)
if (!empty($_POST['website'])) {
    // Honeypot triggered - likely spam
    error_log('Contact form spam detected via honeypot from: ' . $data['email']);
    // Return success to niet de spammer te laten weten dat we het doorhebben
    echo json_encode([
        'success' => true,
        'message' => 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.'
    ]);
    exit;
}

// Return errors if validation failed
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Er zijn validatiefouten opgetreden.',
        'errors' => $errors
    ]);
    exit;
}

// Send emails
try {
    // Send to admin
    $adminEmailSent = sendContactEmail($data);

    // Send confirmation to user
    $confirmationSent = sendContactConfirmation($data);

    if ($adminEmailSent) {
        // Update rate limit
        $_SESSION[$rate_limit_key] = $now;

        // Log success
        error_log("Contact form submitted successfully from: {$data['email']}");

        // Return success
        echo json_encode([
            'success' => true,
            'message' => 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.',
            'confirmation_sent' => $confirmationSent
        ]);
    } else {
        throw new Exception('Failed to send email');
    }

} catch (Exception $e) {
    error_log("Contact form error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Er is een fout opgetreden bij het verzenden van je bericht. Probeer het later opnieuw of bel ons op 010-2680368.'
    ]);
}
