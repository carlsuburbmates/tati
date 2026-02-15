import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import ToolkitPage from './pages/ToolkitPage';
import LoginPage from './pages/coach/LoginPage';
import AcceptInvitePage from './pages/coach/AcceptInvitePage';
import ResetPasswordPage from './pages/coach/ResetPasswordPage';
import DashboardPage from './pages/coach/DashboardPage';
import InboxPage from './pages/coach/InboxPage';
import ClientsPage from './pages/coach/ClientsPage';
import ClientDetailPage from './pages/coach/ClientDetailPage';
import SettingsPage from './pages/coach/SettingsPage';
import AuthGuard from './components/AuthGuard';
import CoachLayout from './components/coach/CoachLayout';
import { Toaster } from 'sonner';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public marketing routes */}
          <Route path="/" element={<><Header /><HomePage /><Footer /></>} />
          <Route path="/toolkit" element={<><Header /><ToolkitPage /><Footer /></>} />
          <Route path="/results" element={<><Header /><ResultsPage /><Footer /></>} />
          <Route path="/work-with-me" element={<><Header /><WorkWithMePage /><Footer /></>} />
          <Route path="/resources" element={<><Header /><ResourcesPage /><Footer /></>} />
          <Route path="/affiliates" element={<><Header /><AffiliatesPage /><Footer /></>} />
          <Route path="/privacy" element={<><Header /><PrivacyPage /><Footer /></>} />
          <Route path="/terms" element={<><Header /><TermsPage /><Footer /></>} />
          <Route path="/refund-policy" element={<><Header /><RefundPolicyPage /><Footer /></>} />
          <Route path="/disclaimer" element={<><Header /><DisclaimerPage /><Footer /></>} />

          {/* Coach authentication */}
          <Route path="/coach/login" element={<><Header /><LoginPage /></>} />
          <Route path="/coach/accept-invite" element={<AcceptInvitePage />} />
          <Route path="/coach/reset-password" element={<ResetPasswordPage />} />

          {/* Protected coach panel routes */}
          <Route
            path="/coach"
            element={
              <AuthGuard>
                <Header />
                <CoachLayout />
              </AuthGuard>
            }
          >
            <Route index element={<Navigate to="/coach/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="inbox" element={<InboxPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="clients/:id" element={<ClientDetailPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;

