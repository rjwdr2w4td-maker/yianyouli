import React, { createContext, useContext, useMemo, useState } from 'react';

const RoleContext = createContext(null);
const roleKey = 'yianActiveRole';
const supportedRoles = ['visitor', 'villager', 'government'];

const readActiveRole = () => {
  try {
    const role = window.localStorage.getItem(roleKey);
    return supportedRoles.includes(role) ? role : 'visitor';
  } catch {
    return 'visitor';
  }
};

export const RoleProvider = ({ children }) => {
  const [activeRole, setRole] = useState(readActiveRole);

  const setActiveRole = (role) => {
    const nextRole = supportedRoles.includes(role) ? role : 'visitor';
    setRole(nextRole);
    try {
      window.localStorage.setItem(roleKey, nextRole);
    } catch {
      return;
    }
  };

  const value = useMemo(() => ({ activeRole, setActiveRole }), [activeRole]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = () => useContext(RoleContext);
