# Git Auto-Sync Script
# This script stages all changes, commits them with a timestamp, and pushes to GitHub.

$Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host "--- Starting Auto-Sync at $Timestamp ---" -ForegroundColor Cyan

# Stage all changes
Write-Host "Staging changes..."
git add .

# Check for changes to commit
$Status = git status --porcelain
if (-not $Status) {
    Write-Host "No changes to commit. Skipping sync." -ForegroundColor Yellow
} else {
    Write-Host "Changes detected. Committing..."
    git commit -m "Auto-sync: $Timestamp"

    Write-Host "Pushing to GitHub (origin main)..."
    git push origin main
}

Write-Host "--- Sync Complete ---" -ForegroundColor Green
pause
