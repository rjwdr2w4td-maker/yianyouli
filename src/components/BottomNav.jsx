import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from './Icon';
import { useRole } from './RoleContext';
import './BottomNav.css';

const BottomNav = () => {
  const location = useLocation();
  const { activeRole } = useRole();
  const currentTab = location.pathname.split('/')[1] || 'home';
  const villagerPathParts = location.pathname.split('/');
  const villagerSlug = villagerPathParts[2] || '';
  const villagerModule = villagerSlug === 'module' ? villagerPathParts[3] || '' : '';

  const visitorItems = [
    { id: 'home', to: '/home', label: '首页', icon: 'home', paths: ['home'] },
    { id: 'explore', to: '/attractions', label: '探索', icon: 'explore', paths: ['explore', 'play', 'attractions', 'culture'] },
    { id: 'services', to: '/services', label: '服务', icon: 'services', paths: ['services'] },
    { id: 'shop', to: '/shop', label: '好物', icon: 'shop', paths: ['shop'] },
    { id: 'profile', to: '/profile', label: '我的', icon: 'profile', paths: ['profile'] }
  ];
  const villagerItems = [
    { id: 'home', to: '/home', label: '首页', icon: 'home', active: currentTab === 'home' || (currentTab === 'villager' && !villagerSlug) },
    { id: 'affairs', to: '/villager/module/affairs', label: '村务', icon: 'affairs', active: currentTab === 'villager' && (villagerModule === 'affairs' || ['affairs', 'points', 'subsidy'].includes(villagerSlug)) },
    { id: 'build', to: '/villager/module/build', label: '共建', icon: 'build', active: currentTab === 'villager' && (villagerModule === 'build' || ['vote', 'stall', 'house', 'course', 'job', 'appeal', 'pioneer'].includes(villagerSlug)) },
    { id: 'profile', to: '/profile', label: '我的', icon: 'profile', active: currentTab === 'profile' }
  ];
  const navItems = activeRole === 'villager' ? villagerItems : visitorItems;

  return (
    <nav className={`bottom-nav ${activeRole === 'villager' ? 'villager-nav' : ''}`} aria-label="主要导航">
      <div className="bottom-nav-inner">
        {navItems.map((item) => {
          const isActive = activeRole === 'villager' ? item.active : item.paths.includes(currentTab);
          return <Link key={item.id} to={item.to} className={`bottom-nav-item ${isActive ? 'active' : ''}`} aria-current={isActive ? 'page' : undefined}><span className="bottom-nav-icon"><Icon name={item.icon} size={20} /></span><span>{item.label}</span></Link>;
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
