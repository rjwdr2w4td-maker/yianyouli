import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { readVillagerData } from '../data/villagerStorage';
import './VillagerHome.css';

const detailConfig = {
  affairs: { label: '村务公开', back: '/villager/affairs', list: 'articles' },
  pioneer: { label: '先锋案例', back: '/villager/pioneer', list: 'pioneers' }
};

const VillagerContentDetail = () => {
  const { type, id } = useParams();
  const config = detailConfig[type];
  const data = readVillagerData();
  const item = config ? data[config.list].find((entry) => String(entry.id) === String(id)) : null;

  if (!config || !item) return <Navigate to="/home" replace />;

  const isArticle = type === 'affairs';

  return <div className="travel-page villager-page villager-content-detail">
    <header className="villager-detail-topbar"><Link to={config.back}>返回{config.label}</Link><span>{config.label}</span></header>
    <article className="villager-detail-article">
      <div className="villager-detail-meta"><span>{isArticle ? item.category : item.tag}</span><time>{isArticle ? item.date : '先锋人物'}</time></div>
      <h1>{item.title}</h1>
      <div className="villager-detail-source"><i><Icon name={isArticle ? 'article' : 'pioneer'} size={24} /></i><div><span>{isArticle ? '发布单位' : '先锋人物'}</span><strong>{isArticle ? item.publisher : item.name}</strong></div></div>
      {isArticle && <p className="villager-detail-lead">{item.summary}</p>}
      <section className="villager-detail-body">{(item.content || item.summary).split('\n').map((paragraph, index) => <p key={`${item.id}-${index}`}>{paragraph}</p>)}</section>
      {isArticle && <section className="villager-detail-notice"><Icon name="affairs" size={23} /><div><strong>村务公开说明</strong><p>如需查阅相关附件或纸质材料，可在工作日前往村民服务站咨询。</p></div></section>}
      {!isArticle && <section className="villager-detail-notice"><Icon name="build" size={23} /><div><strong>一起参与乡村共建</strong><p>案例中的实践经验可在乡村共建模块继续了解和参与。</p><Link to="/villager/module/build">进入乡村共建</Link></div></section>}
    </article>
  </div>;
};

export default VillagerContentDetail;
