const createImageUrl = (filename) => `${import.meta.env.BASE_URL}images/${filename}`;

export const travelImages = {
  homeCover: createImageUrl('yian-cover.jpg'),
  attractions: {
    liqiao: createImageUrl('attraction-liqiao.jpg'),
    yongquan: createImageUrl('attraction-yongquan.jpg'),
    fenghuang: createImageUrl('attraction-fenghuang.jpg')
  },
  culture: {
    festival: createImageUrl('culture-festival.jpg'),
    heritage: createImageUrl('culture-heritage.jpg'),
    rubbing: createImageUrl('culture-rubbing.jpg'),
    gingerClass: createImageUrl('culture-ginger.jpg')
  },
  villager: {
    home: createImageUrl('villager-home.jpg'),
    affairs: createImageUrl('villager-affairs.jpg'),
    build: createImageUrl('villager-build.jpg'),
    service: createImageUrl('villager-service.jpg'),
    pointsGinger: createImageUrl('villager-points-ginger.jpg'),
    pointsCoffee: createImageUrl('villager-points-coffee.jpg'),
    pointsFarm: createImageUrl('villager-points-farm.jpg'),
    stallGinger: createImageUrl('villager-stall-ginger.jpg'),
    houseCourtyard: createImageUrl('villager-house.jpg'),
    courseVideoCover: createImageUrl('villager-course-video.jpg')
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