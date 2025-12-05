import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthProvider } from './lib/context/AuthContext'
import { InterestProvider } from './lib/context/InterestContext'
import ScrollToTop from './components/ScrollToTop'
import EnhancedHeader from './components/EnhancedHeader'
import Footer from './components/Footer'
import AuthLayout from './pages/auth/AuthLayout'
import BuyerRegister from './pages/auth/BuyerRegister'
import MarketerRegister from './pages/auth/MarketerRegister'
import RegisterStep1 from './pages/auth/RegisterStep1'
import CompleteProfile from './pages/auth/CompleteProfile'
import Login from './pages/auth/Login'
import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetails from './pages/PropertyDetails'
import MyInterests from './pages/MyInterests'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import Dashboard from './pages/dashboard/Dashboard'
import Listings from './pages/dashboard/Listings'
import Leads from './pages/dashboard/Leads'
import AddProperty from './pages/dashboard/AddProperty'
import EditProperty from './pages/dashboard/EditProperty'
import Developers from './pages/dashboard/Developers'
import DeveloperForm from './pages/dashboard/DeveloperForm'
import Projects from './pages/dashboard/Projects'
import ProjectForm from './pages/dashboard/ProjectForm'
import ConnectionTest from './pages/ConnectionTest'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import LookupManagement from './pages/admin/LookupManagement'
import AreasManagement from './pages/admin/AreasManagement'

function App() {
  const { i18n } = useTranslation()
  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'

  return (
    <div dir={dir} className="min-h-screen flex flex-col">
      <AuthProvider>
        <InterestProvider>
          <ScrollToTop />
          <EnhancedHeader />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/my-interests" element={<MyInterests />} />
              <Route path="/test-connection" element={<ConnectionTest />} />

              {/* New two-step registration (outside AuthLayout - custom styling) */}
              <Route path="/auth/register/buyer" element={<RegisterStep1 userType="buyer" />} />
              <Route path="/auth/register/marketer" element={<RegisterStep1 userType="marketer" />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />

              {/* Auth routes (with AuthLayout) */}
              <Route path="/auth" element={<AuthLayout />}>
                {/* Old registration (kept for backwards compatibility) */}
                <Route path="register/buyer-old" element={<BuyerRegister />} />
                <Route path="register/marketer-old" element={<MarketerRegister />} />

                <Route path="login" element={<Login />} />
              </Route>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="listings" element={<Listings />} />
                <Route path="leads" element={<Leads />} />
                <Route path="add-property" element={<AddProperty />} />
                <Route path="listings/:id/edit" element={<EditProperty />} />
                <Route path="developers" element={<Developers />} />
                <Route path="developers/new" element={<DeveloperForm />} />
                <Route path="developers/:id/edit" element={<DeveloperForm />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/new" element={<ProjectForm />} />
                <Route path="projects/:id/edit" element={<ProjectForm />} />
              </Route>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="lookups" element={<LookupManagement />} />
                <Route path="areas" element={<AreasManagement />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </InterestProvider>
      </AuthProvider>
    </div>
  )
}

export default App
