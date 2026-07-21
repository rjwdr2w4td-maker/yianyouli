import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './Detail.css';
import { travelImages } from '../data/images';
import { useFeedback } from '../components/Feedback';
import { addCartItem, saveBooking } from '../data/profileStorage';

const detailMap = {
  attraction: {
    liqiao: { eyebrow: '江南水乡', title: '犁桥水镇', subtitle: '灯影入水，水巷入梦', image: travelImages.attractions.liqiao, meta: ['西联镇犁桥村', '建议游览 3—4 小时'], intro: '以明塘文化艺术村为依托，保留徽派村落肌理与水巷格局。黄昏之后，灯影、乌篷船和非遗演艺共同构成水镇最有辨识度的时刻。', facts: ['水镇夜游', '非遗演艺', '明塘艺术村'], action: '查看购票' },
    yongquan: { eyebrow: '山居度假', title: '永泉小镇', subtitle: '把一天交给山林与温泉', image: travelImages.attractions.yongquan, meta: ['钟鸣镇叶山林场', '建议游览 1 天'], intro: '山林、温泉、徽派院落和江南小吃共同组成小镇的慢度假体验。适合安排一整天，也可以住一晚，把忆江南十二景留到清晨慢慢走。', facts: ['忆江南十二景', '江南味道', '温泉山居'], action: '查看购票' },
    fenghuang: { eyebrow: '花海铜史', title: '凤凰山', subtitle: '花事与铜史在山野相遇', image: travelImages.attractions.fenghuang, meta: ['顺安镇凤凰村', '建议游览半日'], intro: '凤凰山既有凤丹花事，也保存着古代采矿遗迹。春季看花，全年都可以沿山路寻找金牛洞等铜文化线索。', facts: ['凤丹花海', '金牛洞遗址', '山野步道'], action: '查看购票' }
  },
  culture: {
    '1': { eyebrow: '节庆活动', title: '凤凰山凤丹文化旅游季', subtitle: '赏凤丹、看民俗、逛乡集', image: travelImages.culture.festival, meta: ['04.18—05.05', '凤凰山景区'], intro: '把春天交给一座花山。赏凤丹、看民俗、逛乡集，跟着花期认识义安的山野风土。', facts: ['民俗演艺', '乡野集市', '花海漫游'], action: '预约活动' },
    '2': { eyebrow: '非遗课堂', title: '犁桥水镇非遗演艺课', subtitle: '先看一场演出，再学一段技艺', image: travelImages.culture.heritage, meta: ['每周六 14:00', '犁桥水镇圆楼'], intro: '适合亲子同行的非遗体验，从一场地方演出开始，跟老师学一段可以带回家的手艺。', facts: ['余 8 席', '亲子友好', '约 90 分钟'], action: '预约体验' },
    '3': { eyebrow: '手工体验', title: '铜拓本与青铜纹样', subtitle: '做一张属于自己的铜文化拓本', image: travelImages.culture.rubbing, meta: ['预约制 · 约 90 分钟', '江南铜谷体验馆'], intro: '从纹样、墨色和纸张开始，认识铜文化的线条与质感，完成一张独一无二的手工拓本。', facts: ['手工制作', '可带走作品', '可预约'], action: '预约体验' },
    '4': { eyebrow: '手工体验', title: '义安白姜腌制小课堂', subtitle: '把一小罐脆辣风味带回家', image: travelImages.culture.gingerClass, meta: ['每周日 10:00', '永泉小镇农事工坊'], intro: '认识白姜、处理白姜，再把义安的脆辣风味装进一小罐手作记忆。', facts: ['余 12 席', '地方风味', '亲子可参加'], action: '预约体验' }
  },
  service: {
    ticket: { eyebrow: '游览服务', title: '门票与活动', subtitle: '景点门票与活动预约，一页完成', meta: ['景区门票 · 活动体验预约', '按景点选择'], intro: '先选择想去的景点，填写门票订单；近期活动也可直接提交预约信息并生成预约编号。', facts: ['犁桥水镇 · 夜游与演艺', '凤凰山 · 景区门票与活动', '永泉小镇 · 度假套票与体验'], action: '选择景点' },
    traffic: { eyebrow: '游览服务', title: '交通接驳', subtitle: '按景点切换，找到抵达义安的最后一公里', meta: ['公交线路 · 景区专线', '按景点实时参考'], intro: '选择目的地后查看对应的抵达方式、推荐站点与参考时长，按景点安排出行。', facts: ['铜陵站 → 永泉小镇', '铜陵北站 → 犁桥水镇', '顺安镇 → 凤凰山'], action: '查看路线' },
    parking: { eyebrow: '游览服务', title: '停车服务', subtitle: '按景点查看停车场、余位与充电设施', meta: ['停车场余位 · 充电桩', '按景点实时参考'], intro: '根据目的地切换停车信息，提前了解停车场位置、余位状态与充电设施。', facts: ['犁桥游客中心', '永泉小镇东门', '凤凰山北入口'], action: '查看停车' },
    facilities: { eyebrow: '游览服务', title: '便民设施', subtitle: '按景点找到旅途中每一个小需要', meta: ['卫生间 · 母婴室 · 医务点', '按景点查询'], intro: '选择景点后查看对应的卫生间、母婴室、医务点和服务台等便民点位。', facts: ['卫生间', '母婴室', '医务点'], action: '查看设施' },
    consult: { eyebrow: '游览服务', title: '游客咨询', subtitle: '关于义安，随时通过客服电话获得帮助', meta: ['开放时间 · 失物招领', '电话服务'], intro: '景区开放时间、活动规则、失物招领、旅游投诉和行程协助，均可拨打游客咨询客服电话。', facts: ['客服电话 0562—12345', '失物招领', '旅游投诉'], action: '拨打客服电话' }
  },
  product: {
    '1': { eyebrow: '白姜好礼', title: '铜陵白姜·小罐装', subtitle: '脆嫩少渣的义安风味', image: travelImages.products.gingerJar, meta: ['¥36', '200 克'], intro: '选用铜陵白姜制作，清脆爽口、姜香细腻，适合佐餐，也适合作为轻巧的地方手信。', facts: ['全球重要农业文化遗产', '独立小罐', '产地直发'], action: '加入购物袋' },
    '2': { eyebrow: '白姜好礼', title: '白姜双味礼盒', subtitle: '一盒收下两种姜香', image: travelImages.products.gingerGift, meta: ['¥128', '6 罐'], intro: '甜口与咸口组合装，适合节日赠礼，也适合把义安的味觉记忆带给家人朋友。', facts: ['甜口 / 咸口', '精装礼盒', '地方特产'], action: '加入购物袋' },
    '3': { eyebrow: '顺安酥香', title: '顺安酥糖', subtitle: '芝麻麦芽香，入口即化', image: travelImages.products.candy, meta: ['¥48', '400 克'], intro: '传统工艺制作的顺安酥糖，芝麻香与麦芽甜平衡得恰到好处，是旅途中很受欢迎的分享型点心。', facts: ['芝麻麦芽香', '传统手艺', '适合分享'], action: '加入购物袋' },
    '4': { eyebrow: '铜韵文创', title: '青铜纹样拓印册', subtitle: '把铜文化带回日常', image: travelImages.products.rubbingBook, meta: ['¥88', '1 册'], intro: '以义安铜文化纹样为灵感的手工拓印册，翻开每一页，都是古老纹样与当代生活的一次相遇。', facts: ['手工拓印', '铜文化灵感', '收藏级纸张'], action: '加入购物袋' },
    '5': { eyebrow: '铜韵文创', title: '铜都书签套装', subtitle: '三枚黄铜，夹住一段旅程', image: travelImages.products.bookmark, meta: ['¥39', '3 枚'], intro: '以古代青铜纹样为设计线索，三枚黄铜书签轻薄耐用，适合送给喜欢阅读的人。', facts: ['黄铜材质', '3 枚套装', '旅行纪念'], action: '加入购物袋' },
    '6': { eyebrow: '水镇手信', title: '犁桥水镇冰箱贴', subtitle: '把夜游灯影留在冰箱门上', image: travelImages.products.magnet, meta: ['¥29', '1 枚'], intro: '桥、水巷与灯笼组成的水镇限定冰箱贴，为旅途留下一枚轻巧而具体的纪念。', facts: ['夜游限定', '水镇造型', '轻巧便携'], action: '加入购物袋' }
  }
};

