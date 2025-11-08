<?php
/**
 * Email Functions voor Creation.nl
 * Gebruikt PHPMailer met fallback naar native mail()
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/**
 * Algemene functie om emails te versturen
 *
 * @param string $to E-mailadres ontvanger
 * @param string $subject Onderwerp
 * @param string $body HTML body
 * @param string $altBody Plain text alternative
 * @return bool Success status
 */
function sendEmail($to, $subject, $body, $altBody = '') {
    // Check if emails are disabled (development mode)
    if (defined('MAIL_DISABLE') && MAIL_DISABLE) {
        error_log("EMAIL DISABLED (dev mode) - Would send to: $to | Subject: $subject");
        return true;  // Return true in development so forms don't error
    }

    try {
        // Check if PHPMailer is available
        if (file_exists(__DIR__ . '/../../vendor/autoload.php')) {
            require_once __DIR__ . '/../../vendor/autoload.php';

            $mail = new PHPMailer(true);

            // Use server's mail() function (no SMTP)
            $mail->isMail();

            // Charset
            $mail->CharSet = 'UTF-8';

            // Sender
            $mail->setFrom(MAIL_FROM_EMAIL, MAIL_FROM_NAME);

            // Recipient
            $mail->addAddress($to);

            // Reply-to (optioneel, kan later worden toegevoegd via parameter)
            // $mail->addReplyTo(MAIL_FROM_EMAIL, MAIL_FROM_NAME);

            // Content
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $body;
            $mail->AltBody = $altBody ?: strip_tags($body);

            // Send
            $mail->send();
            error_log("Email sent successfully to: $to | Subject: $subject");
            return true;

        } else {
            // Fallback to native mail()
            $headers = "From: " . MAIL_FROM_NAME . " <" . MAIL_FROM_EMAIL . ">\r\n";
            $headers .= "MIME-Version: 1.0\r\n";
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

            $success = mail($to, $subject, $body, $headers);

            if ($success) {
                error_log("Email sent via native mail() to: $to | Subject: $subject");
            } else {
                error_log("Failed to send email via native mail() to: $to");
            }

            return $success;
        }

    } catch (Exception $e) {
        error_log("Email error: " . $e->getMessage());
        return false;
    }
}

/**
 * Verstuur contactformulier email naar admin
 *
 * @param array $data Formulier data (name, email, phone, message)
 * @return bool Success status
 */
