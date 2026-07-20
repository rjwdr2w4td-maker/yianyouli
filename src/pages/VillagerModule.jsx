import React, { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { readVillagerData } from '../data/villagerStorage';
import { travelImages } from '../data/images';
import './VillagerHome.css';

const moduleConfig = {
  affairs: {
    eyebrow: '村务办理',
    title: '村务服务',
    intro: '公开信息、惠民政策和村民福利集中办理，让每一项村务都看得见、找得到、能跟进。',
    links: [
      { slug: 'affairs', icon: 'article', title: '村务公开', detail: '通知、公示和财务信息' },
      { slug: 'subsidy', icon: 'subsidy', title: '补贴申领', detail: '政策条件与在线申请' },
      { slug: 'points', icon: 'points', title: '积分超市', detail: '积分明细与福利兑换' }
    ]
  },
  build: {
    eyebrow: '村庄建设与参与',
    title: '乡村共建',
    intro: '从议事投票到产业经营、农房合作和民情治理，每位村民都可以参与村庄建设。',
    links: [
      { slug: 'vote', icon: 'vote', title: '议事投票', detail: '参与公共事项决策' },
      { slug: 'appeal', icon: 'appeal', title: '民情诉求', detail: '提交建议并跟进办理' },
      { slug: 'house', icon: 'house', title: '农房盘活', detail: '发布和参与合作项目' },
      { slug: 'stall', icon: 'stall', title: '我的货摊', detail: '发布农产品与手作' },
      { slug: 'course', icon: 'course', title: '课程培训', detail: '学习技能获得积分' },
      { slug: 'job', icon: 'job', title: '就业岗位', detail: '查看岗位在线申请' },
      { slug: 'pioneer', icon: 'pioneer', title: '先锋案例', detail: '学习身边共建经验' }
    ]
  }
};

const VillagerModule = () => {
  const { type } = useParams();
  const config = moduleConfig[type];
  const [data, setData] = useState(readVillagerData);

  React.useEffect(() => {
    const refresh = () => setData(readVillagerData());
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const affairsData = useMemo(() => ({
    pendingSubsidies: data.subsidies.filter((item) => !data.subsidyApplications.some((entry) => entry.subsidyId === item.id)).length,
    redemptions: data.redemptions.filter((item) => item.status === '待领取').length,
    latestArticle: data.articles[0],
    policy: data.subsidies.find((item) => !data.subsidyApplications.some((entry) => entry.subsidyId === item.id)) || data.subsidies[0],
    pointLogs: data.pointLogs.slice(0, 3)
  }), [data]);

  const buildData = useMemo(() => ({
    pendingVotes: data.votes.filter((item) => !item.voted),
    appeals: data.appeals.filter((item) => ['办理中', '待村民确认'].includes(item.status)),
    projects: data.houses.filter((item) => item.status === '招募中'),
    reviewCount: data.stalls.filter((item) => item.status === '待审核').length + data.houses.filter((item) => item.status === '待审核').length,
    course: data.courses.find((item) => !data.courseEnrollments.some((entry) => entry.courseId === item.id)),
    job: data.jobs.find((item) => !data.jobApplications.some((entry) => entry.jobId === item.id)),
    pioneer: data.pioneers[0]
  }), [data]);

  if (!config) return <Navigate to="/home" replace />;

  const renderAffairs = () => <>
    <section className="villager-module-stats">
      <Link to="/villager/subsidy"><span>可申请政策</span><strong>{affairsData.pendingSubsidies}</strong><small>查看申报条件</small></Link>
      <Link to="/villager/points"><span>当前积分</span><strong>{data.points}</strong><small>{affairsData.redemptions} 件待领取</small></Link>
      <Link to="/villager/affairs"><span>公开文章</span><strong>{data.articles.length}</strong><small>通知与公示</small></Link>
    </section>

    <section className="villager-module-block">
      <div className="villager-module-title"><div><span>最新公开</span><h2>村务动态</h2></div><Link to="/villager/affairs">查看全部 <Icon name="arrow" size={15} /></Link></div>
      {affairsData.latestArticle && <Link className="villager-module-feature" to={`/villager/content/affairs/${affairsData.latestArticle.id}`}><div><span>{affairsData.latestArticle.category} · {affairsData.latestArticle.publisher}</span><h3>{affairsData.latestArticle.title}</h3><p>{affairsData.latestArticle.summary}</p></div><time>{affairsData.latestArticle.date}</time></Link>}
      <div className="villager-module-list">{data.articles.slice(1, 3).map((item) => <Link to={`/villager/content/affairs/${item.id}`} key={item.id}><span>{item.category}</span><strong>{item.title}</strong><time>{item.date}</time></Link>)}</div>
    </section>

    {affairsData.policy && <section className="villager-policy-card"><div><span>惠民政策</span><h2>{affairsData.policy.title}</h2><p>{affairsData.policy.audience}</p><dl><div><dt>补贴标准</dt><dd>{affairsData.policy.amount}</dd></div><div><dt>申报截止</dt><dd>{affairsData.policy.deadline}</dd></div></dl></div><Link to="/villager/subsidy">查看条件并申请</Link></section>}

    <section className="villager-module-block">
      <div className="villager-module-title"><div><span>积分账户</span><h2>最近积分记录</h2></div><Link to="/villager/points">进入超市 <Icon name="arrow" size={15} /></Link></div>
      <div className="villager-point-preview">{affairsData.pointLogs.map((item) => <div key={item.id}><span>{item.source}</span><strong>{item.title}</strong><b className={item.amount > 0 ? 'positive' : ''}>{item.amount > 0 ? '+' : ''}{item.amount}</b></div>)}</div>
    </section>
  </>;

  const renderBuild = () => <>
    <section className="villager-module-stats">
      <Link to="/villager/vote"><span>待参与投票</span><strong>{buildData.pendingVotes.length}</strong><small>参与村庄决策</small></Link>
      <Link to="/villager/appeal"><span>办理中诉求</span><strong>{buildData.appeals.length}</strong><small>查看处理进度</small></Link>
      <Link to="/villager/house"><span>招募中项目</span><strong>{buildData.projects.length}</strong><small>{buildData.reviewCount} 项待审核</small></Link>
    </section>

    {buildData.pendingVotes[0] && <section className="villager-build-focus"><span>正在议事</span><h2>{buildData.pendingVotes[0].title}</h2><p>{buildData.pendingVotes[0].description}</p><div><small>{buildData.pendingVotes[0].publisher} · 截止 {buildData.pendingVotes[0].deadline}</small><Link to="/villager/vote">参与投票 +10分</Link></div></section>}

    <section className="villager-module-block">
      <div className="villager-module-title"><div><span>共建项目</span><h2>一起把村庄变得更好</h2></div><Link to="/villager/house">全部项目 <Icon name="arrow" size={15} /></Link></div>
      <div className="villager-project-preview">{data.houses.slice(0, 2).map((item) => <Link to="/villager/house" key={item.id}><span>{item.status} · {item.cooperation || item.type}</span><h3>{item.title}</h3><p>{item.location} · {item.area || '面积待确认'}</p><strong>{item.detail}</strong></Link>)}</div>
    </section>

    <section className="villager-build-pair">
      { buildData.course && <Link to="/villager/course"><Icon name="course" size={24} /><span>在线视频课</span><h3>{buildData.course.title}</h3><p>{buildData.course.time} · {buildData.course.duration || '5课时'} · 完成得 {buildData.course.points} 分</p><strong>开始学习 →</strong></Link>}
      {buildData.job && <Link to="/villager/job"><Icon name="job" size={24} /><span>就业机会</span><h3>{buildData.job.title}</h3><p>{buildData.job.company} · {buildData.job.salary}</p><strong>查看岗位 →</strong></Link>}
    </section>

    {buildData.pioneer && <section className="villager-pioneer-strip"><div><span>{buildData.pioneer.tag}</span><h2>{buildData.pioneer.title}</h2><p>{buildData.pioneer.name}的共建实践，为村庄提供了可以复制的经验。</p></div><Link to={`/villager/content/pioneer/${buildData.pioneer.id}`}>阅读案例</Link></section>}
  </>;

  return <div className={`travel-page villager-page villager-module-page villager-module-page-${type}`}>
    <header className="villager-module-hero"><img className="villager-module-hero-photo" src={type === 'affairs' ? travelImages.villager.affairs : travelImages.villager.build} alt={type === 'affairs' ? '村务服务场景' : '乡村共建场景'} /><div className="villager-module-hero-shade" /><div className="villager-module-hero-copy"><Link to="/home">返回首页</Link><span>{config.eyebrow}</span><h1>{config.title}</h1><p>{config.intro}</p></div></header>
    <main className="villager-module-content">
      <section className="villager-module-services">{config.links.map((item) => <Link to={`/villager/${item.slug}`} key={item.slug}><i><Icon name={item.icon} size={21} /></i><div><strong>{item.title}</strong><span>{item.detail}</span></div><Icon name="arrow" size={16} /></Link>)}</section>
      {type === 'affairs' ? renderAffairs() : renderBuild()}
    </main>
  </div>;
};

export default VillagerModule;
