const createImageUrl = (filename) => `${import.meta.env.BASE_URL}images/${filename}`;

export const travelImages = {
  homeCover: createImageUrl('yian-cover.jpg'),
  attractions: {
    liqiao: createImageUrl('liqiao.jpg'),
    yongquan: createImageUrl('yongquan.jpg'),
    fenghuang: createImageUrl('fenghuang.jpg')
  },
  culture: {
    festival: createImageUrl('festival.jpg'),
    heritage: createImageUrl('heritage.jpg'),
    rubbing: createImageUrl('rubbing.jpg'),
    gingerClass: createImageUrl('ginger-class.jpg')
  },
  villager: {
    home: createImageUrl('villager-home.jpg'),
    affairs: createImageUrl('villager-affairs.jpg'),
    build: createImageUrl('villager-build.jpg'),
    service: createImageUrl('villager-service.jpg'),
    pointsGinger: createImageUrl('points-ginger.jpg'),
    pointsCoffee: createImageUrl('points-coffee.jpg'),
    pointsFarm: createImageUrl('points-farm.jpg'),
    stallGinger: createImageUrl('stall-ginger.jpg'),
    houseCourtyard: createImageUrl('house-courtyard.jpg'),
    courseVideoCover: createImageUrl('course-video.jpg')
  },
  products: {
    gingerJar: createImageUrl('product-ginger-jar.jpg'),
    gingerGift: createImageUrl('product-ginger-gift.jpg'),
    candy: createImageUrl('product-candy.jpg'),
    rubbingBook: createImageUrl('product-rubbing.jpg'),
    bookmark: createImageUrl('product-bookmark.jpg'),
    magnet: createImageUrl('product-magnet.jpg')
  }
};