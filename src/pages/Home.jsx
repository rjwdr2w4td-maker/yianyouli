import React from 'react';
import { Link } from 'react-router-dom';
import { useRole } from '../components/RoleContext';
import Icon from '../components/Icon';
import { useFeedback } from '../components/Feedback';
import '../styles/Home.css';
import { travelImages } from '../data/images';
import VillagerHome from './VillagerHome';

const Home = () => {
  const { activeRole } = useRole();
  const { openDialog } = useFeedback();

  if (activeRole === 'villager') return <VillagerHome />;

  const attractions = [
    { id: 'liqiao', name: '犁桥水镇', label: '今夜推荐', detail: '灯影水巷 · 非遗演艺', image: travelImages.attractions.liqiao },
    { id: 'yongquan', name: '永泉小镇', label: '山居度假', detail: '江南味道 · 温泉山林', image: travelImages.attractions.yongquan },
    { id: 'fenghuang', name: '凤凰山', label: '花海铜史', detail: '凤丹花事 · 山野步道', image: travelImages.attractions.fenghuang }
  ];

  const services = [
    { name: '门票预约', path: '/services/ticket', icon: 'ticket' },
    { name: '交通接驳', path: '/services/traffic', icon: 'traffic' },
    { name: '停车余位', path: '/services/parking', icon: 'parking' },
    { name: '便民设施', path: '/services/facilities', icon: 'facilities' },
    { name: '义安好物', path: '/shop', icon: 'shop' },
    { name: '我的行程', path: '/profile', icon: 'profile' }
  ];

  return (
    <div className="travel-page home-page portal-home">
      <header className="home-header">
        <div className="home-brand">
          <div><span>安徽 · 铜陵</span><strong>义安游礼</strong></div>
        </div>
      </header>

      <main>
        <section className="home-hero">
          <img src={travelImages.homeCover} alt="义安区犁桥水镇实景" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
          <div className="home-hero-shade"></div>
          <div className="home-hero-copy">
            <h1>今天，<br />从义安出发</h1>
            <p>看景区开放，约在地体验，随时找到旅途服务。</p>
          </div>
        </section>

        <section className="home-today" aria-labelledby="today-title">
          <div className="home-section-heading compact">
            <div><h2 id="today-title">今日出行</h2></div>
            <button type="button" onClick={() => openDialog('今日出行提示', '午后可能有短时阵雨，建议随身携带雨具。犁桥水镇夜游与主要景区目前正常开放。')}>出行提示 →</button>
          </div>
          <div className="home-today-board">
            <div className="today-temperature"><span>多云</span><strong>29<sup>°</sup></strong><p>体感 31° · 东南风 2 级</p></div>
            <div className="today-status">
              <span className="status-line"><i></i>主要景区正常开放</span>
              <strong>08:30—21:30</strong>
              <p>犁桥水镇 18:40 亮灯<br />非遗演艺今日 2 场</p>
              <Link to="/services">查看实时服务 <Icon name="arrow" size={14} /></Link>
            </div>
          </div>
        </section>

        <section className="home-attractions" aria-labelledby="attractions-title">
          <div className="home-section-heading">
            <div><h2 id="attractions-title">主景区</h2></div>
            <Link to="/attractions">全部景区 →</Link>
          </div>
          <div className="home-attraction-list">
            {attractions.map((item, index) => (
              <Link to={`/attractions/${item.id}`} className={`home-attraction-card ${index === 0 ? 'featured' : ''}`} key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="home-attraction-copy"><small>{item.label}</small><h3>{item.name}</h3><p>{item.detail}</p></div>
                <span className="home-attraction-arrow"><Icon name="arrow" size={17} /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-event" aria-labelledby="event-title">
          <div className="home-event-image">
            <img src={travelImages.culture.heritage} alt="犁桥水镇非遗演艺课" />
            <span>余 8 席</span>
          </div>
          <div className="home-event-content">
            <span>每周六 14:00</span>
            <h2 id="event-title">犁桥水镇<br />非遗演艺课</h2>
            <p>先看一场演出，再跟老师学一段地方技艺，适合亲子同行。</p>
            <div><Link to="/culture/2">立即预约</Link><Link to="/culture">更多活动</Link></div>
          </div>
        </section>

        <section className="home-topics" aria-labelledby="topics-title">
          <div className="home-section-heading">
            <div><h2 id="topics-title">住与食</h2></div>
            <span>把旅程过得更完整</span>
          </div>
          <div className="home-topic-grid">
            <Link to="/stay" className="home-topic-card">
              <img src={travelImages.attractions.yongquan} alt="义安住宿专题" />
              <div><small>住宿专题</small><h3>枕水栖山</h3><p>住进山林与水巷，等一场义安清晨。</p><strong>查看住宿 →</strong></div>
            </Link>
            <Link to="/eat" className="home-topic-card">
              <img src={travelImages.attractions.liqiao} alt="义安美食专题" />
              <div><small>美食专题</small><h3>寻味乡土</h3><p>为一顿在地味道，给行程留点时间。</p><strong>查看美食 →</strong></div>
            </Link>
          </div>
        </section>

        <section className="home-services" aria-labelledby="services-title">
          <div className="home-section-heading">
            <div><h2 id="services-title">快捷服务</h2></div>
            <Link to="/services">服务大厅 →</Link>
          </div>
          <div className="home-service-grid">
            {services.map((item) => (
              <Link to={item.path} className="home-service-item" key={item.name}>
                <span><Icon name={item.icon} size={21} /></span>
                <strong>{item.name}</strong>
                <Icon name="arrow" size={13} />
              </Link>
            ))}
          </div>
        </section>

        <section className="home-route" aria-labelledby="route-title">
          <div className="home-route-topline"><strong>一日经典线</strong></div>
          <h2 id="route-title">凤凰山 <i>→</i> 永泉小镇 <i>→</i> 犁桥水镇</h2>
          <div className="home-route-timeline">
            <span><b>09:00</b>花海与铜史</span>
            <span><b>13:00</b>江南味道</span>
            <span><b>18:40</b>水镇灯影</span>
          </div>
          <p>从山野走向水乡，把义安最有代表性的三种风景放进一天。</p>
          <Link to="/play">查看更多路线 <Icon name="arrow" size={16} /></Link>
        </section>
      </main>
    </div>
  );
};

export default Home;
