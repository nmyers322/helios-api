#!/bin/bash

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
  echo "ImageMagick is not installed. Please install it using 'sudo apt-get install imagemagick'."
  exit 1
fi

# Change to the directory containing the PNG files
cd ../colors || { echo "Directory ../colors not found"; exit 1; }

# Initialize an empty JSON array
json="["

# Add Black first
json+="{\"value\": \"Black\", \"label\": \"Black\", \"color\": \"#000000\"},"

# Iterate over the PNG files and determine the hex value of the dominant color
for file in *.png; do
  color_name="${file%.*}"
  hex_value=$(convert "$file" -resize 1x1\! -format '%[hex:u]' info:-)
  json+="{\"value\": \"$color_name\", \"label\": \"$color_name\", \"color\": \"#$hex_value\"},"
done

# Remove the trailing comma and close the JSON array
json="${json%,}]"

# Print the JSON object
echo "$json" | jq .