import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import { Navbar } from './components/navbar/Navabar';
import { Hero } from './components/hero/Hero';
import {Service} from './components/servicecard/Service'
import {Mid} from './components/mid/Mid';
import { Mid2 } from './components/mid2/Mid2';
import { Appp } from './components/Appp/Appp';
import {Becamepro} from './components/becamepro/Becamepro';
import {Ourpartners} from './components/ourpartner/Ourpartners';
import { Footer } from './components/footer/Footer'
import OAuthSuccess from './components/OAuthSuccess';
import Blog from './components/blog/Blog';
import About from './components/pages/About';
import Press from './components/pages/Press';
import Careers from './components/pages/Careers';
import Help from './components/pages/Help';
import Contact from './components/pages/Contact';
import BecomeProfessional from './components/pages/BecomeProfessional';
import RetailPartnerships from './components/pages/RetailPartnerships';
import Privacy from './components/pages/Privacy';
import Terms from './components/pages/Terms';
import CancellationPolicy from './components/pages/CancellationPolicy';
import Cookies from './components/pages/Cookies';
import CAPreCollection from './components/pages/CAPreCollection';
import Location from './components/pages/Location';
import ServicePage from './components/pages/Service';
import ScrollToTop from './components/ScrollToTop';

// Home page component
const HomePage = () => (
  <>
    <Navbar/>
    <Hero/>
    <Service/>
    <Mid/>
    <Mid2/>
    <Appp/>
    <Becamepro/>
    <Ourpartners/>
    <Footer/>
  </>
);

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
        <Route path="/press" element={<Press />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/become-professional" element={<BecomeProfessional />} />
        <Route path="/retail-partnerships" element={<RetailPartnerships />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cancellation-policy" element={<CancellationPolicy />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/ca-pre-collection" element={<CAPreCollection />} />
        <Route path="/locations/:city" element={<Location />} />
        <Route path="/services/:serviceName" element={<ServicePage />} />
      </Routes>
    </Router>
  );
}
