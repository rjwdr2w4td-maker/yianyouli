const createImageUrl = (prompt, imageSize) => `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${imageSize}`;

export const travelImages = {
  homeCover: createImageUrl('Realistic documentary travel photograph of Liqiao Water Town in Yian District Tongling Anhui China at dusk, authentic Hui style white walls and dark roofs, canal reflections, red lanterns, a small wooden boat, natural cinematic light, no illustration, no text, professional tourism photography', 'portrait_4_3'),
  attractions: {
    liqiao: createImageUrl('Realistic ultra wide panoramic travel photograph of Liqiao Water Town in Yian District Tongling Anhui China at blue hour, authentic Hui style village, stone bridge, canal and red lantern reflections, documentary photography, no illustration, no text', 'landscape_16_9'),
    yongquan: createImageUrl('Realistic ultra wide panoramic travel photograph of Yongquan Town in Yian District Tongling Anhui China, forest hills, traditional Hui style courtyards, stone path, warm lanterns, natural morning mist, documentary tourism photography, no illustration, no text', 'landscape_16_9'),
    fenghuang: createImageUrl('Realistic ultra wide panoramic travel photograph of Fenghuang Mountain in Yian District Tongling Anhui China during peony season, flower fields, green mountain trail, natural daylight, documentary landscape photography, no illustration, no text', 'landscape_16_9')
  },
  culture: {
    festival: createImageUrl('Realistic documentary photograph of the Fenghuang Mountain peony cultural festival in Yian District Tongling Anhui China, visitors walking through peony flowers, local folk activities, natural daylight, no illustration, no text', 'landscape_4_3'),
    heritage: createImageUrl('Realistic documentary photograph of an intangible cultural heritage class in Liqiao Water Town Yian District Tongling Anhui China, local artisan teaching families a traditional craft inside a Hui style hall, natural light, no illustration, no text', 'landscape_4_3'),
    rubbing: createImageUrl('Realistic close documentary photograph of a Chinese bronze pattern rubbing workshop in Tongling Anhui China, artisan hands using ink and handmade paper, authentic craft studio, natural light, no illustration, no text', 'landscape_4_3'),
    gingerClass: createImageUrl('Realistic documentary food culture photograph of a Tongling white ginger pickling workshop in Yian District Anhui China, local teacher and visitors preparing fresh ginger in a traditional kitchen, natural light, no illustration, no text', 'landscape_4_3')
  },
  villager: {
    home: createImageUrl('Realistic documentary photograph of a welcoming village service scene in Yian District Tongling Anhui China, local villagers walking beside Hui style white wall houses, green rice fields and warm morning sunlight, peaceful authentic rural life, no text, professional editorial photography', 'landscape_16_9'),
    affairs: createImageUrl('Realistic documentary photograph of a clean village public service center in Yian District Tongling Anhui China, Hui style architecture, bulletin board and villagers discussing community affairs, warm natural daylight, no text', 'landscape_16_9'),
    build: createImageUrl('Realistic documentary photograph of villagers working together in a beautiful Anhui countryside, planting flowers and improving a traditional Hui style village courtyard, warm sunlight, authentic community life, no text', 'landscape_16_9'),
    service: createImageUrl('Realistic close documentary photograph of warm rural community service in Anhui China, local staff helping an elderly villager with paperwork at a bright village service desk, natural light, no text', 'landscape_4_3'),
    pointsGinger: createImageUrl('Realistic commercial product photograph of a Tongling white ginger reward gift box with fresh ginger and kraft paper packaging on a warm cream studio background, soft natural shadow, no text', 'square'),
    pointsCoffee: createImageUrl('Realistic commercial product photograph of a rural coffee voucher represented by a handcrafted ceramic coffee cup beside a village cafe counter, warm natural light, no text', 'square'),
    pointsFarm: createImageUrl('Realistic documentary photograph of a family farming experience in Anhui countryside, children planting vegetables with a farmer beside rice fields, warm daylight, no text', 'square'),
    stallGinger: createImageUrl('Realistic commercial product photograph of freshly harvested Tongling white ginger arranged in a woven bamboo basket, Anhui countryside farm background, natural daylight, no text', 'square'),
    houseCourtyard: createImageUrl('Realistic architectural photograph of a traditional Hui style rural courtyard house in Anhui China, white walls dark tiled roof, lush garden, warm afternoon light, no text', 'landscape_4_3'),
    courseVideoCover: createImageUrl('Realistic documentary photograph of a Chinese rural digital skills training class, villagers learning smartphone video shooting in a bright village classroom, natural light, no text', 'landscape_16_9')
  },
  products: {
    gingerJar: createImageUrl('Realistic commercial product photograph of Tongling white ginger in a small premium glass jar, clean warm beige studio background, authentic Chinese local specialty packaging, soft natural shadow, no illustration, no text', 'square'),
    gingerGift: createImageUrl('Realistic commercial product photograph of a premium Tongling white ginger gift box with six small jars, refined red and kraft paper packaging, warm neutral studio background, no illustration, no text', 'square'),
    candy: createImageUrl('Realistic commercial product photograph of traditional Shunan sesame crispy candy from Tongling Anhui China, pieces arranged beside a kraft paper gift box, warm natural studio light, no illustration, no text', 'square'),
    rubbingBook: createImageUrl('Realistic museum shop product photograph of a Chinese bronze pattern rubbing art notebook, black ink handmade paper and bronze motif, dark wood tabletop, no illustration, no text', 'square'),
    bookmark: createImageUrl('Realistic product photograph of three brass bookmarks with ancient Chinese bronze patterns, elegant museum souvenir on neutral paper background, no illustration, no text', 'square'),
    magnet: createImageUrl('Realistic product photograph of an enamel fridge magnet inspired by Liqiao Water Town Tongling, bridge canal and lantern motif, clean cream studio background, no illustration, no text', 'square')
  }
};
