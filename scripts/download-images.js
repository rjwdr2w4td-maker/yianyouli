const fs = require('fs');
const path = require('path');
const https = require('https');

const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const imageUrls = [
  { name: 'villager-service.jpg', url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80', desc: '便民服务-服务柜台帮助村民' }
];

const downloadImage = (url, filename) => {
  return new Promise((resolve) => {
    const filePath = path.join(imagesDir, filename);
    
    const request = https.get(url, (response) => {
      if (response.statusCode !== 200) {
        console.error(`Failed: ${filename} - HTTP ${response.statusCode}`);
        resolve();
        return;
      }
      
      const file = fs.createWriteStream(filePath);
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          const size = fs.statSync(filePath).size;
          if (size < 1000) {
            console.error(`Failed: ${filename} - File too small (${size} bytes)`);
          } else {
            console.log(`Downloaded: ${filename} (${size} bytes)`);
          }
          resolve();
        });
      });
    }).on('error', (err) => {
      console.error(`Failed: ${filename} - ${err.message}`);
      resolve();
    });
    
    request.setTimeout(15000, () => {
      request.destroy();
      console.error(`Failed: ${filename} - Timeout`);
      resolve();
    });
  });
};

const run = async () => {
  console.log('Downloading villager-service image...');
  for (const image of imageUrls) {
    console.log(`→ ${image.desc}`);
    await downloadImage(image.url, image.name);
  }
  console.log('Done!');
};

run().catch(console.error);