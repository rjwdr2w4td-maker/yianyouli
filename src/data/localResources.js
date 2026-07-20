import { travelImages } from './images';

export const localResourceTypes = {
  farmhouse: '农家乐',
  stay: '住宿',
  food: '美食'
};

export const localResources = [
  {
    id: 'yongquan-farmhouse',
    type: 'farmhouse',
    name: '永泉山里人家',
    label: '山野家宴',
    categories: ['农家乐'],
    location: '钟鸣镇叶山林场',
    phone: '05625689111',
    time: '建议用餐 1—2 小时',
    intro: '坐进山林里的院子，尝一桌顺时而作的土菜。鲜笋、土鸡和白姜风味，适合把旅途中的一顿饭吃得从容。',
    image: travelImages.attractions.yongquan,
    highlights: ['时令土菜', '山景院落', '可预约包桌'],
    detail: '依山而建的家常餐馆，保留柴火灶、竹篱和院落式用餐空间。菜品随季节调整，适合家庭出游、朋友聚餐，也适合在永泉小镇游览后顺路用餐。'
  },
  {
    id: 'liqiao-gengxintang',
    type: 'stay',
    name: '犁桥耕心堂',
    label: '临水院落',
    categories: ['住宿'],
    location: '西联镇犁桥村',
    time: '¥420 起 · 适合住 1 晚',
    intro: '临水而居的徽派院落，夜游水镇后步行回房，清晨在灯影散去之前看一眼安静的水巷。',
    image: travelImages.attractions.liqiao,
    highlights: ['临水房间', '步行到水镇', '含早餐'],
    detail: '耕心堂将旧民居的尺度与轻量化的度假设施结合起来，房间不多，适合喜欢安静和慢节奏的旅人。入住后可向店家咨询水镇夜游、非遗演艺和周边餐饮安排。'
  },
  {
    id: 'yongquan-songyun',
    type: 'stay',
    name: '永泉松云山居',
    label: '温泉山居',
    categories: ['住宿'],
    location: '钟鸣镇叶山林场',
    phone: '05625689101',
    time: '¥680 起 · 景区内',
    intro: '把住宿安排进山林深处，傍晚泡温泉，第二天清晨再走忆江南十二景，让一天真正慢下来。',
    image: travelImages.attractions.yongquan,
    highlights: ['景区内入住', '温泉体验', '山林早餐'],
    detail: '松云山居藏在永泉小镇的山林与院落之间，适合将游览、用餐和休息安排在同一片风景里。建议提前预订，并根据季节选择露台或庭院房型。'
  },
  {
    id: 'liqiao-yuanlou',
    type: 'food',
    name: '犁桥圆楼家宴',
    label: '水镇家宴',
    categories: ['美食'],
    location: '西联镇犁桥村圆楼',
    time: '人均约 ¥90 · 建议预约',
    intro: '太白雕胡饭、小河鱼与时令土菜适合多人围坐，晚餐后正好衔接水镇亮灯和夜游。',
    image: travelImages.culture.heritage,
    highlights: ['徽味家宴', '多人围坐', '夜游顺路'],
    detail: '圆楼家宴以义安本地风味为主，菜式注重当季食材和围桌分享的氛围。建议在傍晚提前到店，吃完后沿水岸散步，等待水镇灯火亮起。'
  },
  {
    id: 'shunan-fengwei',
    type: 'food',
    name: '顺安风味馆',
    label: '乡野风味',
    categories: ['美食'],
    location: '顺安镇凤凰村',
    phone: '05625689502',
    time: '人均约 ¥75 · 午晚餐',
    intro: '小河鱼、散养鸡与时令蔬菜讲究锅气，是走完凤凰山山路后朴素而踏实的一餐。',
    image: travelImages.attractions.fenghuang,
    highlights: ['小河鱼', '散养土鸡', '时令蔬菜'],
    detail: '顺安风味馆把附近村落的家常味道端上餐桌，口味实在，分量适合分享。凤凰山游览结束后可从北入口前往，周末和花期建议提前电话咨询座位。'
  }
];

export const localResourceMap = localResources.reduce((map, resource) => {
  map[resource.type] = map[resource.type] || {};
  map[resource.type][resource.id] = resource;
  return map;
}, {});