const vrLinks = {
  fenghuang: 'https://eeez047k2ro.720yun.com/vr/0abjtOwu5v8',
  yongquan: 'https://eeez047k2ro.720yun.com/vr/167jerhmta3',
  liqiao: 'https://eeez047k2ro.720yun.com/vr/7e2jerkvsv3'
};

const attractionStories = {
  liqiao: {
    lead: '犁桥的好，不在匆匆经过，而在从白昼等到灯火初上。水系穿村而过，旧民居、圆楼与艺术空间分布在两岸，步行尺度舒缓，适合边走边停。',
    quote: '一条水巷，把村落的旧日常与今天的艺术生活连在一起。',
    vr: '沿水巷、古桥与圆楼三个视角，预览黄昏至夜间的游览动线。',
    stay: { title: '犁桥耕心堂', meta: '步行约 6 分钟 · ¥420 起', text: '临水院落适合夜游后入住，清晨可以在游客抵达前看看安静的水镇。', image: travelImages.attractions.liqiao },
    food: { title: '犁桥圆楼家宴', meta: '人均约 ¥90 · 建议预约', text: '太白雕胡饭、小河鱼与时令土菜适合多人围坐，晚餐后正好衔接亮灯。', image: travelImages.culture.heritage },
    play: ['16:00 从明塘艺术村入镇', '17:30 圆楼家宴与水岸散步', '18:40 看水镇亮灯', '19:30 非遗演艺与夜游'],
    products: [{ id: 6, title: '水镇限定冰箱贴', image: travelImages.products.magnet }, { id: 4, title: '青铜纹样拓印册', image: travelImages.products.rubbingBook }],
    event: { id: 2, eyebrow: '每周六 14:00', title: '犁桥水镇非遗演艺课', status: '余 8 席', image: travelImages.culture.heritage }
  },
  yongquan: {
    lead: '永泉适合把行程放慢。山林步道、徽派院落、温泉与江南小吃并不是彼此割裂的项目，而是一条从清晨走到夜晚的度假线。',
    quote: '住下来，山林才从景色变成一天的生活。',
    vr: '从忆江南十二景、江南味道与温泉山居三个视角，提前安排一日节奏。',
    stay: { title: '永泉松云山居', meta: '景区内 · ¥680 起', text: '院落藏在山林里，适合傍晚泡温泉，第二天清晨再走忆江南十二景。', image: travelImages.attractions.yongquan },
    food: { title: '永泉江南味道', meta: '铜钱消费 · 全天开放', text: '先换一袋铜钱，再沿青石路选杀猪汤、米粉与炉火点心，边走边吃。', image: travelImages.culture.gingerClass },
    play: ['09:00 入园走忆江南十二景', '12:00 江南味道午餐', '14:30 山林茶歇与院落漫游', '18:00 温泉与山居夜宿'],
    products: [{ id: 1, title: '铜陵白姜·小罐装', image: travelImages.products.gingerJar }, { id: 2, title: '白姜双味礼盒', image: travelImages.products.gingerGift }],
    event: { id: 4, eyebrow: '每周日 10:00', title: '义安白姜腌制小课堂', status: '余 12 席', image: travelImages.culture.gingerClass }
  },
  fenghuang: {
    lead: '凤凰山有两条值得同时阅读的线索：春日凤丹带来的花事，以及藏在山体与村落之间的古代采铜记忆。不同季节到访，都能找到清晰主题。',
    quote: '花开有时，铜史长存；山路把两段时间放在同一片风景里。',
    vr: '预览凤丹花田、山野步道与金牛洞遗址方向，提前判断步行强度。',
    stay: { title: '永泉竹塰人家', meta: '车程约 25 分钟 · ¥520 起', text: '结束半日山行后转入竹林院落休息，适合与永泉小镇组合成两日行程。', image: travelImages.attractions.yongquan },
    food: { title: '山里任家', meta: '人均约 ¥75 · 顺安镇', text: '小河鱼、散养鸡与时令蔬菜讲究锅气，是走完山路后朴素而踏实的一餐。', image: travelImages.culture.gingerClass },
    play: ['08:30 从北入口上山', '10:00 凤丹花田或山野步道', '11:30 探访金牛洞遗址', '13:00 顺安镇农家午餐'],
    products: [{ id: 3, title: '顺安酥糖', image: travelImages.products.candy }, { id: 5, title: '铜都书签套装', image: travelImages.products.bookmark }],
    event: { id: 1, eyebrow: '04.18—05.05', title: '凤凰山凤丹文化旅游季', status: '报名中', image: travelImages.culture.festival }
  }
};

