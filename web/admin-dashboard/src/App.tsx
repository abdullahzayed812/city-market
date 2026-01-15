import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import UsersManagement from './pages/UsersManagement.tsx';
import OrdersManagement from './pages/OrdersManagement.tsx';
import CouriersManagement from './pages/CouriersManagement.tsx';
import FinancialOverview from './pages/FinancialOverview.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="couriers" element={<CouriersManagement />} />
          <Route path="revenue" element={<FinancialOverview />} />
          <Route path="settings" element={<div>Settings Page (Coming Soon)</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page (Coming Soon)</div>} />
      </Routes>
    </Router>
  );
}

export default App;
