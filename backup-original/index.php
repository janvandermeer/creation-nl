<?php
require_once __DIR__ . '/../src/config/config.php';
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creation.nl</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header>
        <nav>
            <div class="container">
                <h1>Creation.nl</h1>
            </div>
        </nav>
    </header>

    <main>
        <div class="container">
            <section class="hero">
                <h2>Welkom bij Creation.nl</h2>
                <p>Jouw website is succesvol opgezet!</p>
            </section>
        </div>
    </main>

    <footer>
        <div class="container">
            <p>&copy; <?php echo date('Y'); ?> Creation.nl. Alle rechten voorbehouden.</p>
        </div>
    </footer>

    <script src="/js/main.js"></script>
</body>
</html>