const productStories = {
  '1': {
    story: '铜陵白姜在义安已有悠久的栽培传统。姜农顺着节气留种、搭棚、培土，等姜块长得饱满脆嫩，再把最清亮的一段姜香收进小罐里。它不是浓烈辛辣的调味料，而是一口能辨认产地的清爽风物。',
    storyImage: travelImages.culture.gingerClass,
    material: { title: '只取脆嫩姜块', text: '选用纤维细、汁水足的铜陵白姜，修去老皮与粗纤维后切制。配料以突出姜本身的鲜脆为准，不用厚重味道遮盖产地风味。', image: travelImages.products.gingerJar },
    craft: ['产地鲜姜分级挑选', '手工修整并均匀切制', '短时入味，保留清脆口感', '小罐分装，便于一次取食'],
    specs: [['净含量', '200 克'], ['包装', '玻璃小罐'], ['口味', '清甜微辛'], ['产地', '安徽铜陵义安']],
    care: ['未开封置于阴凉干燥处', '开封后冷藏并使用洁净餐具取食', '建议尽快食用，以保持脆嫩口感'],
    scenes: [{ title: '清粥小菜', text: '配一碗白粥或清汤面，姜香干净利落。', image: travelImages.products.gingerGift }, { title: '轻巧伴手礼', text: '体积小巧，适合旅途中随手带给朋友。', image: travelImages.attractions.yongquan }]
  },
  '2': {
    story: '同一块铜陵白姜，在不同调味里会呈现两种性格。双味礼盒把清甜与咸鲜并置，一罐适合晨间佐粥，一罐适合家常配饭，让收礼的人从两种味道里认识义安白姜。',
    storyImage: travelImages.culture.gingerClass,
    material: { title: '一盒，两种姜香', text: '核心原料均为铜陵白姜，甜口突出清香与回甘，咸口强调鲜脆与佐餐感。六罐独立分装，减少反复开合对风味的影响。', image: travelImages.products.gingerGift },
    craft: ['鲜姜按大小与嫩度分级', '甜、咸两组配方分别入味', '小罐独立灌装与密封', '礼盒分格固定，适合携带'],
    specs: [['规格', '6 罐装'], ['组合', '甜口 / 咸口'], ['包装', '手提礼盒'], ['适合人数', '家庭分享']],
    care: ['礼盒避免阳光直射与高温环境', '开罐后需冷藏保存', '不同口味建议使用独立餐具取食'],
    scenes: [{ title: '节日赠礼', text: '两种口味照顾不同偏好，适合拜访与团聚。', image: travelImages.products.gingerJar }, { title: '家庭早餐', text: '六罐慢慢开，给日常餐桌留一份地方滋味。', image: travelImages.attractions.yongquan }]
  },
  '3': {
    story: '顺安酥糖的迷人之处，在“酥”字。芝麻的焙香、麦芽的温甜与层层拉出的细腻糖丝一起入口，轻轻一碰便松散化开，是顺安街巷里延续多年的茶点记忆。',
    storyImage: travelImages.attractions.fenghuang,
    material: { title: '芝麻与麦芽的朴素组合', text: '以熟芝麻、麦芽糖等传统原料为主，重在控制火候与比例。芝麻负责香气，麦芽带来柔和甜感，粉料让成品形成松而不散的层次。', image: travelImages.products.candy },
    craft: ['芝麻低温焙香', '麦芽糖熬制至合适糖度', '反复拉折形成细密层次', '趁温切块并及时封装'],
    specs: [['净含量', '400 克'], ['口感', '酥松易化'], ['风味', '芝麻麦芽香'], ['包装', '独立分装']],
    care: ['置于阴凉干燥处并注意防潮', '开袋后及时密封', '酥糖易碎，携带时避免挤压碰撞'],
    scenes: [{ title: '旅行茶点', text: '配清茶慢慢吃，甜度与芝麻香更显平衡。', image: travelImages.products.candy }, { title: '多人分享', text: '独立小包方便分食，也适合办公室茶歇。', image: travelImages.culture.festival }]
  },
  '4': {
    story: '铜陵因铜而兴，青铜器上的云雷、兽面与几何纹样也成为这片土地独特的视觉语言。拓印册把博物馆里的纹样转译成可以触摸、翻阅与亲手完成的纸上体验。',
    storyImage: travelImages.culture.rubbing,
    material: { title: '纸、墨与纹样的相遇', text: '选用适合拓印的厚实纸张与清晰纹版，纸面保留细微肌理，让墨色在按压中呈现深浅变化。装帧克制，突出青铜纹样本身。', image: travelImages.products.rubbingBook },
    craft: ['从义安铜文化中提取纹样', '调整线条深浅与拓印层次', '手工试拓校准墨量', '分册装订并配置体验页'],
    specs: [['数量', '1 册'], ['内容', '纹样页 / 体验页'], ['材质', '特种纸'], ['用途', '拓印与收藏']],
    care: ['避免受潮、暴晒与大幅弯折', '拓印时在平整桌面操作', '完成后待墨色干透再合上册页'],
    scenes: [{ title: '亲手拓一页', text: '在慢下来的按压里，读懂古老纹样的线条。', image: travelImages.culture.rubbing }, { title: '书桌上的铜文化', text: '既可体验，也可作为旅行收藏与灵感册。', image: travelImages.products.bookmark }]
  },
  '5': {
    story: '三枚书签取意于铜都记忆，将古代青铜纹样压缩成轻薄的阅读标记。金属会在长期触摸中留下温润变化，让一次义安之行随着阅读继续生长。',
    storyImage: travelImages.culture.rubbing,
    material: { title: '黄铜会记录时间', text: '选用薄片黄铜制作，在强度与轻巧之间取得平衡。表面保留温润金属色，纹样以蚀刻与镂空感呈现，边缘经过细致打磨。', image: travelImages.products.bookmark },
    craft: ['青铜纹样重新描线', '黄铜薄片精细成形', '纹样蚀刻与表面处理', '逐枚打磨边缘与尖角'],
    specs: [['数量', '3 枚'], ['材质', '黄铜'], ['组合', '三款纹样'], ['用途', '阅读标记 / 收藏']],
    care: ['使用后以柔软干布擦拭', '避免接触酸碱液体与潮湿环境', '黄铜自然氧化属材质特性，可保留岁月色泽'],
    scenes: [{ title: '每日阅读', text: '轻薄书签夹入书页，不打断纸张的平整感。', image: travelImages.products.rubbingBook }, { title: '送给爱书的人', text: '三枚成套，适合作为克制而有地方感的礼物。', image: travelImages.products.bookmark }]
  },
  '6': {
    story: '犁桥入夜后，桥洞、灯笼与水面倒影共同组成最鲜明的水镇记忆。冰箱贴把这幅夜游剪影缩成掌心大小，让旅程回到日常后，仍能在抬眼之间看见那晚的灯。',
    storyImage: travelImages.attractions.liqiao,
    material: { title: '把水镇轮廓做成立体小景', text: '以桥、水巷与灯笼为主要元素，通过层次分色呈现夜游氛围。背部磁贴适合吸附常见金属表面，正面细节兼顾辨识度与耐看度。', image: travelImages.products.magnet },
    craft: ['提取犁桥夜游标志性轮廓', '多层分色还原灯影关系', '细节上色与表面保护', '安装磁贴并逐枚检查'],
    specs: [['数量', '1 枚'], ['主题', '犁桥水镇夜游'], ['结构', '立体装饰 / 背部磁贴'], ['用途', '旅行纪念']],
    care: ['适用于平整洁净的金属表面', '避免高处跌落与用力弯折', '表面灰尘可用柔软干布轻拭'],
    scenes: [{ title: '留住夜游', text: '把桥与灯影贴在冰箱门上，成为每天可见的纪念。', image: travelImages.attractions.liqiao }, { title: '轻量收藏', text: '不占行李空间，适合为一次短途旅行留下坐标。', image: travelImages.culture.heritage }]
  }
};

