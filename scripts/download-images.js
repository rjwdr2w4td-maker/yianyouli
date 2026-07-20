const fs = require('fs');
const path = require('path');
const https = require('https');

const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const imageUrls = [
  { name: 'yian-cover.jpg', url: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=1200&q=80' },
  { name: 'liqiao.jpg', url: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=1200&q=80' },
  { name: 'yongquan.jpg', url: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=1200&q=80' },
  { name: 'fenghuang.jpg', url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80' },
  { name: 'festival.jpg', url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80' },
  { name: 'heritage.jpg', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80' },
  { name: 'rubbing.jpg', url: 'https://images.unsplash.com/photo-1544717302-de293b956d5b?w=1200&q=80' },
  { name: 'ginger-class.jpg', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80' },
  { name: 'villager-home.jpg', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80' },
  { name: 'villager-affairs.jpg', url: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=1200&q=80' },
  { name: 'villager-build.jpg', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80' },
  { name: 'villager-service.jpg', url: 'https://images.unsplash.com/photo-1544717302-de293b956d5b?w=1200&q=80' },
  { name: 'points-ginger.jpg', url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80' },
  { name: 'points-coffee.jpg', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80' },
  { name: 'points-farm.jpg', url: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800&q=80' },
  { name: 'stall-ginger.jpg', url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80' },
  { name: 'house-courtyard.jpg', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80' },
  { name: 'course-video.jpg', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80' },
  { name: 'product-ginger-jar.jpg', url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80' },
  { name: 'product-ginger-gift.jpg', url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80' },
  { name: 'product-candy.jpg', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80' },
  { name: 'product-rubbing.jpg', url: 'https://images.unsplash.com/photo-1544717302-de293b956d5b?w=800&q=80' },
  { name: 'product-bookmark.jpg', url: 'https://images.unsplash.com/photo-1544717302-de293b956d5b?w=800&q=80' },
  { name: 'product-magnet.jpg', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80' }
];

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Downloaded: ${filename}`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      console.error(`Failed to download ${filename}: ${err.message}`);
      resolve();
    });
  });
};

const run = async () => {
  console.log('Downloading images...');
  for (const image of imageUrls) {
    await downloadImage(image.url, image.name);
  }
  console.log('All images downloaded!');
};

run().catch(console.error);