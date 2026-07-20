import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { useFeedback } from '../components/Feedback';
import { createPointLog, createVillagerId, readVillagerData, updateVillagerData } from '../data/villagerStorage';
import { travelImages } from '../data/images';
import { villagerFeatures } from './VillagerHome';
import './VillagerHome.css';

const getMediaImage = (imageKey) => travelImages.villager[imageKey] || travelImages.villager.service;

const emptyForms = {
  stall: { name: '', price: '', unit: '斤', category: '村民农产', stock: '', origin: '义安区', description: '', contact: '' },
  house: { title: '', location: '', area: '', cooperation: '出租', detail: '', contact: '' },
  appeal: { category: '公共设施', title: '', detail: '', location: '', contact: '' }
};

const VillagerFeature = () => {
  const { slug } = useParams();
  const feature = villagerFeatures.find((item) => item.slug === slug);
  const [data, setData] = useState(readVillagerData);
  const [forms, setForms] = useState(emptyForms);
  const [appealImages, setAppealImages] = useState([]);
  const [view, setView] = useState('list');
  const { notify, openDialog } = useFeedback();

  useEffect(() => {
    setView('list');
  }, [slug]);

  if (!feature) return <Navigate to="/home" replace />;

  const sync = (updater) => {
    const next = updateVillagerData(updater);
    setData(next);
    return next;
  };

  const updateForm = (type, field, value) => setForms((current) => ({ ...current, [type]: { ...current[type], [field]: value } }));

  const selectAppealImages = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 3);
    if (!files.length) return;
    Promise.all(files.map((file) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, src: reader.result });
      reader.readAsDataURL(file);
    }))).then((images) => setAppealImages(images));
  };

  const removeAppealImage = (index) => setAppealImages((current) => current.filter((_, imageIndex) => imageIndex !== index));

  const redeem = (item) => {
    if (data.points < item.points || item.stock < 1) {
      notify('积分不足或商品已兑完');
      return;
    }
    sync((current) => ({
      ...current,
      points: current.points - item.points,
      pointLogs: [createPointLog(`兑换${item.name}`, -item.points, '积分超市'), ...current.pointLogs],
      goods: current.goods.map((good) => good.id === item.id ? { ...good, stock: good.stock - 1 } : good),
      redemptions: [{ id: createVillagerId('redeem'), goodId: item.id, name: item.name, points: item.points, pickup: item.pickup, status: '待领取', createdAt: new Date().toISOString() }, ...current.redemptions]
    }));
    notify(`已兑换${item.name}，请到${item.pickup || '村民服务站'}领取`);
  };

  const vote = (item, option, index) => {
    if (item.voted) return;
    sync((current) => ({
      ...current,
      points: current.points + 10,
      pointLogs: [createPointLog(`参与投票：${item.title}`, 10, '议事投票'), ...current.pointLogs],
      votes: current.votes.map((voteItem) => voteItem.id === item.id ? { ...voteItem, voted: true, selected: option, counts: voteItem.counts.map((count, countIndex) => countIndex === index ? count + 1 : count) } : voteItem)
    }));
    notify('投票成功，积分 +10');
  };

  const publishStall = (event) => {
    event.preventDefault();
    const form = forms.stall;
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!form.name.trim() || !form.price.trim() || !form.stock.trim() || !form.contact.trim()) return notify('请完整填写商品名称、价格、库存和联系电话');
    if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) return notify('价格需大于 0，库存需填写非负整数');
    if (!/^1[3-9]\d{9}$/.test(form.contact.replace(/\D/g, ''))) return notify('请输入正确的联系电话');
    sync((current) => ({ ...current, stalls: [{ ...form, id: createVillagerId('stall'), name: form.name.trim(), price: String(price), stock, description: form.description.trim(), status: '待审核', owner: '村民发布', createdAt: new Date().toISOString() }, ...current.stalls] }));
    setForms((current) => ({ ...current, stall: emptyForms.stall }));
    setView('list');
    notify('商品已发布，等待政务审核后将进入义安好物');
  };

  const publishHouse = (event) => {
    event.preventDefault();
    const form = forms.house;
    if (!form.title.trim() || !form.location.trim() || !form.contact.trim()) return notify('请填写项目名称、位置和联系人电话');
    if (!/^1[3-9]\d{9}$/.test(form.contact.replace(/\D/g, ''))) return notify('请输入正确的联系人电话');
    sync((current) => ({ ...current, houses: [{ ...form, id: createVillagerId('house'), title: form.title.trim(), location: form.location.trim(), detail: form.detail.trim() || '村民发布的农房盘活项目，审核后开放合作参与。', status: '待审核', type: form.cooperation, owner: '村民发布', createdAt: new Date().toISOString() }, ...current.houses] }));
    setForms((current) => ({ ...current, house: emptyForms.house }));
    setView('list');
    notify('农房项目已发布，当前状态：待审核');
  };

  const joinHouse = (item) => {
    if (data.houseApplications.some((entry) => entry.houseId === item.id)) return;
    sync((current) => ({ ...current, houseApplications: [{ id: createVillagerId('house-apply'), houseId: item.id, title: item.title, status: '已提交', createdAt: new Date().toISOString() }, ...current.houseApplications] }));
    notify(`已提交参与${item.title}，项目方会联系你`);
  };

  const joinCourse = (item) => {
    if (data.courseEnrollments.some((entry) => entry.courseId === item.id) || item.joinedCount >= item.capacity) return;
    sync((current) => ({ ...current, courseEnrollments: [{ id: createVillagerId('course'), courseId: item.id, title: item.title, status: '已报名', points: item.points, createdAt: new Date().toISOString() }, ...current.courseEnrollments], courses: current.courses.map((course) => course.id === item.id ? { ...course, joinedCount: course.joinedCount + 1 } : course) }));
    notify('报名成功，课程完成后将发放积分');
  };

  const cancelCourse = (item) => {
    const enrollment = data.courseEnrollments.find((entry) => entry.courseId === item.id);
    if (!enrollment || enrollment.status !== '已报名') return;
    sync((current) => ({
      ...current,
      courseEnrollments: current.courseEnrollments.filter((entry) => entry.id !== enrollment.id),
      courses: current.courses.map((course) => course.id === item.id ? { ...course, joinedCount: Math.max(0, course.joinedCount - 1) } : course)
    }));
    notify('课程报名已取消');
  };

  const submitAppeal = (event) => {
    event.preventDefault();
    const form = forms.appeal;
    if (!form.title.trim() || !form.detail.trim() || !form.contact.trim()) return notify('请填写诉求主题、情况说明和联系电话');
    if (!/^1[3-9]\d{9}$/.test(form.contact.replace(/\D/g, ''))) return notify('请输入正确的联系电话');
    sync((current) => ({ ...current, appeals: [{ ...form, images: appealImages, id: createVillagerId('appeal'), number: `MQ${Date.now().toString().slice(-10)}`, title: form.title.trim(), detail: form.detail.trim(), status: '办理中', rewardClaimed: false, date: '今天', timeline: [{ time: '今天', text: '诉求已提交，等待村务受理' }] }, ...current.appeals] }));
    setForms((current) => ({ ...current, appeal: emptyForms.appeal }));
    setAppealImages([]);
    setView('list');
    notify('诉求已提交，请通过受理编号跟进办理进度');
  };

  const claimAppealReward = (item) => {
    if (item.rewardClaimed || item.status !== '待村民确认') return;
    openDialog('确认问题已解决', '确认后将发放 20 积分；如果问题仍未解决，可以关闭弹窗并继续联系村务工作人员。', '确认并领取', () => {
      sync((current) => ({ ...current, points: current.points + 20, pointLogs: [createPointLog(`确认诉求已解决：${item.title}`, 20, '民情诉求'), ...current.pointLogs], appeals: current.appeals.map((appeal) => appeal.id === item.id ? { ...appeal, rewardClaimed: true, status: '已完成' } : appeal) }));
      notify('问题已确认解决，积分 +20');
    });
  };

  const markRedemptionReceived = (item) => {
    if (item.status !== '待领取') return;
    sync((current) => ({ ...current, redemptions: current.redemptions.map((entry) => entry.id === item.id ? { ...entry, status: '已领取', receivedAt: new Date().toISOString() } : entry) }));
    notify('已确认领取积分商品');
  };

  const withdrawRecord = (collection, id, successMessage) => {
    sync((current) => ({ ...current, [collection]: current[collection].filter((entry) => entry.id !== id) }));
    notify(successMessage);
  };

  const renderFormFields = (type, fields) => fields.map(([field, label, placeholder]) => <label key={field}>{label}{field === 'note' || field === 'detail' ? <textarea value={forms[type][field]} onChange={(event) => updateForm(type, field, event.target.value)} placeholder={placeholder} /> : <input value={forms[type][field]} onChange={(event) => updateForm(type, field, event.target.value)} placeholder={placeholder} />}</label>);

  const renderContent = () => {
    if (slug === 'affairs') return <div className="villager-list">{data.articles.map((item) => <article className="villager-article" key={item.id}><div><span>{item.category} · {item.publisher}</span><time>{item.date}</time></div><h3>{item.title}</h3><p>{item.summary}</p><Link className="villager-detail-link" to={`/villager/content/affairs/${item.id}`}>查看详情 <Icon name="arrow" size={16} /></Link></article>)}</div>;
    if (slug === 'points') return <div className="villager-list"><nav className="villager-segmented"><button type="button" className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>积分商品</button><button type="button" className={view === 'records' ? 'active' : ''} onClick={() => setView('records')}>我的兑换</button><button type="button" className={view === 'logs' ? 'active' : ''} onClick={() => setView('logs')}>积分明细</button></nav>{view === 'list' && <><div className="villager-balance"><span>当前可用积分</span><strong>{data.points}</strong><small>兑换商品后可在“我的兑换”查看领取信息</small></div><section className="villager-section-heading"><h2>可兑换商品</h2><span>{data.goods.length} 件</span></section><div className="villager-product-grid">{data.goods.map((item) => <article className="villager-media-card villager-points-product" key={item.id}><img src={getMediaImage(item.imageKey)} alt={item.name} loading="lazy" /><div><span>领取点：{item.pickup}</span><h3>{item.name}</h3><p><strong>{item.points}</strong> 积分 · 剩余 {item.stock} 件</p><button type="button" onClick={() => redeem(item)}>确认兑换</button></div></article>)}</div></>}{view === 'records' && <div className="villager-records villager-business-records"><h3>我的兑换</h3>{data.redemptions.length ? data.redemptions.map((item) => <article key={item.id}><div><span>{item.status}</span><strong>{item.name}</strong><p>{item.points} 分 · {item.pickup}</p></div>{item.status === '待领取' && <button type="button" onClick={() => markRedemptionReceived(item)}>确认已领取</button>}</article>) : <p className="villager-record-empty">还没有兑换记录</p>}</div>}{view === 'logs' && <div className="villager-records"><h3>积分明细</h3>{data.pointLogs.map((item) => <p key={item.id}>{item.title}<span className={item.amount > 0 ? 'villager-status-success' : ''}>{item.amount > 0 ? '+' : ''}{item.amount}</span></p>)}</div>}</div>;
    if (slug === 'vote') return <div className="villager-list"><nav className="villager-segmented"><button type="button" className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>待参与事项</button><button type="button" className={view === 'records' ? 'active' : ''} onClick={() => setView('records')}>我的投票</button></nav>{view === 'list' && <>{data.votes.filter((item) => !item.voted).length ? data.votes.filter((item) => !item.voted).map((item) => <article className="villager-card villager-vote" key={item.id}><div><span>截止 {item.deadline} · 完成得 10 积分</span><h3>{item.title}</h3><p>{item.description} · 发布单位：{item.publisher}</p></div><div className="villager-options">{item.options.map((option, index) => <button type="button" onClick={() => vote(item, option, index)} key={option}>{option}<small>{item.counts[index]} 票</small></button>)}</div></article>) : <div className="villager-page-empty"><strong>暂无待参与投票</strong><p>已参与的事项可在“我的投票”中查看</p></div>}</>}{view === 'records' && <div className="villager-records villager-business-records"><h3>我的投票记录</h3>{data.votes.filter((item) => item.voted).length ? data.votes.filter((item) => item.voted).map((item) => <article key={item.id}><div><span>已参与</span><strong>{item.title}</strong><p>我的选择：{item.selected}</p></div><b className="villager-status-success">+10 积分</b></article>) : <p className="villager-record-empty">还没有投票记录</p>}</div>}</div>;
    if (slug === 'stall') return <div className="villager-list"><nav className="villager-segmented"><button type="button" className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>我的商品</button><button type="button" className={view === 'create' ? 'active' : ''} onClick={() => setView('create')}>发布商品</button></nav>{view === 'list' && <>{data.stalls.length ? data.stalls.map((item) => <article className="villager-media-card villager-stall-product" key={item.id}><img src={getMediaImage(item.imageKey)} alt={item.name} loading="lazy" /><div><span>{item.owner} · {item.category}</span><h3>{item.name}</h3><p>{item.price}元/{item.unit} · 库存 {item.stock}</p><p>{item.description}</p>{item.auditNote && <small>审核说明：{item.auditNote}</small>}<b className={item.status === '待审核' ? 'villager-status-pending' : 'villager-status-success'}>{item.status}</b></div></article>) : <div className="villager-page-empty"><strong>还没有发布商品</strong><button type="button" onClick={() => setView('create')}>去发布商品</button></div>}</>}{view === 'create' && <form className="villager-form" onSubmit={publishStall}><div className="villager-form-title"><div><span>新商品</span><h3>填写商品资料</h3></div><button type="button" onClick={() => setView('list')}>取消</button></div>{renderFormFields('stall', [['name', '商品名称', '如：现挖白姜'], ['price', '价格', '如：26'], ['stock', '库存', '如：50'], ['origin', '产地', '如：犁桥村'], ['contact', '联系电话', '用于审核和订单联系']])}<label>单位<select value={forms.stall.unit} onChange={(event) => updateForm('stall', 'unit', event.target.value)}><option>斤</option><option>件</option><option>盒</option><option>份</option></select></label>{renderFormFields('stall', [['description', '商品介绍', '介绍口感、规格和售后说明']])}<div className="villager-upload-note">商品发布时将同步使用清晰商品图，方便审核后展示。</div><button type="submit">提交商品审核</button></form>}</div>;
    if (slug === 'house') return <div className="villager-list"><nav className="villager-segmented"><button type="button" className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>合作项目</button><button type="button" className={view === 'records' ? 'active' : ''} onClick={() => setView('records')}>我的业务</button><button type="button" className={view === 'create' ? 'active' : ''} onClick={() => setView('create')}>发布农房</button></nav>{view === 'list' && data.houses.filter((item) => item.owner !== '村民发布' && item.status !== '待审核').map((item) => { const joined = data.houseApplications.some((entry) => entry.houseId === item.id); return <article className="villager-media-card villager-house-project" key={item.id}><img src={getMediaImage(item.imageKey)} alt={item.title} loading="lazy" /><div><span>{item.status} · {item.location} · {item.area}</span><h3>{item.title}</h3><p>{item.cooperation || item.type} · {item.detail}</p><div className="villager-chip-list">{(item.highlights || []).map((highlight) => <em key={highlight}>{highlight}</em>)}</div></div><button type="button" disabled={joined} onClick={() => joinHouse(item)}>{joined ? '已申请参与' : '申请参与'}</button></article>; })}{view === 'records' && <><section className="villager-section-heading"><h2>我发布的农房</h2><span>{data.houses.filter((item) => item.owner === '村民发布').length} 项</span></section>{data.houses.filter((item) => item.owner === '村民发布').length ? data.houses.filter((item) => item.owner === '村民发布').map((item) => <article className="villager-card" key={item.id}><div><span>{item.location} · {item.area || '面积待补充'}</span><h3>{item.title}</h3><p>{item.cooperation || item.type} · {item.detail}</p></div><b className={item.status === '待审核' ? 'villager-status-pending' : 'villager-status-success'}>{item.status}</b></article>) : <div className="villager-page-empty"><strong>还没有发布农房</strong><button type="button" onClick={() => setView('create')}>去发布农房</button></div>}<div className="villager-records villager-business-records"><h3>我的参与申请</h3>{data.houseApplications.length ? data.houseApplications.map((item) => <article key={item.id}><div><span>{item.status}</span><strong>{item.title}</strong><p>提交时间：{new Date(item.createdAt).toLocaleDateString('zh-CN')}</p></div>{item.status === '已提交' && <button type="button" onClick={() => withdrawRecord('houseApplications', item.id, '参与申请已撤回')}>撤回申请</button>}</article>) : <p className="villager-record-empty">还没有参与申请</p>}</div></>}{view === 'create' && <form className="villager-form" onSubmit={publishHouse}><div className="villager-form-title"><div><span>发布项目</span><h3>填写农房资料</h3></div><button type="button" onClick={() => setView('list')}>取消</button></div>{renderFormFields('house', [['title', '项目名称', '如：临水老宅合作运营'], ['location', '所在位置', '村组、道路或地标'], ['area', '建筑面积', '如：约180㎡'], ['contact', '联系人电话', '用于项目沟通'], ['detail', '合作说明', '说明房屋现状、改造想法和期待伙伴']])}<label>合作方式<select value={forms.house.cooperation} onChange={(event) => updateForm('house', 'cooperation', event.target.value)}><option>出租</option><option>改造合作</option><option>联合运营</option></select></label><button type="submit">提交项目审核</button></form>}</div>;
    if (slug === 'course') return <div className="villager-list"><nav className="villager-segmented"><button type="button" className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>在线视频课</button><button type="button" className={view === 'records' ? 'active' : ''} onClick={() => setView('records')}>我的课程</button></nav>{view === 'list' && <>{data.courses.filter((item) => !data.courseEnrollments.some((entry) => entry.courseId === item.id)).length ? data.courses.filter((item) => !data.courseEnrollments.some((entry) => entry.courseId === item.id)).map((item) => <article className="villager-video-card" key={item.id}><div className="villager-video-cover"><img src={getMediaImage(item.imageKey)} alt={item.title} loading="lazy" /><span>▶</span><em>{item.format} · {item.duration}</em></div><div><span>{item.time} · {item.location}</span><h3>{item.title}</h3><p>{item.teacher} · 完成后得 {item.points} 分</p><button type="button" onClick={() => joinCourse(item)}>加入学习</button></div></article>) : <div className="villager-page-empty"><strong>暂无其他视频课程</strong><p>已加入的课程可在“我的课程”中观看</p></div>}</>}{view === 'records' && <div className="villager-records villager-business-records"><h3>我的视频课程</h3>{data.courseEnrollments.length ? data.courseEnrollments.map((enrollment) => { const item = data.courses.find((course) => course.id === enrollment.courseId); return <article className="villager-enrolled-course" key={enrollment.id}><div><span>{enrollment.status} · 在线学习</span><strong>{enrollment.title}</strong>{item && <video controls preload="metadata" poster={getMediaImage(item.imageKey)} src={item.videoUrl}>当前浏览器不支持视频播放。</video>}<p>{item ? `${item.teacher} · ${item.duration}` : `报名时间：${new Date(enrollment.createdAt).toLocaleDateString('zh-CN')}`}</p></div>{enrollment.status === '已完成' ? <b className="villager-status-success">+{enrollment.points} 积分</b> : item && <button type="button" onClick={() => cancelCourse(item)}>移出课程</button>}</article>; }) : <p className="villager-record-empty">还没有加入视频课程</p>}</div>}</div>;
    if (slug === 'subsidy') return <div className="villager-list"><section className="villager-section-heading"><h2>可申请政策</h2><span>{data.subsidies.length} 项</span></section>{data.subsidies.map((item) => { const application = data.subsidyApplications.find((entry) => entry.subsidyId === item.id); return <article className="villager-card villager-card-stacked" key={item.id}><div><span>申报截止 {item.deadline}</span><h3>{item.title}</h3><p>{item.amount} · {item.audience}</p></div>{application ? <div className="villager-application-summary"><b className="villager-status-success">{application.status}</b><p>已提交申请，点击查看申请详情</p><Link className="villager-detail-link" to={`/villager/service/subsidy/${item.id}`}>查看申请</Link></div> : <Link className="villager-primary-link" to={`/villager/service/subsidy/${item.id}`}>查看政策并申请 <Icon name="arrow" size={17} /></Link>}</article>; })}</div>;
    if (slug === 'job') return <div className="villager-list"><section className="villager-section-heading"><h2>当前岗位</h2><span>{data.jobs.length} 个</span></section>{data.jobs.map((item) => { const application = data.jobApplications.find((entry) => entry.jobId === item.id); return <article className="villager-card villager-card-stacked" key={item.id}><div><span>{item.company} · {item.location} · 招聘 {item.headcount} 人</span><h3>{item.title}</h3><p>{item.salary} · {item.duty}</p></div>{application ? <div className="villager-application-summary"><b className="villager-status-success">{application.status}</b><p>已投递申请，点击查看申请详情</p><Link className="villager-detail-link" to={`/villager/service/job/${item.id}`}>查看申请</Link></div> : <Link className="villager-primary-link" to={`/villager/service/job/${item.id}`}>查看岗位并申请 <Icon name="arrow" size={17} /></Link>}</article>; })}</div>;
    if (slug === 'appeal') return <div className="villager-list"><nav className="villager-segmented"><button type="button" className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>我的诉求</button><button type="button" className={view === 'create' ? 'active' : ''} onClick={() => setView('create')}>提交诉求</button></nav>{view === 'list' && <>{data.appeals.length ? data.appeals.map((item) => <article className="villager-card villager-card-stacked" key={item.id}><div><span>{item.number} · {item.date} · {item.status}</span><h3>{item.title}</h3><p>{item.detail}</p>{item.images?.length > 0 && <div className="villager-appeal-gallery">{item.images.map((image, index) => <img key={`${item.id}-${index}`} src={image.src} alt={`诉求现场图片${index + 1}`} />)}</div>}<details className="villager-progress-details"><summary>查看办理进度</summary><div className="villager-timeline">{(item.timeline || []).map((step) => <p key={`${item.id}-${step.time}-${step.text}`}><b>{step.time}</b>{step.text}</p>)}</div></details></div>{item.status === '待村民确认' && <button type="button" disabled={item.rewardClaimed} onClick={() => claimAppealReward(item)}>{item.rewardClaimed ? '已领取' : '确认问题已解决'}</button>}</article>) : <div className="villager-page-empty"><strong>还没有提交诉求</strong><button type="button" onClick={() => setView('create')}>提交一条诉求</button></div>}</>}{view === 'create' && <form className="villager-form" onSubmit={submitAppeal}><div className="villager-form-title"><div><span>问题反馈</span><h3>提交民情诉求</h3></div><button type="button" onClick={() => setView('list')}>取消</button></div><label>诉求分类<select value={forms.appeal.category} onChange={(event) => updateForm('appeal', 'category', event.target.value)}><option>公共设施</option><option>环境治理</option><option>村务建议</option><option>邻里协商</option></select></label>{renderFormFields('appeal', [['title', '诉求主题', '一句话说明问题'], ['detail', '情况说明', '请描述具体情况和希望解决的结果'], ['location', '发生地点', '村组、道路或地标'], ['contact', '联系电话', '用于工作人员回访']])}<label className="villager-image-upload">现场图片（最多3张）<input type="file" accept="image/*" multiple onChange={selectAppealImages} /><span>拍照或从相册选择，图片将随诉求一起提交</span></label>{appealImages.length > 0 && <div className="villager-upload-preview">{appealImages.map((image, index) => <figure key={`${image.name}-${index}`}><img src={image.src} alt={image.name} /><button type="button" onClick={() => removeAppealImage(index)}>删除</button></figure>)}</div>}<button type="submit">确认提交诉求</button></form>}</div>;
    return <div className="villager-list">{data.pioneers.map((item) => <article className="villager-article" key={item.id}><span>{item.tag}</span><h3>{item.title}</h3><p>先锋人物：{item.name}</p><Link className="villager-detail-link" to={`/villager/content/pioneer/${item.id}`}>阅读案例 <Icon name="arrow" size={16} /></Link></article>)}</div>;
  };

  const featureGroup = ['affairs', 'points', 'subsidy'].includes(slug) ? 'affairs' : 'build';
  const returnLabel = featureGroup === 'affairs' ? '返回村务服务' : '返回乡村共建';

  return <div className="travel-page villager-page villager-feature-page villager-friendly-feature"><header className="villager-feature-header"><img className="villager-feature-header-photo" src={featureGroup === 'affairs' ? travelImages.villager.affairs : travelImages.villager.build} alt="" /><div className="villager-feature-header-shade" /><section className="villager-feature-header-copy"><Link to={`/villager/module/${featureGroup}`}>← {returnLabel}</Link><h1>{feature.title}</h1><p>{feature.detail}</p></section></header><main className="villager-feature-content">{renderContent()}</main></div>;
};

export default VillagerFeature;
