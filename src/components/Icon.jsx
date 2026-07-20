import React from 'react';

const paths = {
  home: <><path d="M3.5 10.5 12 3l8.5 7.5" /><path d="M5.5 9.5V20h13V9.5M9 20v-5.5h6V20" /></>,
  explore: <><circle cx="12" cy="12" r="8.5" /><path d="m14.8 9.2-2.1 4.2-4.2 2.1 2.1-4.2 4.2-2.1Z" /></>,
  services: <><path d="M5 4.5h14v15H5z" /><path d="M8.5 8h7M8.5 12h7M8.5 16h4" /></>,
  shop: <><path d="M5 8.5h14l-1 11H6l-1-11Z" /><path d="M8.5 8.5V7a3.5 3.5 0 0 1 7 0v1.5" /></>,
  profile: <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>,
  ticket: <><path d="M4 7.5A2.5 2.5 0 0 0 6.5 5h11A2.5 2.5 0 0 0 20 7.5V9a2 2 0 0 0 0 6v1.5a2.5 2.5 0 0 0-2.5 2.5h-11A2.5 2.5 0 0 0 4 16.5V15a2 2 0 0 0 0-6V7.5Z" /><path d="M12 7.5v9" /></>,
  traffic: <><path d="M5 17.5 7.5 7h9l2.5 10.5" /><path d="M7.5 7 9 4h6l1.5 3M5 17.5h14M8 14h.01M16 14h.01" /></>,
  parking: <><path d="M6 19V5h5.5a4 4 0 0 1 0 8H6" /><path d="M11 9H9" /></>,
  guide: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></>,
  facilities: <><path d="M7 20V5h5a3 3 0 0 1 0 6H7M12 11l5 9" /></>,
  consult: <><path d="M4 5.5h16v11H9l-5 3v-14Z" /><path d="M8 10h.01M12 10h.01M16 10h.01" /></>,
  affairs: <><path d="M5 4.5h14v15H5z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  build: <><circle cx="7" cy="8" r="2.5" /><circle cx="17" cy="8" r="2.5" /><path d="M3.5 19a3.5 3.5 0 0 1 7 0M13.5 19a3.5 3.5 0 0 1 7 0M9.5 11.5h5" /></>,
  article: <><path d="M6 3.5h9l3 3V20H6z" /><path d="M15 3.5V7h3M9 11h6M9 15h6" /></>,
  points: <><circle cx="12" cy="12" r="8.5" /><path d="M9 9.5h6M9 14.5h6M12 7v10" /></>,
  vote: <><path d="M5 4.5h14v15H5z" /><path d="m8 11 2.2 2.2L16 7.5M8 16h8" /></>,
  stall: <><path d="M4 9h16l-1.5-5h-13L4 9Z" /><path d="M5.5 9v10h13V9M9 19v-5h6v5" /></>,
  house: <><path d="m3.5 11 8.5-7 8.5 7" /><path d="M5.5 10v10h13V10M9 20v-6h6v6" /></>,
  course: <><path d="M4.5 5.5h15v13h-15z" /><path d="M8 9h8M8 13h5M7 3.5v4M17 3.5v4" /></>,
  subsidy: <><rect x="4" y="6" width="16" height="12" rx="1" /><path d="M8 10h8M8 14h5" /></>,
  job: <><path d="M4 8h16v11H4z" /><path d="M9 8V5h6v3M4 12h16M10 12v2h4v-2" /></>,
  appeal: <><path d="M4 5.5h16v11H9l-5 3z" /><path d="M12 8v4M12 15h.01" /></>,
  pioneer: <><path d="m12 3 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z" /></>,
  arrow: <><path d="M5 12h13" /><path d="m13 6 6 6-6 6" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>
};

const Icon = ({ name, size = 22, strokeWidth = 1.5, className = '' }) => (
  <svg className={`linear-icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {paths[name] || paths.home}
  </svg>
);

export default Icon;
