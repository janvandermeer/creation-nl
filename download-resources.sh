#!/bin/bash

# Script om alle resources van creation.nl te downloaden
BASE_DIR="/Users/janvandermeer/Local Sites/creation-nl/public/downloaded-site"

# Maak directories aan
mkdir -p "$BASE_DIR/css"
mkdir -p "$BASE_DIR/js"
mkdir -p "$BASE_DIR/images"
mkdir -p "$BASE_DIR/videos"
mkdir -p "$BASE_DIR/fonts"

echo "=== Downloaden CSS ==="
curl -o "$BASE_DIR/css/creation-2022.webflow.shared.css" \
  "https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/css/creation-2022.webflow.shared.dfed5f82c.min.css"

echo ""
echo "=== Downloaden JavaScript ==="
curl -o "$BASE_DIR/js/jquery-3.5.1.min.js" \
  "https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=61128f85e096f2adf5793d8b"

curl -o "$BASE_DIR/js/webflow.js" \
  "https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/js/webflow.2de6f50b.8ae3a57325cba032.js"

echo ""
echo "=== Downloaden Afbeeldingen ==="

# Favicon en icons
curl -o "$BASE_DIR/images/icon-32.png" \
  "https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/63a688531f4b560f88d33609_icon-32.png"

curl -o "$BASE_DIR/images/icon-256.png" \
  "https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/63a68881f1c7f64666c6fbb2_icon-256.png"

# Logo's
curl -o "$BASE_DIR/images/logo-webiste-wit.png" \
  "https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/6460ffbda2dbd7cf98404796_logo-webiste-wit.png"

curl -o "$BASE_DIR/images/creation-footer.png" \
  "https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/63ad2bd63ca6986746dfe95d_creation-footer.png"

curl -o "$BASE_DIR/images/PartnerBadgeClickable.svg" \
  "https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/6627a30310f54ea36fd5a320_PartnerBadgeClickable.svg"

# Client logos
curl -o "$BASE_DIR/images/RTL_Nederland.png" \
  "https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/633fcf291d5ae4b5e7a9976a_RTL_Nederland.png"

curl -o "$BASE_DIR/images/Hero.png" \
  "https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/633fcf29d08ecd2ff3bcdf0c_Hero.png"

curl -o "$BASE_DIR/images/friesland.png" \
  "https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/633fcf29e5d16b23dbd89c12_friesland.png"

curl -o "$BASE_DIR/images/laplace.png" \
  "https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/633fcfcfd08ecdb8b9bce4d2_laplace.png"

curl -o "$BASE_DIR/images/BNR.png" \
  "https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/633fcf29420634c37df976bd_BNR.png"

curl -o "$BASE_DIR/images/ABN.png" \
  "https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/633fcf293a4f10739760c3c4_ABN.png"

echo ""
echo "=== Downloaden Video ==="
# Video poster
curl -o "$BASE_DIR/images/creation-online-marketing-poster-00001.jpg" \
  "https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/63b145483fcbb03eab598ffd_creation-online-marketing-poster-00001.jpg"

# Video file (dit kan groot zijn)
echo "Downloaden video bestand (dit kan even duren)..."
curl -o "$BASE_DIR/videos/creation-online-marketing.mp4" \
  "https://cdn.prod.website-files.com/61128f85e096f2adf5793d8b/63b145483fcbb03eab598ffd_creation-online-marketing-transcode.mp4"

echo ""
echo "✅ Download compleet!"
echo "Bestanden staan in: $BASE_DIR"
