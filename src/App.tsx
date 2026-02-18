import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import EntreprisesPage from './pages/EntreprisesPage'
import ContactsPage from './pages/ContactsPage'
import OpportunitesPage from './pages/OpportunitesPage'
import PipelinePage from './pages/PipelinePage'
import ActivitesPage from './pages/ActivitesPage'
import TestCrud from './pages/TestCrud'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="entreprises" element={<EntreprisesPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="opportunites" element={<OpportunitesPage />} />
          <Route path="pipeline" element={<PipelinePage />} />
          <Route path="activites" element={<ActivitesPage />} />
          <Route path="test-crud" element={<TestCrud />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
