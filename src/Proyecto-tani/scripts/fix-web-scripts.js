const fs = require('node:fs');
const path = require('node:path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const distDir = path.join(__dirname, '..', 'dist');

if (fs.existsSync(distDir)) {
  walkDir(distDir, (filePath) => {
    if (path.extname(filePath) === '.html') {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('<script src="/tani/_expo/static/js/web/')) {
        content = content.replaceAll(
          '<script src="/tani/_expo/static/js/web/',
          '<script type="module" src="/tani/_expo/static/js/web/'
        );
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Corregido script tag en: ${path.relative(distDir, filePath)}`);
      } else if (content.includes('<script src="/_expo/static/js/web/')) {
        content = content.replaceAll(
          '<script src="/_expo/static/js/web/',
          '<script type="module" src="/_expo/static/js/web/'
        );
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Corregido script tag en: ${path.relative(distDir, filePath)}`);
      }
    }
  });
  console.log('¡Proceso de corrección de scripts completado con éxito!');
} else {
  console.error('No se encontró la carpeta dist para corregir.');
}
