import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Culture.css';
import { travelImages } from '../data/images';

const events = [
  {
    id: 1,
    type: '节庆活动',
    heritageCategory: '民俗活动',
    date: '04.18—05.05',
    title: '凤凰山凤丹文化旅游季',
    place: '凤凰山景区',
    status: '报名中',
    image: travelImages.culture.festival,
    intro: '赏凤丹、看民俗、逛乡集，把春天交给一座花山。'
  },
  {
    id: 2,
    type: '非遗课堂',
    heritageCategory: '传统戏剧',
    date: '每周六 14:00',
    title: '犁桥水镇非遗演艺课',
    place: '犁桥水镇圆楼',
    status: '余 8 席',
    image: travelImages.culture.heritage,
    intro: '先看一场演出，再跟老师学一段地方技艺，适合亲子同行。'
  },
  {
    id: 3,
    type: '手工体验',
    heritageCategory: '传统技艺',
    date: '预约制 · 约 90 分钟',
    title: '铜拓本与青铜纹样',
    place: '江南铜谷体验馆',
    status: '可预约',
    image: travelImages.culture.rubbing,
    intro: '从纹样、墨色和纸张开始，做一张属于自己的铜文化拓本。'
  },
  {
    id: 4,
    type: '手工体验',
    heritageCategory: '民间文学',
    date: '每周日 10:00',
    title: '义安白姜腌制小课堂',
    place: '永泉小镇农事工坊',
    status: '余 12 席',
    image: travelImages.culture.gingerClass,
    intro: '认识白姜、处理白姜，再把一小罐义安的脆辣风味带回家。'
  }
];

const heritageCategories = ['全部', '民间文学', '传统音乐', '传统舞蹈', '传统戏剧', '传统技艺', '民俗活动'];

const Culture = () => {
  const [selectedType, setSelectedType] = useState('全部');
  const filteredEvents = selectedType === '全部' ? events : events.filter((item) => item.heritageCategory === selectedType);

  return (
    <div className="travel-page culture-page">
      <header className="portal-header culture-header" style={{ backgroundImage: `url(${travelImages.culture.heritage})` }}>
        <div className="culture-header-shade"></div>
        <div className="culture-header-copy">
          <h1>不只看风景，<br />也动手参与</h1>
          <p>节庆、非遗与手作，不把文化放在玻璃柜里，而是让每一位到访者都能亲自体验。</p>
        </div>
      </header>

      <section className="culture-intro">
        <div><strong>文化体验日历</strong><p>六类非遗门类，按时间找到正在发生的义安故事</p></div>
      </section>

      <div className="culture-filters" aria-label="非遗门类筛选">
        {heritageCategories.map((type) => <button type="button" key={type} className={selectedType === type ? 'active' : ''} onClick={() => setSelectedType(type)}>{type}</button>)}
      </div>

      <main className="event-list">
        {filteredEvents.length === 0 ? (
          <div className="event-empty"><strong>{selectedType}</strong><p>该门类活动正在整理中，请先查看其他非遗体验。</p></div>
        ) : filteredEvents.map((event) => (
          <article className="event-card" key={event.id}>
            <Link to={`/culture/${event.id}`} className="event-image" data-type={event.type} data-category={event.heritageCategory}><img className="event-photo" src={event.image} alt={`${event.title}现场`} loading="lazy" onError={(imageEvent) => { imageEvent.currentTarget.style.display = 'none'; }} /><span>{event.heritageCategory}</span></Link>
            <div className="event-content">
              <div className="event-date-row"><strong>{event.date}</strong><em>{event.status}</em></div>
              <h2>{event.title}</h2>
              <div className="event-place">◎ {event.place}</div>
              <p>{event.intro}</p>
              <Link className="event-book" to={`/culture/${event.id}`}>查看并预约 →</Link>
            </div>
          </article>
        ))}
      </main>

      <section className="culture-note"><p>“非遗不是旧东西，而是还在被人使用、被人记住的生活方式。”</p><small>— 义安文化体验手册</small></section>
    </div>
  );
};

export default Culture;
