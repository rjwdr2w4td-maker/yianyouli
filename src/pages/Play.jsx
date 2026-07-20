import React, { useState } from 'react';
import '../styles/Play.css';
import '../styles/RouteMap.css';
import { useFeedback } from '../components/Feedback';
import { readTrips, removeTrip, saveTrip } from '../data/profileStorage';

const imageUrl = (prompt, imageSize = 'landscape_4_3') => `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${imageSize}`;

const routeMaps = {
  '犁桥水镇 · 从黄昏走到入夜': [
    { name: '明塘艺术村', detail: '看白墙黛瓦与水巷', icon: '🏘' },
    { name: '圆楼家宴', detail: '品尝地方家常味', icon: '🍲' },
    { name: '水岸灯影', detail: '等待水镇亮灯', icon: '🏮' },
    { name: '非遗演艺', detail: '夜间演艺体验', icon: '🎭' }
  ],
  '凤凰山 · 花与铜的两条线索': [
    { name: '凤丹花海', detail: '春季花事观赏', icon: '🌸' },
    { name: '山野步道', detail: '沿山林慢行', icon: '🌿' },
    { name: '金牛洞遗址', detail: '寻找古铜文化线索', icon: '⛰' }
  ],
  '江南铜谷 · 沿古矿遗址慢行': [
    { name: '古村入口', detail: '从村落开始走读', icon: '🏡' },
    { name: '田野风景道', detail: '沿乡间道路慢行', icon: '🌾' },
    { name: '古矿遗址', detail: '了解铜都历史', icon: '⛏' }
  ],
  '梧桐花谷 · 一堂自然课': [
    { name: '花谷入口', detail: '认识当季花木', icon: '🌼' },
    { name: '农事体验区', detail: '参与自然观察', icon: '🧺' },
    { name: '亲子草地', detail: '留出自由玩耍时间', icon: '🪁' }
  ]
};

const RouteMap = ({ points }) => (
  <div className="route-story" aria-label="卡通游览路线">
    <div className="route-story-sky"><span></span><span></span><span></span></div>
    <div className="route-story-hills"></div>
    <div className="route-story-path"></div>
    <div className="route-story-stops">
      {points.map((point, index) => (
        <div className="route-story-stop" key={point.name}>
          <div className="route-story-illustration"><span>{point.icon}</span></div>
          <div className="route-story-copy"><small>第 {index + 1} 站</small><strong>{point.name}</strong><p>{point.detail}</p></div>
          {index < points.length - 1 && <span className="route-story-arrow">→</span>}
        </div>
      ))}
    </div>
    <div className="route-story-footer"><span>从这里出发</span><strong>跟着路线慢慢游</strong></div>
  </div>
);

const Play = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [tripIds, setTripIds] = useState(() => readTrips().map((trip) => trip.routeId));
  const { openDialog, notify } = useFeedback();

  const categories = ['全部', '水乡', '铜史', '山野', '亲子'];
  const routes = [
    {
      number: '01',
      name: '犁桥水镇 · 从黄昏走到入夜',
      category: '水乡',
      area: '西联镇',
      price: '建议 3 小时',
      image: imageUrl('Liqiao water town Tongling Yian at dusk, authentic canal village with lanterns and local performance, documentary travel photography'),
      note: '四点以后抵达最合适。先看白墙黛瓦，再等灯火亮起，最后坐在水边看一场非遗演艺。'
    },
    {
      number: '02',
      name: '凤凰山 · 花与铜的两条线索',
      category: '山野',
      area: '顺安镇',
      price: '建议半日',
      image: imageUrl('Fenghuang mountain Tongling Yian, peony field and mountain path in spring, realistic documentary travel photography'),
      note: '春天为凤丹而来，其他季节则可以把重点放在山林和古铜文化。金牛洞遗址值得单独留时间。'
    },
    {
      number: '03',
      name: '江南铜谷 · 沿古矿遗址慢行',
      category: '铜史',
      area: '义安全域',
      price: '建议自驾',
      image: imageUrl('Jiangnan Copper Valley road Tongling Yian, rural road through fields and old villages, subtle copper heritage, documentary landscape photography'),
      note: '这不是一个单独景点，而是一条把古村、田野、银杏和采矿记忆串起来的风景道。'
    },
    {
      number: '04',
      name: '梧桐花谷 · 一堂自然课',
      category: '亲子',
      area: '钟鸣镇',
      price: '建议半日',
      image: imageUrl('Wutong flower valley Tongling Yian, families walking in seasonal flower fields, natural candid documentary travel photography'),
      note: '除了花期景观，还有农事和自然体验。安排不必太满，给孩子留出自由观察和玩耍的时间。'
    }
  ];

  const filteredRoutes = selectedCategory === '全部' ? routes : routes.filter((item) => item.category === selectedCategory);

  const toggleTrip = (item) => {
    if (tripIds.includes(item.number)) {
      removeTrip(item.number);
      setTripIds((current) => current.filter((id) => id !== item.number));
      notify(`${item.name}已移除`);
      return;
    }
    saveTrip({
      routeId: item.number,
      name: item.name,
      category: item.category,
      area: item.area,
      duration: item.price,
      image: item.image,
      note: item.note,
      points: routeMaps[item.name]
    });
    setTripIds((current) => [...current, item.number]);
    notify(`${item.name}已加入行程`);
  };

  return (
    <div className="travel-page journal-page play-page">
      <header className="section-header">
        <h1>走读铜都</h1>
        <p>不以打卡数量计算旅程，用脚步读懂水乡、山野和三千年铜史。</p>
      </header>

      <div className="filter-line">
        {categories.map((category) => (
          <button key={category} className={selectedCategory === category ? 'active' : ''} onClick={() => setSelectedCategory(category)}>{category}</button>
        ))}
      </div>

      <main className="story-list route-list">
        {filteredRoutes.map((item) => (
          <article className="story-entry" key={item.number}>
            <div className="story-image"><img src={item.image} alt={item.name} /></div>
            <div className="story-meta"><span>{item.area}</span><span>{item.price}</span></div>
            <h2>{item.name}</h2>
            <p>{item.note}</p>
            <div className="route-card-actions"><button type="button" className="text-action" onClick={() => openDialog(item.name, <div className="route-dialog-body"><p>{item.note}</p><RouteMap points={routeMaps[item.name]} /><div className="route-dialog-summary"><span>{item.area}出发</span><span>{item.price}</span></div><button type="button" className={`route-dialog-add ${tripIds.includes(item.number) ? 'added' : ''}`} onClick={() => toggleTrip(item)}>{tripIds.includes(item.number) ? '已加入 · 点击移除' : '加入行程'} <span>{tripIds.includes(item.number) ? '−' : '＋'}</span></button></div>)}>展开路线 <span>↘</span></button><button type="button" className={`route-quick-add ${tripIds.includes(item.number) ? 'added' : ''}`} aria-pressed={tripIds.includes(item.number)} onClick={() => toggleTrip(item)}>{tripIds.includes(item.number) ? '已加入行程' : '加入行程'} <span>{tripIds.includes(item.number) ? '✓' : '＋'}</span></button></div>
          </article>
        ))}
      </main>
    </div>
  );
};

export default Play;
