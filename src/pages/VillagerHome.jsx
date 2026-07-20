import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { readVillagerData } from '../data/villagerStorage';
import { travelImages } from '../data/images';
import './VillagerHome.css';

export const villagerFeatures = [
  { slug: 'affairs', title: '村务公开', detail: '通知、公示与村务动态', icon: 'article', eyebrow: '村务' },
  { slug: 'points', title: '积分超市', detail: '查看积分与兑换福利', icon: 'points', eyebrow: '福利' },
  { slug: 'vote', title: '议事投票', detail: '参与村庄事项表决', icon: 'vote', eyebrow: '共建' },
  { slug: 'stall', title: '我的货摊', detail: '发布农品与手作好物', icon: 'stall', eyebrow: '经营' },
  { slug: 'house', title: '农房盘活', detail: '发布或参与农房项目', icon: 'house', eyebrow: '共建' },
  { slug: 'course', title: '课程培训', detail: '在线视频学习，完成得积分', icon: 'course', eyebrow: '成长' },
  { slug: 'subsidy', title: '补贴申领', detail: '查看政策并提交申请', icon: 'subsidy', eyebrow: '惠民' },
  { slug: 'job', title: '就业岗位', detail: '查找岗位并提交申请', icon: 'job', eyebrow: '就业' },
  { slug: 'appeal', title: '民情诉求', detail: '提交问题，跟进办理', icon: 'appeal', eyebrow: '治理' },
  { slug: 'pioneer', title: '先锋案例', detail: '身边榜样与共建故事', icon: 'pioneer', eyebrow: '榜样' }
];

const homeServices = ['affairs', 'subsidy', 'appeal', 'vote', 'points', 'course'];

const VillagerHome = () => {
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

  const pendingVotes = data.votes.filter((item) => !item.voted);
  const pendingStalls = data.stalls.filter((item) => item.status === '待审核').length;
  const pendingHouses = data.houses.filter((item) => item.status === '待审核').length;
  const activeAppeals = data.appeals.filter((item) => ['办理中', '待村民确认'].includes(item.status));
  const availableCourses = data.courses.filter((item) => !data.courseEnrollments.some((entry) => entry.courseId === item.id) && (item.joinedCount || 0) < (item.capacity || 0));
  const latestArticle = data.articles[0];
  const featuredCourse = availableCourses[0] || data.courses[0];
  const frequentServices = villagerFeatures.filter((item) => homeServices.includes(item.slug));

  const tasks = useMemo(() => [
    activeAppeals[0] ? { slug: 'appeal', icon: 'appeal', label: activeAppeals[0].status, title: activeAppeals[0].title, meta: activeAppeals[0].number || '查看办理进度', action: '查看进度' } : null,
    pendingVotes[0] ? { slug: 'vote', icon: 'vote', label: '待参与投票', title: pendingVotes[0].title, meta: `截止 ${pendingVotes[0].deadline || '近期'}，完成可得 10 积分`, action: '去投票' } : null,
    pendingStalls ? { slug: 'stall', icon: 'stall', label: '货摊等待审核', title: `${pendingStalls} 件商品正在审核`, meta: '审核结果会在我的货摊更新', action: '查看货摊' } : null,
    pendingHouses ? { slug: 'house', icon: 'house', label: '农房等待审核', title: `${pendingHouses} 个农房项目正在审核`, meta: '审核通过后将开放合作参与', action: '查看农房' } : null
  ].filter(Boolean).slice(0, 4), [activeAppeals, pendingHouses, pendingStalls, pendingVotes]);

  return <div className="travel-page villager-page villager-home-compact villager-friendly-home">
    <header className="villager-header villager-header-compact villager-friendly-header">
      <div className="villager-friendly-greeting"><span>义安村民服务</span><h1>您好，欢迎回家</h1><p>今天的村务、办事和生活服务都在这里。</p></div>
      <Link className="villager-header-points" to="/villager/points"><small>我的积分</small><strong>{data.points}</strong><em>查看积分明细</em></Link>
    </header>

    <main className="villager-dashboard villager-dashboard-compact villager-friendly-dashboard">
      <section className="villager-task-section villager-friendly-tasks">
        <div className="villager-friendly-title"><div><span>今天要办</span><h2>待办事项</h2></div><b>{tasks.length} 项</b></div>
        <div className="villager-task-list">{tasks.length ? tasks.map((task) => <Link to={`/villager/${task.slug}`} key={`${task.slug}-${task.title}`}><i><Icon name={task.icon} size={25} /></i><div><span>{task.label}</span><strong>{task.title}</strong><p>{task.meta}</p></div><em>{task.action}</em></Link>) : <div className="villager-friendly-empty"><Icon name="success" size={30} /><strong>今天没有待办事项</strong><span>可以查看村务消息或参加村庄活动</span></div>}</div>
      </section>

      <section className="villager-quick-section villager-friendly-services">
        <div className="villager-service-photo"><img src={travelImages.villager.service} alt="村民便民服务" loading="lazy" /><div><span>家门口的便民服务</span><strong>村务办理更清楚、更方便</strong></div></div>
        <div className="villager-friendly-title"><div><span>常用功能</span><h2>我要办理</h2></div><small>点击下方服务即可办理</small></div>
        <div className="villager-quick-grid">{frequentServices.map((item) => <Link to={`/villager/${item.slug}`} key={item.slug}><i><Icon name={item.icon} size={29} /></i><div><strong>{item.title}</strong><span>{item.detail}</span></div><Icon name="arrow" size={20} /></Link>)}</div>
        <div className="villager-friendly-more"><Link to="/villager/module/affairs"><Icon name="affairs" size={23} /><div><strong>更多村务服务</strong><span>政策、公开信息与积分福利</span></div><Icon name="arrow" size={20} /></Link><Link to="/villager/module/build"><Icon name="build" size={23} /><div><strong>更多共建服务</strong><span>农房、货摊、就业与先锋案例</span></div><Icon name="arrow" size={20} /></Link></div>
      </section>

      <section className="villager-home-feed villager-friendly-news">
        <div className="villager-friendly-title"><div><span>村里新鲜事</span><h2>最新消息</h2></div><Link to="/villager/affairs">查看全部</Link></div>
        {latestArticle && <Link className="villager-news-card" to={`/villager/content/affairs/${latestArticle.id}`}><span>{latestArticle.category} · {latestArticle.date}</span><h3>{latestArticle.title}</h3><p>{latestArticle.summary}</p><b>查看详情</b></Link>}
        {featuredCourse && <Link className="villager-course-strip" to="/villager/course"><i><Icon name="course" size={26} /></i><div><span>在线视频课</span><h3>{featuredCourse.title}</h3><p>{featuredCourse.time} · {featuredCourse.location || '线上视频课'} · {featuredCourse.duration || '5课时'}</p></div><strong>开始学习</strong></Link>}
      </section>
    </main>
  </div>;
};

export default VillagerHome;
