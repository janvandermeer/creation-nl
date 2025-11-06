FROM php:8.2-apache

# Installeer PHP extensies
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Configureer Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Stel working directory in
WORKDIR /var/www/html

# Kopieer Apache configuratie
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf

# Rechten instellen
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
