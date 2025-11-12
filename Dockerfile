FROM php:8.2-apache

# Installeer PHP extensies
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Enable Apache mod_rewrite and SSL
RUN a2enmod rewrite ssl

# Configureer Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Stel working directory in
WORKDIR /var/www/html

# Kopieer Apache configuratie
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf

# Kopieer SSL certificaten
COPY docker/ssl/localhost.crt /etc/ssl/certs/localhost.crt
COPY docker/ssl/localhost.key /etc/ssl/private/localhost.key

# Kopieer en enable SSL configuratie
COPY docker/apache-ssl.conf /etc/apache2/sites-available/default-ssl.conf
RUN a2ensite default-ssl

# Rechten instellen
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80 443
