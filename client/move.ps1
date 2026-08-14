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

    $files = Get-ChildItem -Path $feature.FullName
    foreach ($file in $files) {
        $destFile = Join-Path $targetPagesDir $file.Name
        Move-Item -Path $file.FullName -Destination $destFile -Force
        Write-Host "Moved $($file.FullName) to $destFile"
    }

    Remove-Item -Path $feature.FullName -Force -Recurse
}
Write-Host "Finished."
