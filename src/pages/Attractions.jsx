import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Attractions.css';
import './Culture.css';
import { travelImages } from '../data/images';
import { localResources } from '../data/localResources';

const resourceTypes = ['全部', 'A级景区', '网红打卡点', '红色旅游景点', '研学旅游基地', '农家乐', '住宿', '美食'];

const attractions = [
  {
    id: 'liqiao',
    name: '犁桥水镇',
    label: '江南水乡',
    categories: ['A级景区', '网红打卡点', '研学旅游基地'],
    location: '西联镇犁桥村',
    time: '建议游览 3—4 小时',
    intro: '以明塘文化艺术村为依托，保留徽派村落肌理与水巷格局。黄昏之后，灯影、乌篷船和非遗演艺共同构成水镇最有辨识度的时刻。',
    image: travelImages.attractions.liqiao,
    highlights: ['水镇夜游', '非遗演艺', '明塘艺术村']
  },
  {
    id: 'yongquan',
    name: '永泉小镇',
    label: '山居度假',
    categories: ['A级景区', '民宿', '美食', '农家乐', '网红打卡点'],
    location: '钟鸣镇叶山林场',
    time: '建议游览 1 天',
    intro: '山林、温泉、徽派院落和江南小吃共同组成小镇的慢度假体验。适合安排一整天，也可以住一晚，把忆江南十二景留到清晨慢慢走。',
    image: travelImages.attractions.yongquan,
    highlights: ['忆江南十二景', '江南味道', '温泉山居']
  },
  {
    id: 'fenghuang',
    name: '凤凰山',
    label: '花海铜史',
    categories: ['A级景区', '红色旅游景点', '研学旅游基地'],
    location: '顺安镇凤凰村',
    time: '建议游览半日',
    intro: '凤凰山既有凤丹花事，也保存着古代采矿遗迹。春季看花，全年都可以沿山路寻找金牛洞等铜文化线索。',
    image: travelImages.attractions.fenghuang,
    highlights: ['凤丹花海', '金牛洞遗址', '山野步道']
  }
];

const experienceHighlights = [
  {
    id: 1,
    type: '节庆活动',
    date: '04.18—05.05',
    title: '凤凰山凤丹文化旅游季',
    place: '凤凰山景区',
    status: '报名中',
    image: travelImages.culture.festival
  },
  {
    id: 2,
    type: '非遗课堂',
    date: '每周六 14:00',
    title: '犁桥水镇非遗演艺课',
    place: '犁桥水镇圆楼',
    status: '余 8 席',
    image: travelImages.culture.heritage
  }
];

const Attractions = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type');
  const [selectedResourceType, setSelectedResourceType] = useState(resourceTypes.includes(initialType) ? initialType : resourceTypes[0]);
  const resources = [...attractions, ...localResources];
  const filteredAttractions = selectedResourceType === '全部'
    ? resources
    : resources.filter((item) => item.categories.includes(selectedResourceType));
  return (
    <div className="travel-page attraction-page">
      <header className="portal-header" style={{ backgroundImage: `url(${travelImages.attractions.liqiao})` }}>
        <div className="portal-header-shade"></div>
        <div className="portal-header-copy">
          <h1>走进义安，<br />遇见山水人文</h1>
          <p>景区介绍与游览亮点集中呈现，从水镇灯影到山林花海，找到想去的下一站。</p>
        </div>
      </header>

      <section className="resource-section">
        <div className="section-title-row">
          <div><h2>义安游礼资源</h2></div>
          <strong>{filteredAttractions.length} 项资源</strong>
        </div>
        <div className="resource-filters" aria-label="资源分类筛选">
          {resourceTypes.map((type) => (
            <button type="button" key={type} className={selectedResourceType === type ? 'active' : ''} onClick={() => setSelectedResourceType(type)}>{type}</button>
          ))}
        </div>
        <div className="resource-list">
          {filteredAttractions.map((item) => (
            <article className="resource-card" key={`${item.type || 'attraction'}-${item.id}`}>
              <Link to={item.type ? `/local/${item.type}/${item.id}` : `/attractions/${item.id}`} className="resource-image">
                <img src={item.image} alt={item.name} loading="lazy" />
                <span>{item.label}</span>
              </Link>
              <div className="resource-content">
                <div className="resource-meta"><span>{item.location}</span><span>{item.time}</span></div>
                <h3>{item.name}</h3>
                <p>{item.intro}</p>
                <div className="resource-tags">{item.categories.map((category) => <span key={category}>{category}</span>)}</div>
                <Link className="resource-detail-link" to={item.type ? `/local/${item.type}/${item.id}` : `/attractions/${item.id}`}>{item.type ? `查看${item.categories[0]}详情` : '查看景区详情'} →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="explore-experiences">
        <div className="section-title-row">
          <div><h2>文化体验</h2></div>
          <Link to="/culture">全部活动 →</Link>
        </div>
        <div className="experience-preview-grid">
          {experienceHighlights.map((event) => (
            <Link to={`/culture/${event.id}`} className="experience-preview" key={event.id}>
              <div className="experience-preview-image"><img src={event.image} alt={event.title} loading="lazy" /><span>{event.type}</span></div>
              <div className="experience-preview-meta"><span>{event.date}</span><strong>{event.status}</strong></div>
              <h3>{event.title}</h3>
              <p>{event.place}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Attractions;