const scenicServiceData = {
  traffic: {
    liqiao: { title: '犁桥水镇', label: '江南水乡', items: [['铜陵站', '市区公交 23 路 → 西联镇，再换乘景区专线', '约 45 分钟'], ['铜陵北站', '高铁站旅游专线 → 犁桥水镇游客中心', '约 25 分钟'], ['下车点', '犁桥水镇游客中心', '步行 3 分钟入镇']] },
    yongquan: { title: '永泉小镇', label: '山居度假', items: [['铜陵站', '铜陵站广场 → 永泉小镇旅游专线', '约 35 分钟'], ['铜陵北站', '高铁站 → 钟鸣镇，再换乘景区接驳', '约 50 分钟'], ['下车点', '永泉小镇东门', '步行 5 分钟入园']] },
    fenghuang: { title: '凤凰山', label: '花海铜史', items: [['铜陵站', '公交至顺安镇，再换乘凤凰山接驳车', '约 55 分钟'], ['铜陵北站', '高铁站 → 顺安镇旅游集散中心', '约 40 分钟'], ['下车点', '凤凰山北入口', '接驳车约 15 分钟一班']] }
  },
  parking: {
    liqiao: { title: '犁桥水镇', label: '江南水乡', items: [['犁桥游客中心停车场', '主入口东侧 · 余位 86 个', '小客车 10 元/次，新能源充电 8 个'], ['圆楼南侧停车场', '水镇南入口 · 余位 42 个', '小客车 10 元/次，步行约 6 分钟'], ['明塘艺术村停车场', '艺术村西侧 · 余位 28 个', '免费，夜游高峰建议提前到达']] },
    yongquan: { title: '永泉小镇', label: '山居度假', items: [['永泉东门停车场', '东门入口 · 余位 118 个', '小客车 15 元/次，充电车位 12 个'], ['温泉区停车场', '温泉接待处旁 · 余位 36 个', '住客凭订单免费，访客 10 元/次'], ['忆江南停车场', '西侧山林入口 · 余位 54 个', '免费，步行约 8 分钟']] },
    fenghuang: { title: '凤凰山', label: '花海铜史', items: [['凤凰山北入口停车场', '北入口游客中心 · 余位 72 个', '小客车 10 元/次，暂未配置充电桩'], ['凤丹花田停车场', '花田入口 · 余位 31 个', '免费，花期高峰请服从现场引导'], ['金牛洞临时停车区', '金牛洞遗址方向 · 余位 18 个', '免费，仅开放日间时段']] }
  },
  facilities: {
    liqiao: { title: '犁桥水镇', label: '江南水乡', items: [['卫生间', '明塘艺术村入口、圆楼西侧', '无障碍厕位'], ['母婴室', '游客中心二层', '提供护理台与热水'], ['医务点', '游客中心服务台旁', '开放时间 09:00—21:00']] },
    yongquan: { title: '永泉小镇', label: '山居度假', items: [['卫生间', '东门、江南味道街区、温泉区', '东门设无障碍厕位'], ['母婴室', '江南味道街区入口', '提供护理台与休息座椅'], ['医务点', '温泉接待处', '开放时间 09:00—22:00']] },
    fenghuang: { title: '凤凰山', label: '花海铜史', items: [['卫生间', '北入口、凤丹花田入口', '北入口设无障碍厕位'], ['母婴室', '北入口游客中心', '提供护理台与温水'], ['医务点', '北入口游客中心内', '山路不适可先到此处休息']] }
  },
  consult: {
    liqiao: { title: '犁桥水镇', label: '江南水乡', items: [['景区客服电话', '0562—12345', '开放时间、购票与夜游咨询'], ['游客服务台', '0562—12345', '失物招领与现场协助']] },
    yongquan: { title: '永泉小镇', label: '山居度假', items: [['景区客服电话', '0562—12345', '温泉、住宿与套票咨询'], ['游客服务台', '0562—12345', '接驳、设施与现场协助']] },
    fenghuang: { title: '凤凰山', label: '花海铜史', items: [['景区客服电话', '0562—12345', '开放时间、花期与登山咨询'], ['游客服务台', '0562—12345', '失物招领与紧急协调']] }
  }
};

