const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const pagesDir = path.join(srcDir, 'pages');
const featuresDir = path.join(srcDir, 'features');

if (!fs.existsSync(pagesDir)) {
  console.log('Pages directory not found, assuming already moved.');
  process.exit(0);
}

const features = fs.readdirSync(pagesDir);

features.forEach((feature) => {
  const featureSourceDir = path.join(pagesDir, feature);
  
  if (fs.statSync(featureSourceDir).isDirectory()) {
    const targetFeatureDir = path.join(featuresDir, feature);
    const targetPagesDir = path.join(targetFeatureDir, 'pages');
    
    // Create feature dir if it doesn't exist
    if (!fs.existsSync(targetFeatureDir)) {
      fs.mkdirSync(targetFeatureDir, { recursive: true });
    }
    
    // Create pages dir if it doesn't exist
    if (!fs.existsSync(targetPagesDir)) {
      fs.mkdirSync(targetPagesDir, { recursive: true });
    }
    
    // Move contents of pages/feature to features/feature/pages
    const files = fs.readdirSync(featureSourceDir);
    files.forEach((file) => {
      const sourceFile = path.join(featureSourceDir, file);
      const destFile = path.join(targetPagesDir, file);
      fs.renameSync(sourceFile, destFile);
      console.log(`Moved ${sourceFile} to ${destFile}`);
    });
    
    // Remove the old feature directory inside pages
    fs.rmdirSync(featureSourceDir);
  }
});

console.log('Finished moving pages to features.');
