import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { useFeedback } from '../components/Feedback';
import { useRole } from '../components/RoleContext';
import { readBookings, readOrders, readTrips, removeBooking, removeOrder, removeTrip, updateBooking, updateOrder } from '../data/profileStorage';
import './Profile.css';

const roles = {
  visitor: {
    label: '游客',
    greeting: '下午好，义安旅人',
    sections: [
      ['我的行程', '/profile/trips', '查看已加入的路线'],
      ['体验预约', '/profile/bookings', '查看活动与服务预约'],
      ['我的订单', '/profile/orders', '查看好物订单明细']
    ]
  },
  villager: {
    label: '村民',
    greeting: '乡村共建工作台',
    note: '参与村务、共建与乡村服务',
    metrics: [['320', '当前积分'], ['10', '服务入口'], ['1', '待审核']],
    sections: [
      ['村民首页', '/home', '进入村务与共建服务工作台'],
      ['村务服务', '/villager/module/affairs', '公开信息、惠民政策与积分福利'],
      ['乡村共建', '/villager/module/build', '参与议事、项目、经营与治理']
    ]
  },
  government: {
    label: '政务',
    greeting: '数字文旅治理工作台',
    note: '景区态势、全域监控、镇村数据与业务协同',
    metrics: [['6,120', '全区实时游客'], ['42 / 45', '在线监控点位'], ['18', '待协同事项']],
    sections: [
      ['政务驾驶舱', '/home', '查看全区景区、监控、镇村和协同态势'],
      ['全域监控', '/government/monitoring', '选择监控点位，查看实时画面与 AI 预警'],
      ['镇村数据', '/government/villages', '查看人口、年龄、收入与游客统计']
    ]
  }
};

const formatTime = (value) => new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
}).format(new Date(value));

