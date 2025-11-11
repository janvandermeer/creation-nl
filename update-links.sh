#!/bin/bash

# Script om alle interne .html links te updaten naar nieuwe structuur

cd public

echo "Updaten van links in alle HTML bestanden..."

# Vind alle index.html bestanden
find . -name "index.html" -type f | while read file; do
  echo "Bezig met: $file"

  # Update links met sed
  # Pattern 1: href="iets.html" (relatief zonder /)
  sed -i 's|href="\([^"/:#?]*\)\.html"|href="/\1/"|g' "$file"

  # Pattern 2: href="dir/pagina.html" (relatief met /)
  sed -i 's|href="\([^":#?]*\)/\([^":#?]*\)\.html"|href="/\1/\2/"|g' "$file"

  # Pattern 3: href="../dir/pagina.html" (parent directory)
  sed -i 's|href="\.\./\([^":#?]*\)\.html"|href="/\1/"|g' "$file"
  sed -i 's|href="\.\./\([^":#?]*\)/\([^":#?]*\)\.html"|href="/\1/\2/"|g' "$file"

  # Pattern 4: href="./pagina.html" (current directory)
  sed -i 's|href="\./\([^":#?]*\)\.html"|href="/\1/"|g' "$file"

  # Fix voor root index.html link
  sed -i 's|href="/index/"|href="/"|g' "$file"
  sed -i 's|href="index/"|href="/"|g' "$file"
done

echo "Klaar met updaten van links!"