const ticketScenics = [
  { id: 'liqiao', title: '犁桥水镇', detail: '夜游与非遗演艺票务', tickets: [{ id: 'night', name: '水镇夜游票', price: 68 }, { id: 'show', name: '夜游演艺联票', price: 118 }] },
  { id: 'yongquan', title: '永泉小镇', detail: '度假套票与温泉体验', tickets: [{ id: 'garden', name: '忆江南游园票', price: 88 }, { id: 'spa', name: '游园温泉套票', price: 198 }] },
  { id: 'fenghuang', title: '凤凰山', detail: '景区门票与花季活动', tickets: [{ id: 'adult', name: '凤凰山成人票', price: 45 }, { id: 'family', name: '亲子双人票', price: 78 }] }
];

const ticketActivities = [
  { id: '2', title: '犁桥水镇非遗演艺课', time: '每周六 14:00', location: '犁桥水镇圆楼', status: '余 8 席' },
  { id: '4', title: '义安白姜腌制小课堂', time: '每周日 10:00', location: '永泉小镇农事工坊', status: '余 12 席' },
  { id: '1', title: '凤凰山凤丹文化旅游季', time: '04.18—05.05', location: '凤凰山景区', status: '报名中' }
];

const Detail = ({ kind }) => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { notify, openDialog } = useFeedback();
  const requestedScenic = searchParams.get('scenic');
  const initialScenic = ticketScenics.some((item) => item.id === requestedScenic) ? requestedScenic : 'liqiao';
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', count: '1', participantType: '成人', note: '', privacy: false });
  const [bookingErrors, setBookingErrors] = useState({});
  const [bookingNumber, setBookingNumber] = useState('');
  const [selectedScenic, setSelectedScenic] = useState(initialScenic);
  const [selectedActivity, setSelectedActivity] = useState(ticketActivities[0]);
  const detail = detailMap[kind]?.[id];

  useEffect(() => {
    if (kind !== 'service' || id !== 'ticket' || !requestedScenic || requestedScenic === selectedScenic) return;
    if (ticketScenics.some((item) => item.id === requestedScenic)) selectScenic(requestedScenic);
  }, [id, kind, requestedScenic, selectedScenic]);

  const attractionStory = kind === 'attraction' ? attractionStories[id] : null;
  const productStory = kind === 'product' ? productStories[id] : null;
  const scenicService = kind === 'service' && scenicServiceData[id] ? scenicServiceData[id][selectedScenic] : null;

  if (!detail) return <Navigate to={kind === 'product' ? '/shop' : kind === 'attraction' ? '/attractions' : kind === 'culture' ? '/culture' : '/services'} replace />;

  const selectedTicketScenic = ticketScenics.find((item) => item.id === selectedScenic);

  const selectScenic = (scenicId) => {
    setSelectedScenic(scenicId);
  };

  const showTicketDemo = () => {
    openDialog('景区购票演示', `当前为演示版本，暂不创建${selectedTicketScenic.title}票务订单。实际开放后，将跳转至官方票务渠道完成购票。`, '知道了');
  };

  const handlePrimaryAction = () => {
    if (kind === 'culture' || (kind === 'service' && id === 'ticket' && bookingOpen)) {
      setBookingOpen((current) => !current);
      setBookingNumber('');
      return;
    }

    if (kind === 'attraction') {
      openDialog('景区购票提示', `当前为演示版本，暂未接入${detail.title}官方票务渠道。正式开放后，可在此查看票种、价格和余票信息。`, '我知道了');
      return;
    }

    if (kind === 'product') {
      addCartItem(id);
      notify(`${detail.title}已加入购物袋`);
      navigate('/shop');
      return;
    }

    if (kind === 'service' && id === 'ticket') {
      return;
    }

    if (kind === 'service' && ['traffic', 'parking', 'facilities'].includes(id)) {
      openDialog(`${scenicService.title} · ${detail.action}`, `${scenicService.items.map(([label, value]) => `${label}：${value}`).join('\n')}。`);
      return;
    }

    if (kind === 'service' && id === 'consult') {
      notify('正在为你拨打游客咨询电话');
      window.location.href = 'tel:056212345';
      return;
    }

    notify(`${detail.title}${kind === 'attraction' || kind === 'culture' ? '预约成功' : '已为你打开'}`);
  };

  const submitBooking = (event) => {
    event.preventDefault();
    const errors = {};
    if (!bookingForm.name.trim()) errors.name = '请输入姓名';
    const normalizedPhone = bookingForm.phone.replace(/\D/g, '').replace(/^86(?=1[3-9]\d{9}$)/, '');
    if (!/^1[3-9]\d{9}$/.test(normalizedPhone)) errors.phone = '请输入正确的手机号';
    if (!bookingForm.count || Number(bookingForm.count) < 1 || Number(bookingForm.count) > 20) errors.count = '人数需为 1—20 人';
    if (!bookingForm.privacy) errors.privacy = '请先确认隐私说明';
    setBookingErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const number = `YA${Date.now().toString().slice(-8)}`;
    const activity = kind === 'service' && id === 'ticket'
      ? selectedActivity
      : { id, title: detail.title, time: detail.meta[0], location: detail.meta[1], status: '预约成功' };
    saveBooking({
      number,
      status: '预约成功',
      location: activity.location || ticketScenics.find((scenic) => activity.title.includes(scenic.title))?.title || '义安区活动服务点',
      source: kind === 'service' ? 'service' : 'culture',
      sourceLabel: kind === 'service' ? '服务预约' : '活动预约',
      activity: {
        id: activity.id,
        title: activity.title,
        time: activity.time,
        location: activity.location || ticketScenics.find((scenic) => activity.title.includes(scenic.title))?.title || '',
        status: '预约成功'
      },
      contact: {
        name: bookingForm.name.trim(),
        phone: normalizedPhone,
        count: Number(bookingForm.count),
        participantType: bookingForm.participantType,
        note: bookingForm.note.trim()
      }
    });
    setBookingNumber(number);
    notify(`预约成功，编号 ${number}`);
  };

  const updateBookingField = (field, value) => {
    setBookingForm((current) => ({ ...current, [field]: value }));
    setBookingErrors((current) => ({ ...current, [field]: '' }));
  };

  const openFacilityNavigation = (label, value) => {
    const destination = `${scenicService.title}${value.split('、')[0]}`;
    const url = `https://uri.amap.com/navigation?to=${encodeURIComponent(destination)}&mode=walk&callnative=1`;
    window.open(url, '_blank', 'noopener,noreferrer');
    notify(`正在打开${label}地图导航`);
  };

  const openVr = () => {
    const url = vrLinks[id];
    if (!url) {
      notify('该景区全景导览暂未开放');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`travel-page detail-page ${attractionStory ? 'scenic-detail-page' : ''}`}>
      <header className="detail-header">
        <Link to={kind === 'attraction' ? '/attractions' : kind === 'culture' ? '/culture' : kind === 'service' ? '/services' : '/shop'} className="detail-back">← 返回</Link>
        <span>{detail.eyebrow}</span>
        <h1>{detail.title}</h1>
        <p>{detail.subtitle}</p>
      </header>
      {detail.image && <div className="detail-hero"><img src={detail.image} alt={detail.title} />{attractionStory && <button type="button" className="detail-vr-entry" onClick={openVr}><strong>全景</strong><span>进入导览</span></button>}</div>}
      <main className="detail-content">
        <div className="detail-meta">{detail.meta.map((item) => <span key={item}>{item}</span>)}</div>
        <p className="detail-intro">{detail.intro}</p>
        {kind !== 'service' && <div className="detail-facts">{detail.facts.map((item) => <span key={item}>{item}</span>)}</div>}
        {kind === 'service' && (
          <section className="service-detail-panel">
            <div className="service-scenic-tabs" role="tablist" aria-label="景点切换">
              {ticketScenics.map((scenic) => <button type="button" key={scenic.id} className={selectedScenic === scenic.id ? 'active' : ''} onClick={() => id === 'ticket' ? selectScenic(scenic.id) : setSelectedScenic(scenic.id)}>{scenic.title}</button>)}
            </div>
            {id === 'ticket' ? (
              <>
                <div className="service-ticket-list">{ticketScenics.map((scenic) => <button type="button" key={scenic.id} className={selectedScenic === scenic.id ? 'active' : ''} onClick={() => selectScenic(scenic.id)}><span><strong>{scenic.title}</strong><small>{scenic.detail}</small></span><b>{selectedScenic === scenic.id ? '已选择' : '选择 →'}</b></button>)}</div>
                <section className="booking-panel ticket-booking-panel" aria-labelledby="ticket-booking-title">
                  <div className="booking-heading"><span>景区购票</span><h2 id="ticket-booking-title">{selectedTicketScenic.title}</h2><p>{selectedTicketScenic.detail}</p></div>
                  <div className="ticket-demo-panel">
                    <p>当前为购票功能演示。正式开放后，将跳转至景区官方票务渠道查看票种、价格和余票。</p>
                    <button type="button" className="booking-submit" onClick={showTicketDemo}>查看购票提示 <strong>→</strong></button>
                  </div>
                </section>
                <div className="service-activity-list"><div className="service-panel-title"><span>近期活动</span><strong>填写表单即可预约</strong></div>{ticketActivities.map((activity) => <React.Fragment key={activity.id}><button type="button" className={selectedActivity.id === activity.id && bookingOpen ? 'active' : ''} onClick={() => { const isCurrent = selectedActivity.id === activity.id && bookingOpen; setSelectedActivity(activity); setBookingOpen(!isCurrent); setBookingNumber(''); }}><span><strong>{activity.title}</strong><small>{activity.time}</small></span><b>{selectedActivity.id === activity.id && bookingOpen ? '收起 ↑' : `${activity.status} · 预约 →`}</b></button>{selectedActivity.id === activity.id && bookingOpen && <section className="booking-panel service-booking-panel" aria-labelledby={`service-booking-title-${activity.id}`}><div className="booking-heading"><span>活动预约</span><h2 id={`service-booking-title-${activity.id}`}>{activity.title}</h2><p>{activity.time} · {activity.status}</p></div>{bookingNumber ? <div className="booking-success" role="status"><span>预约已确认</span><strong>{bookingNumber}</strong><p>请凭预约编号与手机号到活动签到处核验。</p><div className="booking-success-actions"><Link to="/profile/bookings">查看我的预约</Link><button type="button" onClick={() => setBookingOpen(false)}>收起预约信息</button></div></div> : <form className="booking-form" onSubmit={submitBooking} noValidate><label>姓名<input value={bookingForm.name} onChange={(event) => updateBookingField('name', event.target.value)} placeholder="请输入真实姓名" />{bookingErrors.name && <small>{bookingErrors.name}</small>}</label><label>手机号<input type="tel" inputMode="numeric" value={bookingForm.phone} onChange={(event) => updateBookingField('phone', event.target.value)} placeholder="用于接收预约信息" />{bookingErrors.phone && <small>{bookingErrors.phone}</small>}</label><div className="booking-form-row"><label>人数<input type="number" min="1" max="20" value={bookingForm.count} onChange={(event) => updateBookingField('count', event.target.value)} />{bookingErrors.count && <small>{bookingErrors.count}</small>}</label><label>参与人类型<select value={bookingForm.participantType} onChange={(event) => updateBookingField('participantType', event.target.value)}><option>成人</option><option>儿童</option><option>亲子家庭</option><option>老年人</option></select></label></div><label>备注<textarea value={bookingForm.note} onChange={(event) => updateBookingField('note', event.target.value)} placeholder="如有特殊需求，请告诉我们" rows="3" /></label><label className="booking-privacy"><input type="checkbox" checked={bookingForm.privacy} onChange={(event) => updateBookingField('privacy', event.target.checked)} /><span>我已阅读并同意隐私说明，授权义安游礼用于本次活动预约联系。</span></label>{bookingErrors.privacy && <p className="booking-error">{bookingErrors.privacy}</p>}<button type="submit" className="booking-submit">确认预约 <strong>→</strong></button></form>}</section>}</React.Fragment>)}</div>
              </>
            ) : (
              <div className={`service-scenic-data ${id === 'facilities' ? 'facility-data' : ''} ${id === 'consult' ? 'consult-data' : ''}`}>{scenicService.items.map(([label, value, note]) => <div key={`${label}-${value}`}><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}{id === 'facilities' && <button type="button" className="facility-location" aria-label={`导航到${label}`} onClick={() => openFacilityNavigation(label, value)}>⌖</button>}{id === 'consult' && <a className="consult-call" href={`tel:${value.replace(/[^\d]/g, '')}`}>一键拨打</a>}</div>)}</div>
            )}
          </section>
        )}
        {kind !== 'service' && <button type="button" className="detail-primary" onClick={handlePrimaryAction}>{detail.action} <strong>{kind === 'culture' ? (bookingOpen ? '−' : '+') : '→'}</strong></button>}
        {kind === 'culture' && bookingOpen && (
          <section className="booking-panel" aria-labelledby="booking-title">
            <div className="booking-heading"><span>活动预约</span><h2 id="booking-title">留一个名额给你</h2><p>填写信息后，我们会为本次体验生成预约编号。</p></div>
            {bookingNumber ? (
              <div className="booking-success" role="status"><span>预约已确认</span><strong>{bookingNumber}</strong><p>请凭预约编号与手机号到活动签到处核验。</p><div className="booking-success-actions"><Link to="/profile/bookings">查看我的预约</Link><button type="button" onClick={() => setBookingOpen(false)}>返回活动详情</button></div></div>
            ) : (
              <form className="booking-form" onSubmit={submitBooking} noValidate>
                <label>姓名<input value={bookingForm.name} onChange={(event) => updateBookingField('name', event.target.value)} placeholder="请输入真实姓名" />{bookingErrors.name && <small>{bookingErrors.name}</small>}</label>
                <label>手机号<input type="tel" inputMode="numeric" value={bookingForm.phone} onChange={(event) => updateBookingField('phone', event.target.value)} placeholder="用于接收预约信息" />{bookingErrors.phone && <small>{bookingErrors.phone}</small>}</label>
                <div className="booking-form-row"><label>人数<input type="number" min="1" max="20" value={bookingForm.count} onChange={(event) => updateBookingField('count', event.target.value)} />{bookingErrors.count && <small>{bookingErrors.count}</small>}</label><label>参与人类型<select value={bookingForm.participantType} onChange={(event) => updateBookingField('participantType', event.target.value)}><option>成人</option><option>儿童</option><option>亲子家庭</option><option>老年人</option></select></label></div>
                <label>备注<textarea value={bookingForm.note} onChange={(event) => updateBookingField('note', event.target.value)} placeholder="如有特殊需求，请告诉我们" rows="3" /></label>
                <label className="booking-privacy"><input type="checkbox" checked={bookingForm.privacy} onChange={(event) => updateBookingField('privacy', event.target.checked)} /><span>我已阅读并同意隐私说明，授权义安游礼用于本次活动预约联系。</span></label>
                {bookingErrors.privacy && <p className="booking-error">{bookingErrors.privacy}</p>}
                <button type="submit" className="booking-submit">确认预约 <strong>→</strong></button>
              </form>
            )}
          </section>
        )}
      </main>

      {productStory && <section className="product-story-page">
        <section className="product-story-intro">
          <div className="product-section-heading"><h2>一件好物的来处</h2></div>
          <p>{productStory.story}</p>
          <figure><img src={productStory.storyImage} alt={`${detail.title}产地与故事`} /><figcaption>{detail.subtitle}</figcaption></figure>
        </section>

        <section className="product-material-section">
          <img src={productStory.material.image} alt={`${detail.title}选材细节`} />
          <div><div className="product-section-heading light"><span>MATERIAL</span><h2>选材与工艺</h2></div><h3>{productStory.material.title}</h3><p>{productStory.material.text}</p></div>
          <ol>{productStory.craft.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong></li>)}</ol>
        </section>

        <section className="product-spec-section">
          <div className="product-section-heading"><span>DETAILS</span><h2>规格信息</h2></div>
          <dl>{productStory.specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        </section>

        <section className="product-care-section">
          <div className="product-section-heading"><h2>保存与使用</h2></div>
          <ul>{productStory.care.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        <section className="product-scene-section">
          <div className="product-section-heading"><span>IN DAILY LIFE</span><h2>适用场景</h2></div>
          <div className="product-scene-grid">{productStory.scenes.map((scene) => <article key={scene.title}><img src={scene.image} alt={scene.title} /><div><h3>{scene.title}</h3><p>{scene.text}</p></div></article>)}</div>
        </section>
      </section>}

      {attractionStory && <>
        <nav className="scenic-jump-nav" aria-label="景区详情导航">
          <a href="#story">介绍</a><a href="#stay">住宿</a><a href="#food">美食</a><a href="#play">玩法</a><a href="#products">好物</a><a href="#events">活动</a>
        </nav>

        <section className="scenic-story" id="story">
          <div className="scenic-section-heading"><h2>走进这一站</h2></div>
          <p>{attractionStory.lead}</p>
          <figure><img src={detail.image} alt={`${detail.title}风景细节`} /><figcaption>{attractionStory.quote}</figcaption></figure>
        </section>

        <section className="scenic-pair-section" id="stay">
          <div className="scenic-section-heading"><h2>住下来，也尝一口</h2></div>
          <article className="scenic-feature-card"><img src={attractionStory.stay.image} alt={attractionStory.stay.title} /><div><span>住宿推荐</span><h3>{attractionStory.stay.title}</h3><strong>{attractionStory.stay.meta}</strong><p>{attractionStory.stay.text}</p><Link to="/stay">查看住宿 →</Link></div></article>
          <article className="scenic-feature-card reverse" id="food"><img src={attractionStory.food.image} alt={attractionStory.food.title} /><div><span>附近美食</span><h3>{attractionStory.food.title}</h3><strong>{attractionStory.food.meta}</strong><p>{attractionStory.food.text}</p><Link to="/eat">查看美食 →</Link></div></article>
        </section>

        <section className="scenic-route" id="play">
          <div className="scenic-section-heading light"><h2>一条刚好的玩法</h2></div>
          <div className="scenic-route-list">{attractionStory.play.map((item) => <div key={item}><span>{item}</span></div>)}</div>
          <Link to="/play">展开更多主题路线 <strong>→</strong></Link>
        </section>

        <section className="scenic-products" id="products">
          <div className="scenic-section-heading"><h2>把义安带回家</h2></div>
          <div className="scenic-product-grid">{attractionStory.products.map((product) => <Link to={`/shop/${product.id}`} key={product.id}><img src={product.image} alt={product.title} /><span>义安特色产品</span><h3>{product.title}</h3><strong>查看详情 →</strong></Link>)}</div>
        </section>

        <section className="scenic-event-section" id="events">
          <div className="scenic-section-heading"><h2>正在发生</h2></div>
          <Link to={`/culture/${attractionStory.event.id}`} className="scenic-event-card"><img src={attractionStory.event.image} alt={attractionStory.event.title} /><div><span>{attractionStory.event.eyebrow}</span><h3>{attractionStory.event.title}</h3><strong>{attractionStory.event.status} · 查看并预约 →</strong></div></Link>
        </section>

        <section className="scenic-help"><h2>还想知道什么？</h2><p>开放时间、交通停车、便民设施与无障碍信息，都可以继续向义安游礼服务台咨询。</p><div><button type="button" onClick={() => openDialog(`${detail.title}游览咨询`, `已为你整理${detail.title}的开放时间、交通停车与便民设施信息。\n如需人工协助，可拨打游客服务热线 0562—12345。`)}>在线咨询</button><Link to="/services">游览服务</Link></div></section>
      </>}

      {!attractionStory && !productStory && <section className="detail-note"><h2>把这一站，留给自己</h2><p>从风景到风物，从一次体验到一份手信，义安的旅程值得慢一点完成。</p></section>}
    </div>
  );
};

export const AttractionDetail = () => <Detail kind="attraction" />;
export const CultureDetail = () => <Detail kind="culture" />;
export const ServiceDetail = () => <Detail kind="service" />;
export const ProductDetail = () => <Detail kind="product" />;

export default Detail;
