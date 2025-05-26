# Create clean directory structure
$cleanDir = "..\WhatsAppifiyer-V3-Clean"
$sourceDir = "."

# Create necessary directories
New-Item -ItemType Directory -Force -Path "$cleanDir\src\app"
New-Item -ItemType Directory -Force -Path "$cleanDir\src\components\formflow"
New-Item -ItemType Directory -Force -Path "$cleanDir\src\components\ui"
New-Item -ItemType Directory -Force -Path "$cleanDir\src\components\tutorial"
New-Item -ItemType Directory -Force -Path "$cleanDir\src\lib"
New-Item -ItemType Directory -Force -Path "$cleanDir\public"

# Copy essential files
Copy-Item -Path "$sourceDir\src\app\page.tsx" -Destination "$cleanDir\src\app\" -Force

# Copy formflow components
Copy-Item -Path "$sourceDir\src\components\formflow\*" -Destination "$cleanDir\src\components\formflow\" -Recurse -Force

# Copy tutorial components
Copy-Item -Path "$sourceDir\src\components\tutorial\*" -Destination "$cleanDir\src\components\tutorial\" -Recurse -Force

# Copy UI components (we'll filter these later)
Copy-Item -Path "$sourceDir\src\components\ui\*" -Destination "$cleanDir\src\components\ui\" -Recurse -Force

# Copy lib directory
Copy-Item -Path "$sourceDir\src\lib\*" -Destination "$cleanDir\src\lib\" -Recurse -Force

# Copy public assets
Copy-Item -Path "$sourceDir\public\*" -Destination "$cleanDir\public\" -Recurse -Force

# Copy package.json and other root files
Copy-Item -Path "$sourceDir\package.json" -Destination $cleanDir -Force
Copy-Item -Path "$sourceDir\tsconfig.json" -Destination $cleanDir -Force
Copy-Item -Path "$sourceDir\next.config.js" -Destination $cleanDir -Force
Copy-Item -Path "$sourceDir\.gitignore" -Destination $cleanDir -Force

Write-Host "Clean project created at $cleanDir"
