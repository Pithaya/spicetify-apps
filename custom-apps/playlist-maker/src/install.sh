#!/bin/bash

# Define variables
CUSTOM_APPS_DIR="$HOME/.config/spicetify/CustomApps"
NAME="playlist-maker"

CUSTOM_APP_DIR="$CUSTOM_APPS_DIR/$NAME"

ZIP_URL="https://github.com/Pithaya/spicetify-apps-dist/archive/refs/heads/dist/playlist-maker.zip"
ZIP_FILE="/tmp/spicetifyed.zip"
TEMP_DIR="/tmp/spicetifyed"

# Create CustomApps directory if it doesn't exist
mkdir -p "$CUSTOM_APPS_DIR"

# Download the zip file
curl -L -o "$ZIP_FILE" "$ZIP_URL"

# Unzip the file
unzip "$ZIP_FILE" -d "$TEMP_DIR"

# Move the unzipped folder to the correct location
mv "$TEMP_DIR"/* "$CUSTOM_APP_DIR"

# Apply Spicetify configuration
spicetify config custom_apps "$NAME"

spicetify apply

# Clean up
rm -rf "$ZIP_FILE" "$TEMP_DIR"

echo "Installation complete. Enjoy your new app!"
