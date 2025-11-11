#!/bin/bash

# Script om alle .html bestanden om te bouwen naar directory/index.html structuur

cd public

# Vind alle .html bestanden behalve root index.html
find . -name "*.html" -type f | grep -v "^\./index\.html$" | sort -r | while read file; do
  # Verwijder leading ./
  file=${file#./}

  # Haal directory en filename op
  dir=$(dirname "$file")
  base=$(basename "$file" .html)

  # Maak nieuwe directory structuur
  if [ "$dir" = "." ]; then
    newdir="$base"
  else
    newdir="$dir/$base"
  fi

  # Maak de nieuwe directory
  mkdir -p "$newdir"

  # Verplaats het bestand
  mv "$file" "$newdir/index.html"

  echo "Verplaatst: $file -> $newdir/index.html"
done

echo "Klaar met herstructureren!"
