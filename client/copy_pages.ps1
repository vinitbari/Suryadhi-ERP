$srcDir = "d:\ERP\client\src"
$pagesDir = Join-Path $srcDir "pages"
$featuresDir = Join-Path $srcDir "features"

if (!(Test-Path $pagesDir)) {
    Write-Host "Pages directory not found."
    exit 0
}

$features = Get-ChildItem -Path $pagesDir -Directory

foreach ($feature in $features) {
    $featureName = $feature.Name
    $targetFeatureDir = Join-Path $featuresDir $featureName
    $targetPagesDir = Join-Path $targetFeatureDir "pages"

    if (!(Test-Path $targetFeatureDir)) {
        New-Item -ItemType Directory -Force -Path $targetFeatureDir | Out-Null
    }
    if (!(Test-Path $targetPagesDir)) {
        New-Item -ItemType Directory -Force -Path $targetPagesDir | Out-Null
    }

    $files = Get-ChildItem -Path $feature.FullName -File
    foreach ($file in $files) {
        $destFile = Join-Path $targetPagesDir $file.Name
        Copy-Item -Path $file.FullName -Destination $destFile -Force
        Write-Host "Copied $($file.FullName) to $destFile"
    }
    
    # Also copy subdirectories like 'components'
    $subDirs = Get-ChildItem -Path $feature.FullName -Directory
    foreach ($subDir in $subDirs) {
        $destSubDir = Join-Path $targetPagesDir $subDir.Name
        Copy-Item -Path $subDir.FullName -Destination $targetPagesDir -Recurse -Force
        Write-Host "Copied dir $($subDir.FullName) to $targetPagesDir"
    }
}
Write-Host "Finished copying."
