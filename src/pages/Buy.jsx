import React, { useState } from 'react';
import '../styles/Buy.css';
import { useFeedback } from '../components/Feedback';
import { readTrips, removeTrip, saveTrip } from '../data/profileStorage';
import { travelImages } from '../data/images';

const Buy = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [itinerary, setItinerary] = useState(() => readTrips().map((trip) => trip.routeId));
  const { notify } = useFeedback();

  const categories = ['全部', '特产', '文创', '伴手礼'];
  const goods = [
    {
      id: 'ginger',
      name: '铜陵白姜',
      category: '特产',
      area: '顺安镇',
      price: '¥36/罐',
      image: travelImages.products.gingerJar,
      note: '脆嫩少渣，辣中带甜。腌制后风味更佳，是餐桌上不可缺少的佐餐佳品。'
    },
    {
      id: 'candy',
      name: '顺安酥糖',
      category: '特产',
      area: '顺安镇',
      price: '¥48/盒',
      image: travelImages.products.candy,
      note: '芝麻与麦芽糖的经典组合，入口即化，甜而不腻。'
    },
    {
      id: 'rubbing',
      name: '青铜纹样拓印册',
      category: '文创',
      area: '铜官区',
      price: '¥88/册',
      image: travelImages.products.rubbingBook,
      note: '手工拓印的青铜纹样，记录三千年铜都历史。'
    },
    {
      id: 'gift',
      name: '白姜礼盒',
      category: '伴手礼',
      area: '顺安镇',
      price: '¥128/盒',
      image: travelImages.products.gingerGift,
      note: '六罐装精品礼盒，甜口咸口各三，送礼自用两相宜。'
    }
  ];

  const filteredGoods = selectedCategory === '全部' ? goods : goods.filter((item) => item.category === selectedCategory);

  const toggleItinerary = (item) => {
    const routeId = `buy-${item.id}`;
    if (itinerary.includes(routeId)) {
      removeTrip(routeId);
      setItinerary((current) => current.filter((id) => id !== routeId));
      notify(`${item.name}已从行程移除`);
      return;
    }
    saveTrip({
      routeId,
      name: item.name,
      category: `购物 · ${item.category}`,
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
    <div className="travel-page journal-page buy-page">
      <header className="section-header">
        <h1>义安好物</h1>
        <p>把乡土味道和铜都记忆带回家。</p>
      </header>

      <div className="filter-line">
        {categories.map((category) => (
          <button key={category} className={selectedCategory === category ? 'active' : ''} onClick={() => setSelectedCategory(category)}>{category}</button>
        ))}
      </div>

      <main className="story-list">
        {filteredGoods.map((item) => (
          <article className="story-entry" key={item.id}>
            <div className="story-image"><img src={item.image} alt={item.name} /></div>
            <div className="story-meta"><span>{item.area}</span><span>{item.price}</span></div>
            <h2>{item.name}</h2>
            <p>{item.note}</p>
            <button type="button" className="text-action" onClick={() => toggleItinerary(item)}>{itinerary.includes(`buy-${item.id}`) ? '从行程移除' : '记入行程'} <span>{itinerary.includes(`buy-${item.id}`) ? '−' : '＋'}</span></button>
          </article>
        ))}
      </main>
    </div>
  );
};

export default Buy;