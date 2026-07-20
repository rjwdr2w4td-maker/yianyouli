import React, { useState } from 'react';
import '../styles/Eat.css';
import { useFeedback } from '../components/Feedback';
import { readTrips, removeTrip, saveTrip } from '../data/profileStorage';

const imageUrl = () => `${import.meta.env.BASE_URL}images/yian-cover.jpg`;

const Eat = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [itinerary, setItinerary] = useState(() => readTrips().map((trip) => trip.routeId));
  const { notify } = useFeedback();

  const categories = ['全部', '老味道', '农家菜', '水镇宴', '随手礼'];
  const places = [
    {
      id: 'yongquan-food',
      name: '永泉江南味道',
      category: '老味道',
      area: '钟鸣镇',
      price: '铜钱消费',
      image: imageUrl('Yongquan Jiangnan food street Tongling Yian, authentic traditional snack stalls, Hui style architecture, documentary food photography, natural light'),
      note: '先换一袋铜钱，再沿青石路挑小吃。杀猪汤、米粉和炉火边的点心，比“网红感”更像一段真实日常。'
    },
    {
      id: 'liqiao-banquet',
      name: '犁桥圆楼家宴',
      category: '水镇宴',
      area: '西联镇',
      price: '人均约 ¥90',
      image: imageUrl('Liqiao water town local family banquet Tongling Yian, traditional rice and river fish dishes, round building interior, documentary food photography'),
      note: '太白雕胡饭、小河鱼和时令菜适合多人围坐。吃完正好等水镇亮灯，再慢慢走进夜游。'
    },
    {
      id: 'shanli-renjia',
      name: '山里任家',
      category: '农家菜',
      area: '顺安镇',
      price: '人均约 ¥75',
      image: imageUrl('Tongling Yian farmhouse lunch, local river fish, free range chicken, seasonal vegetables, simple wooden table, documentary food photography'),
      note: '没有复杂摆盘，重点是锅气和食材。走凤凰山、江南铜谷一线时，在这里停一顿最合适。'
    },
    {
      id: 'ginger-candy',
      name: '白姜与顺安酥糖',
      category: '随手礼',
      area: '顺安镇',
      price: '¥20 起',
      image: imageUrl('Tongling white ginger and Shunan crispy sesame candy on simple linen cloth, authentic local specialty still life photography'),
      note: '白姜脆、辣、回甘，酥糖则是芝麻和麦芽糖的旧时香气。一咸一甜，是最精简的义安味觉名片。'
    }
  ];

  const filteredPlaces = selectedCategory === '全部' ? places : places.filter((item) => item.category === selectedCategory);

  const toggleItinerary = (item) => {
    const routeId = `eat-${item.id}`;
    if (itinerary.includes(routeId)) {
      removeTrip(routeId);
      setItinerary((current) => current.filter((id) => id !== routeId));
      notify(`${item.name}已从行程移除`);
      return;
    }
    saveTrip({
      routeId,
      name: item.name,
      category: `美食 · ${item.category}`,
      area: item.area,
      duration: item.price,
      image: item.image,
      note: item.note,
      points: [{ name: item.name, detail: `${item.area} · ${item.price}` }]
    });
    setItinerary((current) => [...current, routeId]);
    notify(`${item.name}已记入行程`);
  };

  return (
    <div className="travel-page journal-page taste-page">
      <header className="section-header">
        <h1>寻味乡土</h1>
        <p>不做美食榜单，只记录值得为它停一顿的义安味道。</p>
      </header>

      <div className="filter-line">
        {categories.map((category) => (
          <button key={category} className={selectedCategory === category ? 'active' : ''} onClick={() => setSelectedCategory(category)}>{category}</button>
        ))}
      </div>

      <main className="story-list">
        {filteredPlaces.map((item) => (
          <article className="story-entry" key={item.id}>
            <div className="story-image"><img src={item.image} alt={item.name} /></div>
            <div className="story-meta"><span>{item.area}</span><span>{item.price}</span></div>
            <h2>{item.name}</h2>
            <p>{item.note}</p>
            <button type="button" className="text-action" onClick={() => toggleItinerary(item)}>{itinerary.includes(`eat-${item.id}`) ? '从行程移除' : '记入行程'} <span>{itinerary.includes(`eat-${item.id}`) ? '−' : '＋'}</span></button>
          </article>
        ))}
      </main>
    </div>
  );
};

export default Eat;
