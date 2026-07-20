import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './LocalDetail.css';
import { localResourceMap, localResourceTypes } from '../data/localResources';

const LocalDetail = () => {
  const { type, id } = useParams();
  const resource = localResourceMap[type]?.[id] || Object.values(localResourceMap[type] || {})[0];
  const typeLabel = localResourceTypes[type] || '本地资源';

  if (!resource) {
    return (
      <div className="travel-page local-detail-page local-detail-empty">
        <Link to="/attractions" className="local-detail-back">← 返回探索</Link>
        <h1>暂未找到这项资源</h1>
        <Link to="/attractions" className="local-detail-action">返回资源列表 →</Link>
      </div>
    );
  }

  return (
    <div className="travel-page local-detail-page">
      <header className="local-detail-header">
        <Link to="/attractions" className="local-detail-back">← 返回探索</Link>
        <span>{typeLabel} · 义安游礼</span>
        <h1>{resource.name}</h1>
        <p>{resource.label}</p>
      </header>
      <div className="local-detail-hero">
        <img src={resource.image} alt={resource.name} />
        <span>{typeLabel}</span>
      </div>
      <main className="local-detail-content">
        <div className="local-detail-meta">{resource.location}<strong>{resource.time}</strong></div>
        <p className="local-detail-intro">{resource.intro}</p>
        <div className="local-detail-highlights">{resource.highlights.map((item) => <span key={item}>{item}</span>)}</div>
        <a className="local-detail-primary" href={`tel:${resource.phone}`}>电话咨询 <strong>☎</strong></a>
      </main>
      <section className="local-detail-story">
        <span>LOCAL NOTE</span>
        <h2>把这一站，留给自己</h2>
        <p>{resource.detail}</p>
        <div className="local-detail-tip"><strong>到访提示</strong><p>义安的本地资源会随季节、天气和经营安排变化，出发前建议确认开放状态与预约要求。</p></div>
      </section>
      <Link to={`/attractions?type=${encodeURIComponent(typeLabel)}`} className="local-detail-footer-link">继续探索{typeLabel}资源 <strong>→</strong></Link>
    </div>
  );
};

export default LocalDetail;