const Profile = () => {
  const { activeRole, setActiveRole } = useRole();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const { notify, openDialog } = useFeedback();
  const navigate = useNavigate();
  const current = roles[activeRole];

  const handleWorkspaceAction = (title, detail, action) => {
    openDialog(action, `${title}\n${detail}\n当前事项已进入${current.label}工作台处理队列。`);
  };

  const switchRole = (id, role) => {
    setActiveRole(id);
    setIsRoleModalOpen(false);
    notify(`已切换至${role.label}工作台`);
    navigate('/home');
    window.setTimeout(() => window.location.reload(), 0);
  };

  const linkedSections = ['visitor', 'villager', 'government'].includes(activeRole);

  return (
    <div className="travel-page profile-page">
      <header className="profile-header">
        <div className="profile-topline"><span>义安游礼</span></div>
        <div className="profile-identity"><div className="profile-avatar"><Icon name="profile" size={28} /></div><div><span>个人账户</span><h1>{current.greeting}</h1>{current.note ? <p>{current.note}</p> : null}</div></div>
        <button className="role-switch-button" type="button" onClick={() => setIsRoleModalOpen(true)}>当前身份：{current.label} <span>切换身份 <Icon name="arrow" size={16} /></span></button>
      </header>

      {current.metrics ? <section className="profile-metrics">{current.metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</section> : null}

      <main className="profile-sections">
        <div className="profile-title"><h2>{activeRole === 'government' ? '政务工作台' : activeRole === 'villager' ? '村民工作台' : '我的服务'}</h2></div>
        {linkedSections ? current.sections.map(([title, path, detail]) => (
          <Link key={title} to={path} className="profile-row profile-row-link">
            <div><h3>{title}</h3><p>{detail}</p></div>
            <span>查看 →</span>
          </Link>
        )) : current.sections.map(([title, detail, action]) => (
          <article key={title} className="profile-row">
            <div><h3>{title}</h3><p>{detail}</p></div>
            <button type="button" onClick={() => handleWorkspaceAction(title, detail, action)}>{action} →</button>
          </article>
        ))}
      </main>

      <section className="profile-service"><span>需要帮助？</span><h2>义安游礼服务台</h2><p>行程咨询、乡村共建与治理协同按身份统一响应。</p><button type="button" onClick={() => { window.location.href = 'tel:056212345'; }}>联系服务台</button></section>

      {isRoleModalOpen && (
        <div className="role-modal-backdrop" role="presentation" onClick={() => setIsRoleModalOpen(false)}>
          <section className="role-modal" role="dialog" aria-modal="true" aria-labelledby="role-modal-title" onClick={(event) => event.stopPropagation()}>
            <div className="role-modal-heading"><div><h2 id="role-modal-title">切换角色</h2></div><button type="button" aria-label="关闭角色切换" onClick={() => setIsRoleModalOpen(false)}><Icon name="close" size={22} /></button></div>
            <p>选择角色后，首页、导航与个人中心将展示对应内容。</p>
            <div className="role-options">
              {Object.entries(roles).map(([id, role]) => (
                <button key={id} type="button" className={activeRole === id ? 'active' : ''} onClick={() => switchRole(id, role)}>
                  <span>{role.label}</span><small>{id === 'visitor' ? '浏览行程、预约与订单' : id === 'villager' ? '参与村务服务与乡村共建' : '查看文旅治理与服务态势'}</small><b>{activeRole === id ? '当前角色' : '选择'} <em>→</em></b>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

const recordConfig = {
  trips: { title: '我的行程', eyebrow: 'TRIPS', empty: '还没有加入行程', action: '去选择路线', path: '/play' },
  bookings: { title: '体验预约', eyebrow: 'BOOKINGS', empty: '还没有提交预约', action: '去预约体验', path: '/services/ticket' },
  orders: { title: '我的订单', eyebrow: 'ORDERS', empty: '还没有提交订单', action: '去逛义安好物', path: '/shop' }
};

export const ProfileRecords = ({ type }) => {
  const config = recordConfig[type];
  const [records, setRecords] = useState(() => type === 'trips' ? readTrips() : type === 'bookings' ? readBookings() : readOrders());
  const { notify } = useFeedback();

  const removeRecord = (record) => {
    const removed = type === 'trips'
      ? removeTrip(record.routeId)
      : type === 'bookings'
        ? removeBooking(record.number)
        : removeOrder(record.number);
    if (!removed) return;
    setRecords((current) => current.filter((item) => type === 'trips' ? item.routeId !== record.routeId : item.number !== record.number));
    notify(type === 'trips' ? '行程已移除' : type === 'bookings' ? '预约已删除' : '订单已删除');
  };

  const cancelBooking = (record) => {
    const updated = updateBooking(record.number, { status: '已取消', cancelledAt: new Date().toISOString(), activity: { ...record.activity, status: '已取消' } });
    if (!updated) return;
    setRecords((current) => current.map((item) => item.number === record.number ? updated : item));
    notify('预约已取消');
  };

  const updateOrderStatus = (record, status) => {
    const updated = updateOrder(record.number, { status, statusUpdatedAt: new Date().toISOString() });
    if (!updated) return;
    setRecords((current) => current.map((item) => item.number === record.number ? updated : item));
    notify(status === '已取消' ? '订单已取消' : '已确认收货');
  };

  return (
    <div className="travel-page profile-page profile-record-page">
      <header className="profile-record-header">
        <Link to="/profile">← 返回我的</Link>
        <span>{config.eyebrow}</span>
        <h1>{config.title}</h1>
        <p>以下内容来自你在义安游礼中的真实提交记录。</p>
      </header>
      <main className="profile-record-list">
        {records.length === 0 ? <section className="profile-record-empty"><h2>{config.empty}</h2><p>完成操作后，详细信息会自动保存在这里。</p><Link to={config.path}>{config.action} →</Link></section> : null}
        {records.map((record) => type === 'trips' ? (
          <article className="profile-record-card" key={record.routeId}>
            <div className="profile-record-meta"><span>{record.category}</span><time>{formatTime(record.updatedAt || record.createdAt)}</time></div>
            <h2>{record.name}</h2>
            <p>{record.note}</p>
            <dl><div><dt>区域</dt><dd>{record.area}</dd></div><div><dt>建议用时</dt><dd>{record.duration}</dd></div></dl>
            <ol>{record.points.map((point, index) => <li key={point.name}><span>{index + 1}</span><div><strong>{point.name}</strong><small>{point.detail}</small></div></li>)}</ol>
            <div className="profile-record-actions"><button type="button" className="danger" onClick={() => removeRecord(record)}>移除行程</button></div>
          </article>
        ) : type === 'bookings' ? (
          <article className="profile-record-card" key={record.number}>
            <div className="profile-record-meta"><span>{record.status || record.activity.status}</span><time>{formatTime(record.createdAt)}</time></div>
            <h2>{record.activity.title}</h2>
            <strong className="profile-record-number">预约号 {record.number}</strong>
            {record.type === 'stay' ? <dl><div><dt>入住日期</dt><dd>{record.contact.checkIn}</dd></div><div><dt>离店日期</dt><dd>{record.contact.checkOut}</dd></div><div><dt>住宿地点</dt><dd>{record.location}</dd></div><div><dt>房间数</dt><dd>{record.contact.rooms} 间</dd></div><div><dt>入住人</dt><dd>{record.contact.name} · {record.contact.phone}</dd></div></dl> : <dl><div><dt>活动时间</dt><dd>{record.activity.time}</dd></div><div><dt>活动地点</dt><dd>{record.location || record.activity.location || '义安区活动服务点'}</dd></div><div><dt>预约人</dt><dd>{record.contact.name} · {record.contact.phone}</dd></div><div><dt>参与信息</dt><dd>{record.contact.count} 人 · {record.contact.participantType}</dd></div>{record.contact.note ? <div><dt>备注</dt><dd>{record.contact.note}</dd></div> : null}</dl>}
            <div className="profile-record-actions">{(record.status || record.activity.status) !== '已取消' && <button type="button" className="danger" onClick={() => cancelBooking(record)}>取消预约</button>}{record.type === 'stay' ? <Link to="/stay">查看住宿</Link> : <Link to={`/culture/${record.activity.id}`}>查看预约</Link>}{(record.status || record.activity.status) === '已取消' && <button type="button" onClick={() => removeRecord(record)}>删除记录</button>}</div>
          </article>
        ) : (
          <article className="profile-record-card" key={record.number}>
            <div className="profile-record-meta"><span>{record.status}</span><time>{formatTime(record.createdAt)}</time></div>
            <h2>{record.type === 'ticket' ? record.title : `订单 ${record.number}`}</h2>
            {record.type === 'ticket' ? <dl><div><dt>票种</dt><dd>{record.ticket.name}</dd></div><div><dt>游玩日期</dt><dd>{record.visitDate}</dd></div><div><dt>景区</dt><dd>{record.scenic.title}</dd></div><div><dt>实名游客</dt><dd>{record.visitors.map((visitor) => visitor.name).join('、')}</dd></div><div><dt>支付方式</dt><dd>{record.payment.method}</dd></div></dl> : <><div className="profile-order-items">{record.items.map((item) => <div key={item.id}><img src={item.image} alt={item.name} /><span><strong>{item.name}</strong><small>¥{item.price} × {item.quantity} · {item.unit}</small></span><b>¥{item.subtotal}</b></div>)}</div>{record.address && <div className="profile-order-address"><span>收货地址</span><strong>{record.address.name} · {record.address.phone}</strong><p>{record.address.province}{record.address.city}{record.address.district}{record.address.detail}</p><small>{record.delivery?.name} · {record.payment?.method}</small>{record.message && <em>配送留言：{record.message}</em>}</div>}</>}
            <div className="profile-order-total"><span>共 {record.totalQuantity} 件</span><strong>实付 ¥{record.totalAmount}</strong></div>
            <div className="profile-record-actions">{record.status === '待发货' && <button type="button" className="danger" onClick={() => updateOrderStatus(record, '已取消')}>取消订单</button>}{record.status === '待收货' && <button type="button" className="primary" onClick={() => updateOrderStatus(record, '已完成')}>确认收货</button>}{['已取消', '已完成'].includes(record.status) && <button type="button" onClick={() => removeRecord(record)}>删除记录</button>}</div>
          </article>
        ))}
      </main>
    </div>
  );
};

export default Profile;
