import React, { useState } from 'react';
import '../styles/Stay.css';

const imageUrl = (prompt, imageSize = 'landscape_4_3') => `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${imageSize}`;

const Stay = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const categories = ['全部', '山居', '水院', '露营'];
  const stays = [
    {
      id: 'songyun',
      name: '永泉松云山居',
      category: '山居',
      area: '钟鸣镇',
      price: '¥680 起',
      image: imageUrl('Yongquan Songyun mountain residence Tongling Yian, authentic Hui style courtyard in forest mist, restrained boutique hotel photography'),
      phone: '05625689101',
      note: '院落藏在山林里，适合把行程留白。傍晚散步，夜里泡温泉，第二天再去看忆江南十二景。'
    },
    {
      id: 'zhu-hai',
      name: '永泉竹塰人家',
      category: '山居',
      area: '钟鸣镇',
      price: '¥520 起',
      image: imageUrl('quiet bamboo courtyard homestay in Yongquan Tongling Yian, natural morning light, authentic travel lodging photography'),
      phone: '05625689202',
      note: '竹影让空间显得很静。比起赶景点，这里更适合早起喝茶、在小镇里慢慢消磨半天。'
    },
    {
      id: 'li-qiao',
      name: '犁桥耕心堂',
      category: '水院',
      area: '西联镇',
      price: '¥420 起',
      image: imageUrl('Liqiao water town riverside courtyard homestay Tongling Yian, Hui style house, canal and lantern reflection, documentary travel photography'),
      phone: '05625689303',
      note: '住处离水巷很近。夜游散场后不用匆忙离开，清晨还能看见水镇尚未热闹起来的样子。'
    },
    {
      id: 'river-camp',
      name: '印象河边营地',
      category: '露营',
      area: '义安乡野',
      price: '¥168 起',
      image: imageUrl('riverside forest camping in Tongling Yian, simple canvas tent, coffee and barbecue, candid lifestyle travel photography'),
      phone: '05625689404',
      note: '林间咖啡、烧烤和帐篷组成一个轻量周末。更适合朋友结伴，也适合带孩子亲近自然。'
    }
  ];

  const filteredStays = selectedCategory === '全部' ? stays : stays.filter((item) => item.category === selectedCategory);

  return (
    <div className="travel-page journal-page stay-page">
      <header className="section-header">
        <h1>枕水栖山</h1>
        <p>住一晚，不只是为了休息，也是为了看见义安清晨的另一面。</p>
      </header>

      <div className="filter-line">
        {categories.map((category) => (
          <button key={category} className={selectedCategory === category ? 'active' : ''} onClick={() => setSelectedCategory(category)}>{category}</button>
        ))}
      </div>

      <main className="story-list">
        {filteredStays.map((item) => (
          <article className="story-entry" key={item.id}>
            <div className="story-image"><img src={item.image} alt={item.name} /></div>
            <div className="story-meta"><span>{item.area}</span><span>{item.price}</span></div>
            <h2>{item.name}</h2>
            <p>{item.note}</p>
            <a className="text-action stay-contact-action" href={`tel:${item.phone || '056212345'}`}>联系住宿 <span>☎</span></a>
          </article>
        ))}
      </main>
    </div>
  );
};

export default Stay;
