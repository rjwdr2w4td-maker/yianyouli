import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { useFeedback } from '../components/Feedback';
import { travelImages } from '../data/images';
import './GovernmentHome.css';

const scenicAreas = [
  { id: 'liqiao', name: '犁桥水镇', town: '西联镇', visitors: 2860, capacity: 72, parking: '128 / 320', status: '运行平稳', image: travelImages.attractions.liqiao, color: 'blue' },
  { id: 'yongquan', name: '永泉小镇', town: '钟鸣镇', visitors: 1940, capacity: 58, parking: '86 / 240', status: '运行平稳', image: travelImages.attractions.yongquan, color: 'green' },
  { id: 'fenghuang', name: '凤凰山', town: '顺安镇', visitors: 1320, capacity: 41, parking: '54 / 180', status: '关注天气', image: travelImages.attractions.fenghuang, color: 'orange' }
];

const monitors = [
  { id: 'liqiao-east', name: '犁桥水镇东入口', area: '犁桥水镇 · 西联镇', type: '客流监控', image: travelImages.attractions.liqiao, status: '在线', signal: '98%' },
  { id: 'liqiao-water', name: '水岸亲水平台', area: '犁桥水镇 · 核心区', type: '重点区域', image: travelImages.culture.heritage, status: '在线', signal: '96%' },
  { id: 'yongquan-parking', name: '永泉小镇停车场', area: '永泉小镇 · 钟鸣镇', type: '停车监控', image: travelImages.attractions.yongquan, status: '在线', signal: '99%' },
  { id: 'fenghuang-north', name: '凤凰山北入口', area: '凤凰山 · 顺安镇', type: '山林监控', image: travelImages.attractions.fenghuang, status: '弱信号', signal: '72%' },
  { id: 'village-road', name: '犁桥村沿河道路', area: '犁桥村 · 村务治理', type: '村域监控', image: travelImages.villager.build, status: '在线', signal: '94%' }
];

const alerts = [
  { id: 'a1', type: '溺水预警', label: '高风险', time: '10:42', location: '犁桥水镇 · 亲水平台', detail: '检测到人员长时间停留在警戒线附近', level: 'danger', image: travelImages.culture.heritage },
  { id: 'a2', type: '异常聚集', label: '需关注', time: '10:28', location: '犁桥水镇 · 东入口', detail: '入口区域客流密度连续 8 分钟上升', level: 'warning', image: travelImages.attractions.liqiao },
  { id: 'a3', type: '危险行为', label: '已派单', time: '09:56', location: '凤凰山 · 北侧步道', detail: '识别到游客越过步道安全边界', level: 'warning', image: travelImages.attractions.fenghuang },
  { id: 'a4', type: '车辆异常', label: '已确认', time: '09:21', location: '永泉小镇 · 西停车场', detail: '车辆逆向驶入，现场人员已处理', level: 'normal', image: travelImages.attractions.yongquan }
];

const villageData = [
  { name: '西联镇', villages: 12, population: '3.86万', elderly: '18.4%', income: '2.78万', visitors: '8.6万', trend: '+12.8%' },
  { name: '钟鸣镇', villages: 14, population: '4.12万', elderly: '21.1%', income: '2.64万', visitors: '12.4万', trend: '+18.2%' },
  { name: '顺安镇', villages: 16, population: '5.08万', elderly: '19.7%', income: '2.51万', visitors: '10.8万', trend: '+9.6%' },
  { name: '东联镇', villages: 11, population: '3.25万', elderly: '22.3%', income: '2.32万', visitors: '4.9万', trend: '+6.4%' }
];

const workItems = [
  { title: '民情诉求待处置', count: '06', detail: '其中 2 条超过 24 小时未响应', icon: 'appeal', tone: 'danger', path: '/villager/appeal' },
  { title: '货摊商品待审核', count: '09', detail: '新增农品与手作商品', icon: 'stall', tone: 'gold', path: '/villager/stall' },
  { title: '农房项目待审核', count: '03', detail: '涉及 2 个村、约 560㎡', icon: 'house', tone: 'blue', path: '/villager/house' },
  { title: '课程学习数据', count: '128', detail: '本周新增学习人次', icon: 'course', tone: 'green', path: '/villager/course' }
];

