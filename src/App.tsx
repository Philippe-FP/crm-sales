import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import EntreprisesPage from './pages/EntreprisesPage'
import EntrepriseDetailPage from './pages/EntrepriseDetailPage'
import ContactsPage from './pages/ContactsPage'
import ContactDetailPage from './pages/ContactDetailPage'
import OpportunitesPage from './pages/OpportunitesPage'
import OpportuniteDetailPage from './pages/OpportuniteDetailPage'
import PipelinePage from './pages/PipelinePage'
import ActivitesPage from './pages/ActivitesPage'
import TestCrud from './pages/TestCrud'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route path="entreprises" element={<EntreprisesPage />} />
          <Route path="entreprises/:id" element={<EntrepriseDetailPage />} />

          <Route path="contacts" element={<ContactsPage />} />
          <Route path="contacts/:id" element={<ContactDetailPage />} />

          <Route path="opportunites" element={<OpportunitesPage />} />
          <Route path="opportunites/:id" element={<OpportuniteDetailPage />} />

          <Route path="pipeline" element={<PipelinePage />} />
          <Route path="activites" element={<ActivitesPage />} />
          <Route path="test-crud" element={<TestCrud />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
