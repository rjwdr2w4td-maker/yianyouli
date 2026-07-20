import React, { useState } from 'react';
import '../styles/Buy.css';
import { useFeedback } from '../components/Feedback';

const imageUrl = () => 'https://lf-cdn.trae.com.cn/obj/trae-ai-image/page_image/default.jpeg';

const Buy = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [favorites, setFavorites] = useState([]);
  const { notify } = useFeedback();

  const categories = ['全部', '农遗', '糕点', '铜作', '水镇文创'];
  const goods = [
    {
      number: '01',
      name: '铜陵白姜',
      category: '农遗',
      area: '义安特产',
      price: '¥30—128',
      image: imageUrl('Tongling white ginger in simple ceramic dish and paper package, authentic local agricultural heritage product photography, muted natural tones'),
      note: '选嫩姜腌制，入口脆、微辣、回甘。真空小包装更适合带上高铁，也能作为日常佐餐。'
    },
    {
      number: '02',
      name: '顺安酥糖',
      category: '糕点',
      area: '顺安镇',
      price: '¥25—58',
      image: imageUrl('Shunan sesame crispy candy Tongling Yian, traditional handmade pastry on kraft paper, documentary food still life photography'),
      note: '芝麻、糖和麦芽香气很直接，口感松酥。建议买小盒，趁新鲜吃完，比礼盒排场更重要。'
    },
    {
      number: '03',
      name: '铜拓本画',
      category: '铜作',
      area: '铜文化文创',
      price: '¥88 起',
      image: imageUrl('Chinese bronze rubbing artwork from Tongling copper culture, handmade paper and ink, restrained museum product photography'),
      note: '以青铜纹样和拓印技法为基础，比常规旅游纪念品更耐看，适合书房或工作台。'
    },
    {
      id: 'liqiao-souvenir',
      name: '犁桥水镇小物',
      category: '水镇文创',
      area: '西联镇',
      price: '¥19 起',
      image: imageUrl('Liqiao water town small souvenirs, understated fridge magnet and postcard with canal village illustrations, editorial product photography'),
      note: '冰箱贴、明信片和印章册都不贵。挑一件真正对应旅途记忆的小物即可，不必买得太多。'
    }
  ];

  const filteredGoods = selectedCategory === '全部' ? goods : goods.filter((item) => item.category === selectedCategory);

  const toggleFavorite = (item) => {
    const isFavorite = favorites.includes(item.number);
    setFavorites((current) => isFavorite ? current.filter((id) => id !== item.number) : [...current, item.number]);
    notify(`${item.name}${isFavorite ? '已取消收藏' : '已收藏'}`);
  };

  return (
    <div className="travel-page journal-page buy-page">
      <header className="section-header">
        <h1>带走义安</h1>
        <p>选择有产地、有手艺、有日常用途的风物，而不是流水线纪念品。</p>
      </header>

      <div className="filter-line">
        {categories.map((category) => (
          <button key={category} className={selectedCategory === category ? 'active' : ''} onClick={() => setSelectedCategory(category)}>{category}</button>
        ))}
      </div>

      <main className="story-list goods-list">
        {filteredGoods.map((item) => (
          <article className="story-entry" key={item.number}>
            <div className="story-image"><img src={item.image} alt={item.name} /></div>
            <div className="story-meta"><span>{item.area}</span><span>{item.price}</span></div>
            <h2>{item.name}</h2>
            <p>{item.note}</p>
            <button type="button" className="text-action" aria-pressed={favorites.includes(item.id)} aria-label={`${favorites.includes(item.id) ? '取消收藏' : '收藏'}${item.name}`} onClick={() => toggleFavorite(item)}>{favorites.includes(item.id) ? '已收藏' : '收藏这件'} <span aria-hidden="true">{favorites.includes(item.id) ? '✓' : '＋'}</span></button>
          </article>
        ))}
      </main>
    </div>
  );
};

export default Buy;
