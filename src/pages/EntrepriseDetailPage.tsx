import { useParams, Link } from 'react-router-dom'

export default function EntrepriseDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <Link to="/entreprises" className="text-sm text-blue-600 hover:text-blue-800">
        &larr; Retour aux entreprises
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Fiche Entreprise</h1>
      <p className="mt-2 text-gray-600">Détail de l'entreprise <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">{id}</code></p>
    </div>
  )
}
