const storageKeys = {
  trips: 'yianTrips',
  bookings: 'yianBookings',
  orders: 'yianOrders',
  cart: 'yianShoppingBag'
};

const readCollection = (key) => {
  try {
    const value = JSON.parse(window.localStorage.getItem(storageKeys[key]) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const writeCollection = (key, value) => {
  window.localStorage.setItem(storageKeys[key], JSON.stringify(value));
};

export const readTrips = () => readCollection('trips');
export const readBookings = () => readCollection('bookings');
export const readOrders = () => readCollection('orders');

export const readCart = () => {
  try {
    const value = JSON.parse(window.localStorage.getItem(storageKeys.cart) || '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([, quantity]) => Number.isInteger(quantity) && quantity > 0));
  } catch {
    return {};
  }
};

export const saveCart = (cart) => {
  const nextCart = Object.fromEntries(Object.entries(cart).filter(([, quantity]) => Number.isInteger(quantity) && quantity > 0));
  window.localStorage.setItem(storageKeys.cart, JSON.stringify(nextCart));
  return nextCart;
};

export const addCartItem = (productId, quantity = 1) => {
  const cart = readCart();
  const key = String(productId);
  const nextQuantity = Math.max(0, (cart[key] || 0) + quantity);
  const nextCart = { ...cart, [key]: nextQuantity };
  if (!nextQuantity) delete nextCart[key];
  return saveCart(nextCart);
};

export const clearCart = () => saveCart({});

export const saveTrip = (trip) => {
  const trips = readTrips();
  const existingIndex = trips.findIndex((item) => item.routeId === trip.routeId);
  const nextTrip = { ...trip, updatedAt: new Date().toISOString() };
  const nextTrips = existingIndex >= 0
    ? trips.map((item, index) => index === existingIndex ? { ...item, ...nextTrip } : item)
    : [{ ...nextTrip, createdAt: nextTrip.updatedAt }, ...trips];
  writeCollection('trips', nextTrips);
  return nextTrip;
};

export const saveBooking = (booking) => {
  const nextBooking = { ...booking, createdAt: new Date().toISOString() };
  writeCollection('bookings', [nextBooking, ...readBookings()]);
  return nextBooking;
};

export const saveOrder = (order) => {
  const nextOrder = { ...order, createdAt: new Date().toISOString() };
  writeCollection('orders', [nextOrder, ...readOrders()]);
  return nextOrder;
};

const updateRecord = (key, field, value, changes) => {
  const records = readCollection(key);
  const updatedAt = new Date().toISOString();
  let updatedRecord = null;
  const nextRecords = records.map((record) => {
    if (record[field] !== value) return record;
    updatedRecord = { ...record, ...changes, updatedAt };
    return updatedRecord;
  });
  writeCollection(key, nextRecords);
  return updatedRecord;
};

const removeRecord = (key, field, value) => {
  const records = readCollection(key);
  const nextRecords = records.filter((record) => record[field] !== value);
  writeCollection(key, nextRecords);
  return nextRecords.length !== records.length;
};

export const updateBooking = (number, changes) => updateRecord('bookings', 'number', number, changes);
export const updateOrder = (number, changes) => updateRecord('orders', 'number', number, changes);
export const removeTrip = (routeId) => removeRecord('trips', 'routeId', routeId);
export const removeBooking = (number) => removeRecord('bookings', 'number', number);
export const removeOrder = (number) => removeRecord('orders', 'number', number);
