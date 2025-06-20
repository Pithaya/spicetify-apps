# Define variables
$homeDir = $env:USERPROFILE
$customAppsDir = "$homeDir\AppData\Roaming\spicetify\CustomApps"
$name = "better-local-files"
$customAppDir = Join-Path $customAppsDir $name

$zipUrl = "https://github.com/Pithaya/spicetify-apps-dist/archive/refs/heads/dist/better-local-files.zip"
$zipFile = "$env:TEMP\spicetifyed.zip"
$tempDir = "$env:TEMP\spicetifyed"

# Create CustomApps directory if it doesn't exist
if (!(Test-Path -Path $customAppsDir)) {
    New-Item -ItemType Directory -Path $customAppsDir | Out-Null
}

# Download the zip file
Invoke-WebRequest -Uri $zipUrl -OutFile $zipFile

# Unzip the file
Expand-Archive -Path $zipFile -DestinationPath $tempDir -Force

# Move the unzipped folder to the correct location
if (Test-Path -Path $customAppDir) {
    # If an existing installation is found, remove it for a fresh installation
    Remove-Item -Recurse -Force $customAppDir
}
Move-Item -Path (Get-ChildItem $tempDir | Select-Object -First 1).FullName -Destination $customAppDir

# Apply Spicetify configuration
spicetify config custom_apps $name
spicetify apply

# Clean up
Remove-Item -Path $zipFile -Force
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "Installation complete. Enjoy your new app!"