function sendContactEmail($data) {
    $name = htmlspecialchars($data['name'] ?? '');
    $email = htmlspecialchars($data['email'] ?? '');
    $phone = htmlspecialchars($data['phone'] ?? '');
    $message = nl2br(htmlspecialchars($data['message'] ?? ''));

    $subject = "Nieuw contactformulier bericht van {$name}";

    $body = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; margin-top: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #2c3e50; }
            .value { margin-top: 5px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Nieuw Contactformulier Bericht</h2>
            </div>
            <div class='content'>
                <div class='field'>
                    <div class='label'>Naam:</div>
                    <div class='value'>{$name}</div>
                </div>
                <div class='field'>
                    <div class='label'>E-mailadres:</div>
                    <div class='value'><a href='mailto:{$email}'>{$email}</a></div>
                </div>
                <div class='field'>
                    <div class='label'>Telefoonnummer:</div>
                    <div class='value'>{$phone}</div>
                </div>
                <div class='field'>
                    <div class='label'>Bericht:</div>
                    <div class='value'>{$message}</div>
                </div>
            </div>
            <div class='footer'>
                Verzonden via contactformulier op " . SITE_URL . "<br>
                Datum: " . date('d-m-Y H:i:s') . "
            </div>
        </div>
    </body>
    </html>
    ";

    return sendEmail(ADMIN_EMAIL, $subject, $body);
}

/**
 * Verstuur bevestigingsmail naar contactpersoon
 *
 * @param array $data Formulier data (name, email)
 * @return bool Success status
 */
function sendContactConfirmation($data) {
    $name = htmlspecialchars($data['name'] ?? '');
    $email = htmlspecialchars($data['email'] ?? '');

    $subject = "Bedankt voor je bericht - Creation Online Marketing";

    $body = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Bedankt voor je bericht!</h2>
            </div>
            <div class='content'>
                <p>Beste {$name},</p>
                <p>We hebben je bericht goed ontvangen en nemen zo snel mogelijk contact met je op.</p>
                <p>Met vriendelijke groet,</p>
                <p><strong>Team Creation Online Marketing</strong><br>
                Schiekade 133<br>
                3013 BR Rotterdam<br>
                Tel: 010-2680368<br>
                Web: www.creation.nl</p>
            </div>
            <div class='footer'>
                Dit is een automatisch gegenereerd bericht.
            </div>
        </div>
    </body>
    </html>
    ";

    return sendEmail($email, $subject, $body);
}

/**
 * Verstuur banner offerte aanvraag naar admin
 *
 * @param array $data Formulier data
 * @return bool Success status
 */
function sendBannerOfferteEmail($data) {
    $name = htmlspecialchars($data['name'] ?? '');
    $email = htmlspecialchars($data['email'] ?? '');
    $phone = htmlspecialchars($data['phone'] ?? '');
    $company = htmlspecialchars($data['company'] ?? '');
    $formats = isset($data['formats']) && is_array($data['formats'])
        ? implode(', ', array_map('htmlspecialchars', $data['formats']))
        : htmlspecialchars($data['formats'] ?? '');
    $quantity = htmlspecialchars($data['quantity'] ?? '');
    $message = nl2br(htmlspecialchars($data['message'] ?? ''));

    $subject = "Nieuwe HTML5 Banner Offerte Aanvraag van {$name}";

    $body = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; margin-top: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #2c3e50; }
            .value { margin-top: 5px; }
            .highlight { background: #e8f5e9; padding: 10px; border-left: 4px solid #4caf50; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Nieuwe HTML5 Banner Offerte Aanvraag</h2>
            </div>
            <div class='content'>
                <div class='field'>
                    <div class='label'>Naam:</div>
                    <div class='value'>{$name}</div>
                </div>
                <div class='field'>
                    <div class='label'>E-mailadres:</div>
                    <div class='value'><a href='mailto:{$email}'>{$email}</a></div>
                </div>
                <div class='field'>
                    <div class='label'>Telefoonnummer:</div>
                    <div class='value'>{$phone}</div>
                </div>
                <div class='field'>
                    <div class='label'>Bedrijf:</div>
                    <div class='value'>{$company}</div>
                </div>
                <div class='field highlight'>
                    <div class='label'>Gewenste banner formaten:</div>
                    <div class='value'>{$formats}</div>
                </div>
                <div class='field highlight'>
                    <div class='label'>Aantal banners:</div>
                    <div class='value'>{$quantity}</div>
                </div>
                <div class='field'>
                    <div class='label'>Aanvullende informatie:</div>
                    <div class='value'>{$message}</div>
                </div>
            </div>
            <div class='footer'>
                Verzonden via HTML5 Banner Offerte formulier op " . SITE_URL . "<br>
                Datum: " . date('d-m-Y H:i:s') . "
            </div>
        </div>
    </body>
    </html>
    ";

    return sendEmail(ADMIN_EMAIL, $subject, $body);
}

/**
 * Verstuur bevestigingsmail voor banner offerte naar klant
 *
 * @param array $data Formulier data (name, email)
 * @return bool Success status
 */
function sendBannerOfferteConfirmation($data) {
    $name = htmlspecialchars($data['name'] ?? '');
    $email = htmlspecialchars($data['email'] ?? '');

    $subject = "Offerte aanvraag ontvangen - Creation HTML5 Banners";

    $body = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Bedankt voor je offerte aanvraag!</h2>
            </div>
            <div class='content'>
                <p>Beste {$name},</p>
                <p>We hebben je aanvraag voor een HTML5 banner offerte goed ontvangen.</p>

                <div class='highlight'>
                    <strong>Wat gebeurt er nu?</strong><br>
                    Één van onze specialisten bekijkt je aanvraag en neemt binnen 1 werkdag contact met je op met een passende offerte op maat.
                </div>

                <p>Heb je vragen in de tussentijd? Neem gerust contact met ons op via 010-2680368.</p>

                <p>Met vriendelijke groet,</p>
                <p><strong>Team Creation Online Marketing</strong><br>
                Schiekade 133<br>
                3013 BR Rotterdam<br>
                Tel: 010-2680368<br>
                Web: www.creation.nl</p>
            </div>
            <div class='footer'>
                Dit is een automatisch gegenereerd bericht.
            </div>
        </div>
    </body>
    </html>
    ";

    return sendEmail($email, $subject, $body);
}
