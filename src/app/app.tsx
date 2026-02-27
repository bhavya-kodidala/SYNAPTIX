import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { ThemeProvider } from 'next-themes';
import { LandingPage } from './components/LandingPage';
import { SignupPage } from './components/SignupPage';
import { LoginPage } from './components/LoginPage';
import { ProviderDashboard } from './components/ProviderDashboard';
import { ReceiverDashboard } from './components/ReceiverDashboard';
import { PostFoodPage } from './components/PostFoodPage';
import { MyListingsPage } from './components/MyListingsPage';
import { PickupHistoryPage } from './components/PickupHistoryPage';
import { SettingsPage } from './components/SettingsPage';
import { NotificationsPage } from './components/NotificationsPage';
import { PickupConfirmationPage } from './components/PickupConfirmationPage';
import { TermsPage } from './components/TermsPage';
import { PrivacyPage } from './components/PrivacyPage';
import { FoodHygieneDisclaimerPage } from './components/FoodHygieneDisclaimerPage';
import { FAQPage } from './components/FAQPage';
import { Toaster } from './components/ui/sonner';
import { DonationPage } from './components/DonationPage';
import { WalletPage } from './components/WalletPage';
import { ProviderWalletPage } from './components/ProviderWalletPage';

const DashboardRedirect = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    return <Navigate to={user.role === 'provider' ? '/provider' : '/receiver'} replace />;
  }
  return <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Router>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="size-full">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/provider" element={<ProviderDashboard />} />
            <Route path="/receiver" element={<ReceiverDashboard />} />
            <Route path="/post-food" element={<PostFoodPage />} />
            <Route path="/my-listings" element={<MyListingsPage />} />
            <Route path="/history" element={<PickupHistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/disclaimer" element={<FoodHygieneDisclaimerPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/donate" element={<DonationPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/provider-wallet" element={<ProviderWalletPage />} />
            <Route path="/pickup-confirmation" element={<PickupConfirmationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </ThemeProvider>
    </Router>
  );
}
