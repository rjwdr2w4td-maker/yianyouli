import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './Shop.css';
import { travelImages } from '../data/images';
import { useFeedback } from '../components/Feedback';
import { clearCart, readCart, saveCart, saveOrder } from '../data/profileStorage';
import { readApprovedStallProducts } from '../data/villagerStorage';

const baseProducts = [
  { id: 1, category: '白姜好礼', name: '铜陵白姜·小罐装', price: 36, unit: '200 克', tag: '全球重要农业文化遗产', image: travelImages.products.gingerJar },
  { id: 2, category: '白姜好礼', name: '白姜双味礼盒', price: 128, unit: '6 罐', tag: '甜口 / 咸口', image: travelImages.products.gingerGift },
  { id: 3, category: '顺安酥香', name: '顺安酥糖', price: 48, unit: '400 克', tag: '芝麻麦芽香', image: travelImages.products.candy },
  { id: 4, category: '铜韵文创', name: '青铜纹样拓印册', price: 88, unit: '1 册', tag: '手工拓印', image: travelImages.products.rubbingBook },
  { id: 5, category: '铜韵文创', name: '铜都书签套装', price: 39, unit: '3 枚', tag: '黄铜材质', image: travelImages.products.bookmark },
  { id: 6, category: '水镇手信', name: '犁桥水镇冰箱贴', price: 29, unit: '1 枚', tag: '夜游限定', image: travelImages.products.magnet }
];

const initialAddress = { name: '', phone: '', province: '安徽省', city: '铜陵市', district: '义安区', detail: '' };
const deliveryOptions = [
  { id: 'standard', name: '标准配送', detail: '预计 2—4 天送达', fee: 0 },
  { id: 'express', name: '顺丰速运', detail: '预计 1—2 天送达', fee: 12 }
];
const paymentOptions = ['微信支付', '支付宝', '银行卡'];