const GovernmentHome = ({ initialSection = 'overview' }) => {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [selectedScenic, setSelectedScenic] = useState(scenicAreas[0]);
  const [selectedMonitor, setSelectedMonitor] = useState(monitors[0]);
  const [alertState, setAlertState] = useState(alerts);
  const [monitorKeyword, setMonitorKeyword] = useState('');
  const [monitorArea, setMonitorArea] = useState('全部');
  const [monitorType, setMonitorType] = useState('全部');
  const [monitorStatus, setMonitorStatus] = useState('全部');
  const [monitorPage, setMonitorPage] = useState(1);
  const [villageKeyword, setVillageKeyword] = useState('');
  const [villageSort, setVillageSort] = useState('name');
  const [villagePage, setVillagePage] = useState(1);
  const { notify, openDialog } = useFeedback();

  const monitorAreas = useMemo(() => ['全部', ...new Set(monitors.map((item) => item.area.split(' · ')[0]))], []);
  const monitorTypes = useMemo(() => ['全部', ...new Set(monitors.map((item) => item.type))], []);
  const monitorStatuses = ['全部', '在线', '弱信号', '离线'];
  const filteredMonitors = useMemo(() => {
    const keyword = monitorKeyword.trim().toLowerCase();
    return monitors
      .filter((item) => !keyword || `${item.name} ${item.area} ${item.type}`.toLowerCase().includes(keyword))
      .filter((item) => monitorArea === '全部' || item.area.startsWith(monitorArea))
      .filter((item) => monitorType === '全部' || item.type === monitorType)
      .filter((item) => monitorStatus === '全部' || item.status === monitorStatus)
      .sort((a, b) => (b.status === '弱信号' ? 1 : 0) - (a.status === '弱信号' ? 1 : 0));
  }, [monitorArea, monitorKeyword, monitorStatus, monitorType]);
  const visibleMonitors = filteredMonitors.slice(0, monitorPage * 8);

  const filteredVillages = useMemo(() => {
    const keyword = villageKeyword.trim().toLowerCase();
    return villageData
      .filter((item) => !keyword || item.name.toLowerCase().includes(keyword))
      .sort((a, b) => {
        if (villageSort === 'population') return Number.parseFloat(b.population) - Number.parseFloat(a.population);
        if (villageSort === 'visitors') return Number.parseFloat(b.visitors) - Number.parseFloat(a.visitors);
        if (villageSort === 'income') return Number.parseFloat(b.income) - Number.parseFloat(a.income);
        return a.name.localeCompare(b.name, 'zh-CN');
      });
  }, [villageKeyword, villageSort]);
  const visibleVillages = filteredVillages.slice(0, villagePage * 6);

  const selectedAlerts = useMemo(() => alertState.filter((item) => item.level !== 'normal'), [alertState]);

  const handleAlert = (id) => {
    const target = alertState.find((item) => item.id === id);
    if (!target || target.level === 'normal') return;

    setAlertState((current) => current.map((item) => item.id === id ? { ...item, label: '已处置', level: 'normal' } : item));
    notify('预警已标记为已处置');
  };

  const sections = [
    ['overview', '总览', '数据态势'],
    ['monitoring', '监控', `${monitors.length} 点位`],
    ['villages', '镇村', '基础数据'],
    ['work', '协同', `${workItems.length} 类待办`]
  ];

  return (
    <div className="government-page travel-page">
      <header className="gov-header">
        <div className="gov-brand"><span>义安区 · 数字文旅治理平台</span><strong>政务驾驶舱</strong></div>
        <Link to="/profile" className="gov-account"><Icon name="profile" size={17} />政务人员</Link>
      </header>

      <nav className="gov-tabs" aria-label="政务功能导航">
        {sections.map(([id, label, detail]) => <button key={id} type="button" className={activeSection === id ? 'active' : ''} onClick={() => setActiveSection(id)}><strong>{label}</strong><small>{detail}</small></button>)}
      </nav>

      <main className="gov-content">
        {activeSection === 'overview' && <>
          <section className="gov-hero-card">
            <div><span>全区运行态势 · 07.21 周二</span><h1>今天，义安运行平稳</h1><p>景区、村域与公共服务数据已接入，重点事项需要持续关注。</p></div>
            <div className="gov-hero-ring"><strong>86</strong><span>综合运行指数</span></div>
          </section>

          <section className="gov-kpi-grid">
            <article><span>全区实时游客</span><strong>6,120</strong><em>▲ 14.8%</em><small>较昨日同期</small></article>
            <article><span>景区停车余位</span><strong>268</strong><em>▲ 32</em><small>总车位 740</small></article>
            <article><span>在线监控点位</span><strong>42 <i>/ 45</i></strong><em>93.3%</em><small>3 个弱信号</small></article>
            <article><span>待协同事项</span><strong>18</strong><em className="negative">3 高优</em><small>民情、审核、调度</small></article>
          </section>

          <section className="gov-section">
            <div className="gov-section-title"><div><span>SCENIC OPERATIONS</span><h2>景区运行态势</h2></div><button type="button" onClick={() => setActiveSection('monitoring')}>查看监控 →</button></div>
            <div className="gov-scenic-switcher">{scenicAreas.map((area) => <button key={area.id} type="button" className={selectedScenic.id === area.id ? 'active' : ''} onClick={() => setSelectedScenic(area)}><img src={area.image} alt="" /><span>{area.name}</span><small>{area.town}</small></button>)}</div>
            <div className="gov-scenic-detail">
              <div className="gov-scenic-image"><img src={selectedScenic.image} alt={selectedScenic.name} /><span className="gov-image-tag"><i />实时画面</span><b>{selectedScenic.status}</b></div>
              <div className="gov-scenic-stats"><div><small>实时客流</small><strong>{selectedScenic.visitors.toLocaleString()}</strong><span>人</span></div><div><small>客流承载</small><strong>{selectedScenic.capacity}</strong><span>%</span></div><div><small>停车余位</small><strong>{selectedScenic.parking.split(' / ')[0]}</strong><span>/ {selectedScenic.parking.split(' / ')[1]}</span></div></div>
            </div>
          </section>

          <section className="gov-section gov-alert-section">
            <div className="gov-section-title"><div><span>AI ALERT CENTER</span><h2>重点预警</h2></div><strong className="gov-alert-count">{selectedAlerts.length} 条未处置</strong></div>
            <div className="gov-alert-list">{alertState.slice(0, 3).map((item) => <article className={`gov-alert-item ${item.level}`} key={item.id}><img src={item.image} alt="" /><div><div className="gov-alert-meta"><b>{item.type}</b><time>{item.time}</time></div><strong>{item.location}</strong><p>{item.detail}</p></div>{item.level !== 'normal' ? <button type="button" onClick={() => handleAlert(item.id)}>处置</button> : <span className="gov-done">已确认</span>}</article>)}</div>
          </section>
        </>}

        {activeSection === 'monitoring' && <section className="gov-section gov-monitor-page">
          <div className="gov-section-title"><div><span>VIDEO SURVEILLANCE NETWORK</span><h2>全域监控中心</h2></div><span className="gov-online-label"><i />{monitors.filter((item) => item.status === '在线').length} 点位在线</span></div>
          <div className="gov-data-toolbar">
            <label className="gov-search-input"><Icon name="explore" size={15} /><input value={monitorKeyword} onChange={(event) => { setMonitorKeyword(event.target.value); setMonitorPage(1); }} placeholder="搜索点位、区域或监控类型" /></label>
            <div className="gov-filter-group"><span>区域</span><div className="gov-filter-scroll">{monitorAreas.map((area) => <button key={area} type="button" className={monitorArea === area ? 'active' : ''} onClick={() => { setMonitorArea(area); setMonitorPage(1); }}>{area}</button>)}</div></div>
            <div className="gov-filter-group"><span>类型</span><div className="gov-filter-scroll">{monitorTypes.map((type) => <button key={type} type="button" className={monitorType === type ? 'active' : ''} onClick={() => { setMonitorType(type); setMonitorPage(1); }}>{type}</button>)}</div></div>
            <div className="gov-filter-group"><span>状态</span><div className="gov-filter-scroll">{monitorStatuses.map((status) => <button key={status} type="button" className={monitorStatus === status ? 'active' : ''} onClick={() => { setMonitorStatus(status); setMonitorPage(1); }}>{status}</button>)}</div></div>
          </div>
          <div className="gov-result-summary"><span>共找到 <strong>{filteredMonitors.length}</strong> 个点位</span><small>异常与弱信号点位优先展示</small></div>
          <div className="gov-monitor-layout">
            <div className="gov-monitor-preview"><img src={selectedMonitor.image} alt={selectedMonitor.name} /><div className="gov-scan-line" /><span className="gov-image-tag"><i />LIVE · {selectedMonitor.signal}</span><div className="gov-monitor-overlay"><strong>{selectedMonitor.name}</strong><small>{selectedMonitor.area}</small></div></div>
            <div className="gov-monitor-list">{visibleMonitors.map((monitor) => <button key={monitor.id} type="button" className={selectedMonitor.id === monitor.id ? 'active' : ''} onClick={() => setSelectedMonitor(monitor)}><span className="gov-monitor-thumb"><img src={monitor.image} alt="" /><i className={monitor.status !== '在线' ? 'warning' : ''} /></span><div><strong>{monitor.name}</strong><small>{monitor.area} · {monitor.type} · {monitor.signal}</small></div><em className={monitor.status !== '在线' ? 'warning' : ''}>{monitor.status}</em></button>)}</div>
            {!filteredMonitors.length && <div className="gov-empty-result">暂无符合条件的监控点位，请调整筛选条件</div>}
            {visibleMonitors.length < filteredMonitors.length && <button className="gov-load-more" type="button" onClick={() => setMonitorPage((page) => page + 1)}>加载更多（剩余 {filteredMonitors.length - visibleMonitors.length} 个）</button>}
          </div>
          <div className="gov-detection-grid">{[['人', '12', '今日识别'], ['车', '08', '异常车辆'], ['动物', '02', '越界识别'], ['危险行为', '03', '待确认'], ['异常聚集', '04', '已派单'], ['溺水预警', '01', '高风险']].map(([label, count, detail]) => <button type="button" key={label} onClick={() => openDialog(`${label}识别`, `今日系统识别 ${count} 条${label}相关记录，${detail}。`)}><span>{label}</span><strong>{count}</strong><small>{detail}</small></button>)}</div>
        </section>}

        {activeSection === 'villages' && <section className="gov-section gov-village-page">
          <div className="gov-section-title"><div><span>TOWN & VILLAGE PROFILE</span><h2>镇村基础数据</h2></div><button type="button" onClick={() => notify('数据简报已生成，可在下载中心查看')}>生成简报 ↓</button></div>
          <div className="gov-village-summary"><div><span>纳入统计镇</span><strong>4</strong></div><div><span>行政村</span><strong>53</strong></div><div><span>常住人口</span><strong>16.31万</strong></div><div><span>本月游客</span><strong>36.7万</strong></div></div>
          <div className="gov-data-toolbar gov-village-toolbar">
            <label className="gov-search-input"><Icon name="explore" size={15} /><input value={villageKeyword} onChange={(event) => { setVillageKeyword(event.target.value); setVillagePage(1); }} placeholder="搜索镇或行政村名称" /></label>
            <div className="gov-sort-row"><span>排序方式</span><select value={villageSort} onChange={(event) => { setVillageSort(event.target.value); setVillagePage(1); }}><option value="name">按名称</option><option value="population">按人口</option><option value="visitors">按游客量</option><option value="income">按收入</option></select></div>
          </div>
          <div className="gov-result-summary"><span>共找到 <strong>{filteredVillages.length}</strong> 个镇级汇总</span><small>进入详情后按行政村分组查看</small></div>
          <div className="gov-village-table">{visibleVillages.map((village) => <article key={village.name}><div className="gov-village-name"><strong>{village.name}</strong><small>{village.villages} 个行政村 · 点击详情查看分组数据</small></div><dl><div><dt>常住人口</dt><dd>{village.population}</dd></div><div><dt>老年人口</dt><dd>{village.elderly}</dd></div><div><dt>人均收入</dt><dd>{village.income}</dd></div><div><dt>游客量</dt><dd>{village.visitors} <em>{village.trend}</em></dd></div></dl><button type="button" onClick={() => openDialog(`${village.name}数据详情`, `已打开${village.name}人口、收入、游客和村域治理明细，并按行政村分组展示。`)}>详情 →</button></article>)}</div>
          {!filteredVillages.length && <div className="gov-empty-result">暂无符合条件的镇村，请更换搜索词</div>}
          {visibleVillages.length < filteredVillages.length && <button className="gov-load-more" type="button" onClick={() => setVillagePage((page) => page + 1)}>加载更多（剩余 {filteredVillages.length - visibleVillages.length} 个）</button>}
          <div className="gov-age-chart"><div><span>人口年龄结构</span><strong>全区常住人口</strong></div><div className="gov-age-bars"><i style={{ '--value': '18%' }}><b>0—17岁</b><em>18%</em></i><i style={{ '--value': '62%' }}><b>18—59岁</b><em>62%</em></i><i style={{ '--value': '20%' }}><b>60岁以上</b><em>20%</em></i></div></div>
        </section>}

        {activeSection === 'work' && <section className="gov-section gov-work-page">
          <div className="gov-section-title"><div><span>COLLABORATION DESK</span><h2>政务协同事项</h2></div><span className="gov-date-label">今日待办 18 项</span></div>
          <div className="gov-work-banner"><div><span>村民端与游客端业务协同</span><h3>把每一条诉求、每一次预约都闭环</h3><p>审核、派单、核销、回访和数据复盘统一在政务端完成。</p></div><Icon name="build" size={42} /></div>
          <div className="gov-work-list">{workItems.map((item) => <Link to={item.path} className={`gov-work-item ${item.tone}`} key={item.title}><span className="gov-work-icon"><Icon name={item.icon} size={22} /></span><div><strong>{item.title}</strong><p>{item.detail}</p></div><b>{item.count}</b><Icon name="arrow" size={16} /></Link>)}</div>
          <div className="gov-quick-actions"><span>常用操作</span><div><button type="button" onClick={() => notify('已进入景区开放状态管理')}>景区开放管理</button><button type="button" onClick={() => notify('已进入预约核销台账')}>预约核销台账</button><button type="button" onClick={() => notify('已进入积分商品审核')}>积分商品审核</button><button type="button" onClick={() => notify('已进入政策发布中心')}>发布政策公告</button></div></div>
        </section>}
      </main>
    </div>
  );
};

export default GovernmentHome;
