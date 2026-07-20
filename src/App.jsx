import React from 'react';
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Play from './pages/Play';
import Stay from './pages/Stay';
import Eat from './pages/Eat';
import Attractions from './pages/Attractions';
import Culture from './pages/Culture';
import Services from './pages/Services';
import Shop from './pages/Shop';
import Profile, { ProfileRecords } from './pages/Profile';
import LocalDetail from './pages/LocalDetail';
import VillagerHome from './pages/VillagerHome';
import VillagerFeature from './pages/VillagerFeature';
import VillagerModule from './pages/VillagerModule';
import VillagerContentDetail from './pages/VillagerContentDetail';
import VillagerServiceDetail from './pages/VillagerServiceDetail';
import { AttractionDetail, CultureDetail, ProductDetail, ServiceDetail } from './pages/Detail';
import BottomNav from './components/BottomNav';
import ScrollToTop from './components/ScrollToTop';
import { FeedbackProvider } from './components/Feedback';
import { RoleProvider } from './components/RoleContext';

function App() {
  return (
    <Router>
      <RoleProvider>
        <ScrollToTop />
        <FeedbackProvider>
          <div className="app-shell">
            <main className="app-screen">
              <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/villager" element={<VillagerHome />} />
                <Route path="/villager/module/:type" element={<VillagerModule />} />
                <Route path="/villager/content/:type/:id" element={<VillagerContentDetail />} />
                <Route path="/villager/service/:type/:id" element={<VillagerServiceDetail />} />
                <Route path="/villager/:slug" element={<VillagerFeature />} />
                <Route path="/play" element={<Play />} />
                <Route path="/stay" element={<Stay />} />
                <Route path="/eat" element={<Eat />} />
                <Route path="/attractions" element={<Attractions />} />
                <Route path="/attractions/:id" element={<AttractionDetail />} />
                <Route path="/local/:type/:id" element={<LocalDetail />} />
                <Route path="/culture" element={<Culture />} />
                <Route path="/culture/:id" element={<CultureDetail />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:id" element={<ProductDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/trips" element={<ProfileRecords type="trips" />} />
                <Route path="/profile/bookings" element={<ProfileRecords type="bookings" />} />
                <Route path="/profile/orders" element={<ProfileRecords type="orders" />} />
                <Route path="*" element={<Navigate to="/home" />} />
              </Routes>
            </main>
            <BottomNav />
          </div>
        </FeedbackProvider>
      </RoleProvider>
    </Router>
  );
}

export default App;