const Shop = () => {
  const products = useMemo(() => [...baseProducts, ...readApprovedStallProducts().map((item) => ({ ...item, image: travelImages.villager[item.imageKey] || travelImages.villager.stallGinger }))], []);
  const [category, setCategory] = useState('全部');
  const [cart, setCart] = useState(readCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [address, setAddress] = useState(initialAddress);
  const [delivery, setDelivery] = useState('');
  const [message, setMessage] = useState('');
  const [payment, setPayment] = useState('');
  const [errors, setErrors] = useState({});
  const [orderFeedback, setOrderFeedback] = useState('');
  const { notify } = useFeedback();
  const categories = useMemo(() => ['全部', ...new Set(products.map((item) => item.category))], [products]);
  const filteredProducts = useMemo(
    () => (category === '全部' ? products : products.filter((item) => item.category === category)),
    [category, products]
  );

  useEffect(() => {
    const pendingProductId = window.sessionStorage.getItem('pendingProductId');
    window.sessionStorage.removeItem('pendingProductId');
    if (!pendingProductId || !products.some((item) => String(item.id) === pendingProductId)) return;
    setCart((current) => ({ ...current, [pendingProductId]: (current[pendingProductId] || 0) + 1 }));
    setCartOpen(true);
  }, []);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const addToCart = (id) => {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
    setOrderFeedback('');
    notify('已加入购物袋');
  };

  const changeQuantity = (id, amount) => {
    setCart((current) => {
      const next = Math.max(0, (current[id] || 0) + amount);
      const result = { ...current, [id]: next };
      if (next === 0) delete result[id];
      return result;
    });
    setOrderFeedback('');
  };

  const cartCount = Object.values(cart).reduce((sum, value) => sum + value, 0);
  const cartItems = products.filter((item) => cart[item.id]);
  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * cart[item.id], 0), [cartItems, cart]);
  const selectedDelivery = deliveryOptions.find((item) => item.id === delivery);
  const total = subtotal + (selectedDelivery?.fee || 0);

  const updateAddress = (field, value) => {
    setAddress((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const validateAddress = () => {
    const nextErrors = {};
    const normalizedPhone = address.phone.replace(/\D/g, '').replace(/^86(?=1[3-9]\d{9}$)/, '');
    if (!address.name.trim()) nextErrors.name = '请输入收货人姓名';
    if (!/^1[3-9]\d{9}$/.test(normalizedPhone)) nextErrors.phone = '请输入正确的手机号';
    if (!address.province.trim() || !address.city.trim() || !address.district.trim()) nextErrors.region = '请完整填写省、市、区';
    if (address.detail.trim().length < 5) nextErrors.detail = '请填写不少于 5 个字的详细地址';
    if (!message.trim()) nextErrors.message = '请填写配送留言，无特殊需求可填写“无”';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return false;
    setAddress((current) => ({ ...current, name: current.name.trim(), phone: normalizedPhone, detail: current.detail.trim() }));
    return true;
  };

  const nextStep = () => {
    if (checkoutStep === 1 && !validateAddress()) return;
    if (checkoutStep === 2 && !delivery) {
      setErrors({ delivery: '请选择配送方式' });
      return;
    }
    setErrors({});
    setCheckoutStep((current) => Math.min(3, current + 1));
  };

  const submitOrder = () => {
    if (!cartItems.length) {
      setCheckoutStep(0);
      return;
    }
    if (!validateAddress()) {
      setCheckoutStep(1);
      return;
    }
    if (!selectedDelivery) {
      setErrors({ delivery: '请选择配送方式' });
      setCheckoutStep(2);
      return;
    }
    if (!payment) {
      setErrors({ payment: '请选择支付方式' });
      return;
    }
    const orderNumber = `YA${Date.now().toString().slice(-8)}`;
    saveOrder({
      number: orderNumber,
      type: 'product',
      status: '待发货',
      totalQuantity: cartCount,
      subtotal,
      deliveryFee: selectedDelivery.fee,
      totalAmount: total,
      address: { ...address },
      delivery: { ...selectedDelivery },
      message: message.trim(),
      payment: { method: payment, status: '支付成功', paidAt: new Date().toISOString() },
      items: cartItems.map((item) => ({ ...item, quantity: cart[item.id], subtotal: item.price * cart[item.id] }))
    });
    setOrderFeedback(`订单 ${orderNumber} 已支付，当前状态为待发货。`);
    clearCart();
    setCart({});
    setCheckoutStep(0);
    setAddress(initialAddress);
    setDelivery('');
    setMessage('');
    setPayment('');
    setErrors({});
    notify(`支付成功，订单 ${orderNumber} 待发货`);
  };

  const closeCart = () => {
    setCartOpen(false);
    setCheckoutStep(0);
    setErrors({});
  };

  return (
    <div className="travel-page shop-page">
      <header className="shop-header">
        <div><h1>义安好物</h1><p>选自产地与手艺人的地方风物</p></div>
        <button type="button" className="cart-button" onClick={() => setCartOpen(true)}>购物袋 <strong>{cartCount}</strong></button>
      </header>

      <section className="shop-feature"><span>本期风物</span><h2>一块姜，如何成为义安的味觉名片</h2><p>铜陵白姜种植历史悠久，脆嫩、少渣，既是佐餐小食，也是最适合带走的地方风土。</p></section>
      <div className="shop-categories">{categories.map((item) => <button key={item} type="button" className={category === item ? 'active' : ''} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>

      <main className="product-grid">
        {filteredProducts.map((product) => (
          <article className={`product-item ${product.villagerPublished ? 'villager-product-item' : ''}`} key={product.id}>
            <Link to={`/shop/${product.id}`} className="product-photo" data-category={product.category}><img className="product-photo-image" src={product.image} alt={product.name} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; }} /><span>{product.villagerPublished ? '村民发布' : product.category}</span></Link>
            <div className="product-info"><small>{product.tag}</small>{product.villagerPublished ? <h2>{product.name}</h2> : <Link to={`/shop/${product.id}`}><h2>{product.name}</h2></Link>}<div className="product-price"><strong>¥{product.price}</strong><span>/ {product.unit}</span></div><button type="button" disabled={product.stock === 0} onClick={() => addToCart(product.id)}>{product.stock === 0 ? '已售罄' : '加入购物袋 ＋'}</button></div>
          </article>
        ))}
      </main>

      {cartOpen && <div className="cart-mask" onClick={closeCart}>
        <aside className={`cart-drawer ${checkoutStep ? 'checkout-drawer' : ''}`} onClick={(event) => event.stopPropagation()}>
          <div className="cart-title"><div><span>{checkoutStep ? `CHECKOUT · 0${checkoutStep}` : 'SHOPPING BAG'}</span><h2>{checkoutStep ? ['','填写收货地址','选择配送方式','确认并支付'][checkoutStep] : '我的购物袋'}</h2></div><button type="button" onClick={closeCart}>关闭</button></div>
          {checkoutStep > 0 && <div className="checkout-progress">{['地址','配送','支付'].map((item, index) => <span key={item} className={checkoutStep >= index + 1 ? 'active' : ''}><b>{index + 1}</b>{item}</span>)}</div>}

          {checkoutStep === 0 && <>
            <div className="cart-list">
              {cartItems.length === 0 && <p className="empty-cart">{orderFeedback || '还没有选择好物'}</p>}
              {cartItems.map((item) => <div className="cart-row" key={item.id}><img className="cart-product-image" src={item.image} alt={item.name} /><div><strong>{item.name}</strong><span>¥{item.price}</span></div><div className="quantity"><button type="button" aria-label={`减少${item.name}数量`} onClick={() => changeQuantity(item.id, -1)}>−</button><span>{cart[item.id]}</span><button type="button" aria-label={`增加${item.name}数量`} onClick={() => changeQuantity(item.id, 1)}>＋</button></div></div>)}
            </div>
            {orderFeedback && <p className="order-feedback" role="status">{orderFeedback}</p>}
            <div className="cart-total"><div><span>商品合计</span><strong>¥{subtotal}</strong></div><button type="button" disabled={!cartItems.length} onClick={() => setCheckoutStep(1)}>去结算</button></div>
          </>}

          {checkoutStep === 1 && <form className="checkout-form" onSubmit={(event) => { event.preventDefault(); nextStep(); }} noValidate>
            <label>收货人<input value={address.name} onChange={(event) => updateAddress('name', event.target.value)} placeholder="请输入真实姓名" />{errors.name && <small>{errors.name}</small>}</label>
            <label>手机号<input type="tel" inputMode="numeric" value={address.phone} onChange={(event) => updateAddress('phone', event.target.value)} placeholder="用于配送联系" />{errors.phone && <small>{errors.phone}</small>}</label>
            <div className="checkout-region"><label>省<input value={address.province} onChange={(event) => updateAddress('province', event.target.value)} /></label><label>市<input value={address.city} onChange={(event) => updateAddress('city', event.target.value)} /></label><label>区/县<input value={address.district} onChange={(event) => updateAddress('district', event.target.value)} /></label></div>
            {errors.region && <p className="checkout-error">{errors.region}</p>}
            <label>详细地址<textarea rows="3" value={address.detail} onChange={(event) => updateAddress('detail', event.target.value)} placeholder="街道、门牌号、小区及房间号" />{errors.detail && <small>{errors.detail}</small>}</label>
            <label>配送留言<textarea rows="3" maxLength="120" value={message} onChange={(event) => { setMessage(event.target.value); setErrors((current) => ({ ...current, message: '' })); }} placeholder="必填：请填写配送时间、放置位置或其他说明；无特殊需求可填写“无”" />{errors.message && <small>{errors.message}</small>}</label>
            <button className="checkout-primary" type="submit">下一步 · 选择配送 <strong>→</strong></button>
          </form>}

          {checkoutStep === 2 && <div className="checkout-section">
            <div className="checkout-options">{deliveryOptions.map((item) => <button type="button" key={item.id} className={delivery === item.id ? 'active' : ''} onClick={() => { setDelivery(item.id); setErrors({}); }}><span><strong>{item.name}</strong><small>{item.detail}</small></span><b>{item.fee ? `+¥${item.fee}` : '包邮'}</b></button>)}</div>
            {errors.delivery && <p className="checkout-error">{errors.delivery}</p>}
            <div className="checkout-actions"><button type="button" onClick={() => setCheckoutStep(1)}>上一步</button><button type="button" className="checkout-primary" onClick={nextStep}>下一步 · 确认支付 →</button></div>
          </div>}

          {checkoutStep === 3 && <div className="checkout-section">
            <div className="checkout-summary"><dl><div><dt>收货地址</dt><dd>{address.name} · {address.phone}<br />{address.province}{address.city}{address.district}{address.detail}</dd></div><div><dt>配送</dt><dd>{selectedDelivery.name}<br />{selectedDelivery.detail}</dd></div><div><dt>配送留言</dt><dd>{message.trim()}</dd></div><div><dt>商品金额</dt><dd>¥{subtotal}</dd></div><div><dt>运费</dt><dd>¥{selectedDelivery.fee}</dd></div></dl><div className="checkout-pay-total"><span>应付金额</span><strong>¥{total}</strong></div></div>
            <div className="checkout-options payment-options">{paymentOptions.map((item) => <button type="button" key={item} className={payment === item ? 'active' : ''} onClick={() => { setPayment(item); setErrors({}); }}><strong>{item}</strong><b>{payment === item ? '已选择' : '选择'}</b></button>)}</div>
            {errors.payment && <p className="checkout-error">{errors.payment}</p>}
            <div className="checkout-actions"><button type="button" onClick={() => setCheckoutStep(2)}>上一步</button><button type="button" className="checkout-primary" onClick={submitOrder}>确认支付 ¥{total} →</button></div>
          </div>}
        </aside>
      </div>}
    </div>
  );
};

export default Shop;
