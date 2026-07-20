const storageKey = 'yianVillagerData';

const defaults = {
  points: 320,
  pointLogs: [
    { id: 'log-initial', title: '初始积分', amount: 320, source: '系统', createdAt: '2026-07-01T08:00:00.000Z' }
  ],
  redemptions: [],
  houseApplications: [],
  subsidyApplications: [],
  jobApplications: [],
  courseEnrollments: [],
  articles: [
    { id: 'a1', title: '犁桥村夏季人居环境整治安排', category: '村务公开', publisher: '犁桥村村委会', date: '07-16', summary: '本周集中开展沟渠清理、庭院整理和公共区域巡查。', content: '本周五起，村内将分片开展沟渠清理、庭院整理和公共区域巡查。请各户做好门前环境维护，志愿服务队将在上午八点于村民广场集合。' },
    { id: 'a2', title: '村集体经济项目季度收益公示', category: '财务公示', publisher: '村集体经济合作社', date: '07-12', summary: '农文旅合作项目第二季度经营情况面向全体村民公开。', content: '第二季度农文旅合作项目经营收入与公益支出已完成核算，明细同步在村务公开栏展示，村民可在工作日到村民服务站查阅。' },
    { id: 'a3', title: '防汛值守与重点区域巡查通知', category: '通知公告', publisher: '村应急工作组', date: '07-08', summary: '请各网格村民关注天气变化，发现险情及时上报。', content: '近期降雨较为集中，各网格将加强沿河、低洼地带和老旧房屋巡查。发现积水、滑坡或房屋安全隐患，请第一时间联系网格员。' }
  ],
  goods: [
    { id: 'g1', name: '义安白姜礼盒', points: 120, stock: 18, pickup: '犁桥村民服务站', imageKey: 'pointsGinger' },
    { id: 'g2', name: '村口咖啡兑换券', points: 80, stock: 30, pickup: '犁桥村民服务站', imageKey: 'pointsCoffee' },
    { id: 'g3', name: '农耕体验家庭票', points: 160, stock: 12, pickup: '西联镇便民服务中心', imageKey: 'pointsFarm' }
  ],
  votes: [
    { id: 'v1', title: '村口闲置空地改造方案', description: '结合村民日常使用和后续运营成本，从三个方案中选择一项。', publisher: '犁桥村村委会', deadline: '07月25日 18:00', options: ['乡村会客厅', '儿童自然乐园', '共享菜园'], counts: [36, 28, 19], voted: false, selected: '' },
    { id: 'v2', title: '夏季村晚主题征集', description: '得票最高的主题将作为本年度夏季村晚主方案。', publisher: '村文化活动中心', deadline: '07月28日 18:00', options: ['稻田音乐会', '非遗游园会', '邻里美食节'], counts: [42, 31, 25], voted: false, selected: '' }
  ],
  stalls: [
    { id: 'stall-demo', name: '村民现挖铜陵白姜', price: '26', unit: '斤', category: '村民农产', stock: 40, origin: '犁桥村', description: '当天采挖，脆嫩少渣，适合腌制与鲜食。', contact: '13800000000', imageKey: 'stallGinger', status: '已上架', owner: '村民发布', auditNote: '信息完整，已通过审核', createdAt: '2026-07-12T09:00:00.000Z' }
  ],
  houses: [
    { id: 'h1', title: '临水老宅合作运营', type: '参与', status: '招募中', detail: '计划改造为乡村书屋与茶空间，保留徽派院落格局，引入阅读、茶饮和乡土文化活动。', location: '犁桥村沿河组', area: '约180㎡', cooperation: '联合运营', imageKey: 'houseCourtyard', highlights: ['临水院落', '徽派老宅', '可联合运营'], contact: '村集体项目专员' }
  ],
  courses: [
    { id: 'c1', title: '短视频拍摄与乡村账号运营', time: '随到随学', location: '线上视频课', teacher: '义安融媒讲师', duration: '6课时', format: '线上视频', imageKey: 'courseVideoCover', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', capacity: 300, joinedCount: 18, points: 20 },
    { id: 'c2', title: '农产品包装与电商上架', time: '随到随学', location: '线上视频课', teacher: '周小梅', duration: '5课时', format: '线上视频', imageKey: 'courseVideoCover', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', capacity: 300, joinedCount: 16, points: 15 }
  ],
  subsidies: [
    { id: 's1', title: '特色种养业奖补', deadline: '08月15日', audience: '从事白姜、稻虾等特色种养的本村经营主体', materials: '身份证、经营证明、种养规模说明', amount: '最高补助 5000 元', status: '可申请' },
    { id: 's2', title: '返乡创业一次性补贴', deadline: '09月30日', audience: '返乡两年内创办经营实体并正常经营的村民', materials: '身份证、营业执照、经营场地证明', amount: '一次性补贴 3000 元', status: '可申请' }
  ],
  jobs: [
    { id: 'j1', title: '犁桥水镇活动协管员', company: '义安乡旅运营中心', salary: '120元/天', location: '犁桥水镇', headcount: 6, requirement: '沟通耐心，可参与周末及节庆活动', duty: '游客引导、秩序维护和活动物料协助' },
    { id: 'j2', title: '农产品直播助理', company: '村集体电商服务站', salary: '3500-4500元/月', location: '犁桥村电商服务站', headcount: 2, requirement: '熟悉手机操作，有短视频或销售经验优先', duty: '直播场控、商品上架、订单整理和客户答疑' }
  ],
  appeals: [
    { id: 'p1', number: 'MQ2026071001', category: '公共设施', title: '增设沿河步道夜间照明', detail: '希望在沿河步道转角和亲水平台补充照明。', location: '犁桥村沿河步道', contact: '13800000000', status: '待村民确认', rewardClaimed: false, date: '07-10', timeline: [{ time: '07-10', text: '诉求已提交' }, { time: '07-11', text: '村建设组受理并现场核查' }, { time: '07-16', text: '照明设备已完成安装，请确认处理结果' }] }
  ],
  pioneers: [
    { id: 'x1', name: '陈志强', title: '把闲置农房变成村民共享书屋', tag: '共建先锋', content: '陈志强牵头联络房主、村集体与志愿者，把闲置多年的老宅改造成共享书屋，并持续组织亲子阅读与乡土课堂。' },
    { id: 'x2', name: '周小梅', title: '带动 18 户村民开展白姜标准化包装', tag: '产业先锋', content: '周小梅组织村民统一分级、包装和线上销售白姜，帮助 18 户村民提升产品附加值，并建立稳定的复购渠道。' },
    { id: 'x3', name: '汪师傅', title: '十年义务维护村道与古树', tag: '文明先锋', content: '汪师傅长期参与村道巡查、古树养护和邻里互助，用十年坚持守护村庄公共环境。' }
  ]
};

const cloneDefaults = () => JSON.parse(JSON.stringify(defaults));

const enrichSavedData = (saved, initial) => {
  const next = Object.keys(initial).reduce((result, key) => ({
    ...result,
    [key]: Array.isArray(initial[key])
      ? (Array.isArray(saved[key]) ? saved[key] : initial[key])
      : (saved[key] ?? initial[key])
  }), {});
  next.courses = next.courses.map(({ joined, ...course }) => ({
    ...course,
    capacity: course.capacity ?? 300,
    joinedCount: course.joinedCount ?? (joined ? 1 : 0),
    time: course.time || '随到随学',
    location: '线上视频课',
    teacher: course.teacher || '乡村课堂讲师',
    duration: course.duration || '5课时',
    format: '线上视频',
    imageKey: course.imageKey || 'courseVideoCover',
    videoUrl: course.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'
  }));
  next.goods = next.goods.map((item, index) => ({ ...item, imageKey: item.imageKey || ['pointsGinger', 'pointsCoffee', 'pointsFarm'][index % 3] }));
  next.stalls = next.stalls.map((item) => ({ ...item, imageKey: item.imageKey || 'stallGinger' }));
  next.houses = next.houses.map((item) => ({ ...item, imageKey: item.imageKey || 'houseCourtyard', highlights: item.highlights || [item.cooperation || item.type, item.area || '面积待确认'] }));
  next.appeals = next.appeals.map((item) => ({ ...item, images: item.images || [] }));
  next.subsidies = next.subsidies.map(({ applied, ...item }) => item);
  next.jobs = next.jobs.map(({ applied, ...item }) => item);
  return next;
};

export const readVillagerData = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || '{}');
    return enrichSavedData(saved, cloneDefaults());
  } catch {
    return cloneDefaults();
  }
};

export const saveVillagerData = (data) => {
  window.localStorage.setItem(storageKey, JSON.stringify(data));
  return data;
};

export const updateVillagerData = (updater) => {
  const current = readVillagerData();
  const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
  return saveVillagerData(next);
};

export const createVillagerId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const createPointLog = (title, amount, source) => ({
  id: createVillagerId('point'),
  title,
  amount,
  source,
  createdAt: new Date().toISOString()
});

export const readApprovedStallProducts = () => readVillagerData().stalls
  .filter((item) => item.status === '已上架')
  .map((item) => ({
    id: item.id,
    category: item.category || '村民农产',
    name: item.name,
    price: Number(item.price) || 0,
    unit: item.unit || '件',
    tag: `${item.owner || '村民发布'} · ${item.origin || '义安区'}`,
    description: item.description,
    imageKey: item.imageKey,
    stock: Number(item.stock) || 0,
    villagerPublished: true
  }));
