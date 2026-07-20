import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import './Services.css';

const serviceGroups = [
  { id: 'ticket', icon: 'ticket', title: '门票与活动', detail: '景点购票 · 活动预约', action: '去办理' },
  { id: 'traffic', icon: 'traffic', title: '交通接驳', detail: '按景点查询 · 公交专线', action: '查路线' },
  { id: 'parking', icon: 'parking', title: '停车服务', detail: '按景点查询 · 充电设施', action: '看停车' },
  { id: 'facilities', icon: 'facilities', title: '便民设施', detail: '按景点查询 · 服务点位', action: '查设施' },
  { id: 'consult', icon: 'consult', title: '游客咨询', detail: '客服电话 · 失物招领', action: '去咨询' }
];

const ticketEntries = [
  { id: 'liqiao', name: '犁桥水镇', detail: '夜游与演艺票务' },
  { id: 'fenghuang', name: '凤凰山', detail: '景区门票与活动' },
  { id: 'yongquan', name: '永泉小镇', detail: '度假套票与体验' }
];

const Services = () => {
  const [noticeOpen, setNoticeOpen] = useState(false);

  return (
    <div className="travel-page services-page">
      <header className="service-dashboard">
        <div className="service-topline"><span>义安游礼服务台</span><span>2026.07.17</span></div>
        <div className="weather-block"><strong>29°</strong><div><h1>多云，适宜出游</h1><p>午后短时阵雨 · 建议携带雨具</p></div></div>
        <div className="service-status"><span><i className="green-dot"></i>主要景区正常开放</span><button type="button" aria-expanded={noticeOpen} aria-controls="service-notice" onClick={() => setNoticeOpen((current) => !current)}>今日公告 {noticeOpen ? '−' : '+'}</button></div>
        {noticeOpen && <div className="service-notice" id="service-notice">犁桥水镇今日 18:40 开始亮灯；凤凰山部分山路雨后湿滑，请穿防滑鞋。</div>}
      </header>

      <section className="quick-services">
        <div className="module-heading"><h2>游览服务</h2></div>
        <div className="service-directory">
          {serviceGroups.map((item) => (
            <Link key={item.title} className="service-row" to={`/services/${item.id}`}>
              <span className="service-icon"><Icon name={item.icon} size={19} /></span>
              <span className="service-copy"><strong>{item.title}</strong><small>{item.detail}</small></span>
              <span className="service-action">{item.action} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="ticket-module">
        <div className="module-heading light"><h2>景点票务入口</h2></div>
        <p className="ticket-module-intro">选择景点后直接填写门票信息，也可在门票页预约近期活动。</p>
        <div className="ticket-options">
          {ticketEntries.map((ticket) => <Link key={ticket.name} to={`/services/ticket?scenic=${ticket.id}`}><strong>{ticket.name}</strong><span>{ticket.detail}</span><b>查看 →</b></Link>)}
        </div>
      </section>

      <section className="traffic-module">
        <div className="module-heading"><h2>出行参考</h2><p className="traffic-note">以下为自驾车参考时间，实际用时请以道路情况为准</p></div>
        <div className="traffic-line"><div className="traffic-node active">铜陵站</div><span>约 35 分钟</span><div className="traffic-node">永泉小镇</div></div>
        <div className="traffic-line"><div className="traffic-node active">铜陵北站</div><span>约 25 分钟</span><div className="traffic-node">犁桥水镇</div></div>
        <div className="traffic-line"><div className="traffic-node active">顺安镇</div><span>约 15 分钟</span><div className="traffic-node">凤凰山</div></div>
      </section>
    </div>
  );
};

export default Services;
