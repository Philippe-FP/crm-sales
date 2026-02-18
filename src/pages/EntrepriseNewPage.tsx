import { useNavigate, Link } from 'react-router-dom'
import EntrepriseForm from '../components/entreprises/EntrepriseForm'
import { createEntreprise } from '../services/entreprises'
import type { EntrepriseInsert } from '../types'

export default function EntrepriseNewPage() {
  const navigate = useNavigate()

  async function handleSubmit(data: EntrepriseInsert) {
    const created = await createEntreprise(data)
    navigate(`/entreprises/${created.id}`)
  }

  return (
    <div>
      <Link to="/entreprises" className="text-sm text-blue-600 hover:text-blue-800">
        &larr; Retour aux entreprises
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Nouvelle entreprise</h1>
      <div className="mt-6">
        <EntrepriseForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/entreprises')}
          submitLabel="Créer"
        />
      </div>
    </div>
  )
}
