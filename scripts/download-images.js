const fs = require('fs');
const path = require('path');
const https = require('https');

const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const imageUrls = [
  { name: 'yian-cover.jpg', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80', desc: '安徽水乡古镇风景' },
  { name: 'liqiao.jpg', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80', desc: '犁桥水镇-江南水乡白墙黛瓦水巷' },
  { name: 'yongquan.jpg', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80', desc: '永泉小镇-山林徽派建筑温泉' },
  { name: 'fenghuang.jpg', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80', desc: '凤凰山-花田山野步道风景' },
  { name: 'festival.jpg', url: 'https://images.unsplash.com/photo-1514306191717-4522421695d8?w=1200&q=80', desc: '凤丹文化旅游季-民俗活动集市' },
  { name: 'heritage.jpg', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80', desc: '非遗演艺课-传统手工艺教学' },
  { name: 'rubbing.jpg', url: 'https://images.unsplash.com/photo-1618641986544-5f81f8265926?w=1200&q=80', desc: '铜拓本-青铜纹样拓印工艺' },
  { name: 'ginger-class.jpg', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80', desc: '白姜腌制小课堂-厨房教学' },
  { name: 'villager-home.jpg', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80', desc: '村民服务首页-乡村生活场景' },
  { name: 'villager-affairs.jpg', url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80', desc: '村务公开-公告栏办公场所' },
  { name: 'villager-build.jpg', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80', desc: '乡村共建-村民劳动建设' },
  { name: 'villager-service.jpg', url: 'https://images.unsplash.com/photo-1544717302-de293b956d5b?w=1200&q=80', desc: '便民服务-服务柜台帮助村民' },
  { name: 'points-ginger.jpg', url: 'https://images.unsplash.com/photo-1603249673867-875ad5e2b250?w=800&q=80', desc: '积分超市-白姜礼盒产品' },
  { name: 'points-coffee.jpg', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', desc: '积分超市-咖啡兑换券场景' },
  { name: 'points-farm.jpg', url: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800&q=80', desc: '积分超市-农耕体验活动' },
  { name: 'stall-ginger.jpg', url: 'https://images.unsplash.com/photo-1603249673867-875ad5e2b250?w=800&q=80', desc: '我的货摊-铜陵白姜农产品' },
  { name: 'house-courtyard.jpg', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', desc: '农房盘活-徽派庭院老建筑' },
  { name: 'course-video.jpg', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', desc: '课程培训-线上视频课学习' },
  { name: 'product-ginger-jar.jpg', url: 'https://images.unsplash.com/photo-1603249673867-875ad5e2b250?w=800&q=80', desc: '商品-铜陵白姜小罐装' },
  { name: 'product-ginger-gift.jpg', url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80', desc: '商品-白姜双味礼盒包装' },
  { name: 'product-candy.jpg', url: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&q=80', desc: '商品-顺安酥糖芝麻糖' },
  { name: 'product-rubbing.jpg', url: 'https://images.unsplash.com/photo-1618641986544-5f81f8265926?w=800&q=80', desc: '商品-青铜纹样拓印册' },
  { name: 'product-bookmark.jpg', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', desc: '商品-铜都书签套装黄铜' },
  { name: 'product-magnet.jpg', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80', desc: '商品-犁桥水镇冰箱贴' }
];

const downloadImage = (url, filename) => {
  return new Promise((resolve) => {
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
      console.error(`Failed: ${filename} - ${err.message}`);
      resolve();
    });
  });
};

const run = async () => {
  console.log('Downloading images matching titles...');
  for (const image of imageUrls) {
    console.log(`→ ${image.desc}`);
    await downloadImage(image.url, image.name);
  }
  console.log('All images downloaded!');
};

run().catch(console.error);