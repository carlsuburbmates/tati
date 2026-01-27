import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import WorkWithMePage from './pages/WorkWithMePage';
import ResourcesPage from './pages/ResourcesPage';
import AffiliatesPage from './pages/AffiliatesPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import DisclaimerPage from './pages/DisclaimerPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/work-with-me" element={<WorkWithMePage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/affiliates" element={<AffiliatesPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
