<?php
/**
 * API Endpoint voor HTML5 Banner Offerte Formulier
 * Handles POST requests van banner offerte formulier
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
$rate_limit_key = 'banner_offerte_last_submit';
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
$data['company'] = trim($_POST['company'] ?? '');
$data['message'] = trim($_POST['message'] ?? '');

// Banner formats - can be array or string
if (isset($_POST['formats']) && is_array($_POST['formats'])) {
    $data['formats'] = array_map('trim', $_POST['formats']);
} else {
    $data['formats'] = trim($_POST['formats'] ?? '');
}

$data['quantity'] = trim($_POST['quantity'] ?? '');

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

// Company is optional - use "Particulier" as default if empty
if (empty($data['company'])) {
    $data['company'] = 'Particulier';
}

if (empty($data['formats'])) {
    $errors[] = 'Selecteer minimaal één banner formaat.';
}

// Quantity/deadline is optional - use "Nog te bepalen" as default if empty
if (empty($data['quantity'])) {
    $data['quantity'] = 'Nog te bepalen';
}

// Additional spam protection: honeypot field
if (!empty($_POST['website'])) {
    // Honeypot triggered - likely spam
    error_log('Banner offerte spam detected via honeypot from: ' . $data['email']);
    // Return success to niet de spammer te laten weten dat we het doorhebben
    echo json_encode([
        'success' => true,
        'message' => 'Bedankt voor je offerte aanvraag! We nemen binnen 1 werkdag contact met je op.'
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
    $adminEmailSent = sendBannerOfferteEmail($data);

    // Send confirmation to user
    $confirmationSent = sendBannerOfferteConfirmation($data);

    if ($adminEmailSent) {
        // Update rate limit
        $_SESSION[$rate_limit_key] = $now;

        // Log success
        error_log("Banner offerte submitted successfully from: {$data['email']} for company: {$data['company']}");

        // Return success
        echo json_encode([
            'success' => true,
            'message' => 'Bedankt voor je offerte aanvraag! We nemen binnen 1 werkdag contact met je op met een passende offerte.',
            'confirmation_sent' => $confirmationSent
        ]);
    } else {
        throw new Exception('Failed to send email');
    }

} catch (Exception $e) {
    error_log("Banner offerte error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Er is een fout opgetreden bij het verzenden van je offerte aanvraag. Probeer het later opnieuw of bel ons op 010-2680368.'
    ]);
}
