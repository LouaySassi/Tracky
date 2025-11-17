const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🚀 Building Tracky Desktop App...\n');

try {
  // Step 1: Build frontend
  console.log('📦 Building frontend...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 2: Create pkg config
  console.log('\n⚙️  Creating executable...');
  
  const pkgConfig = {
    name: "tracky",
    version: "1.0.0",
    bin: "server/index.js",
    pkg: {
      assets: [
        "dist/**/*",
        "server/**/*",
        "node_modules/better-sqlite3/**/*"
      ],
      targets: ["node18-win-x64"],
      outputPath: "build"
    }
  };
  
  fs.writeFileSync('pkg-config.json', JSON.stringify(pkgConfig, null, 2));
  
  // Step 3: Build executable using pkg
  console.log('🔨 Compiling to .exe...');
  execSync('npx pkg . --config pkg-config.json --targets node18-win-x64 --output build/Tracky.exe', { 
    stdio: 'inherit' 
  });
  
  // Step 4: Copy to Desktop
  const desktopPath = path.join(os.homedir(), 'Desktop');
  const exePath = path.join(__dirname, 'build', 'Tracky.exe');
  const destPath = path.join(desktopPath, 'Tracky.exe');
  
  if (fs.existsSync(exePath)) {
    console.log('\n📂 Copying to Desktop...');
    fs.copyFileSync(exePath, destPath);
    
    console.log('\n✅ SUCCESS!');
    console.log(`\n🎯 Tracky.exe is on your Desktop!`);
    console.log(`📍 Location: ${destPath}`);
    console.log(`\n💡 Double-click "Tracky.exe" to launch!`);
    console.log(`🌐 It will open in your default browser!\n`);
  } else {
    console.error('❌ Build failed: Tracky.exe not found');
  }
  
  // Cleanup
  fs.unlinkSync('pkg-config.json');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}