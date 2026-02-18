import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="mt-4 text-lg text-gray-600">Page introuvable.</p>
      <Link to="/" className="mt-6 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium">
        &larr; Retour au dashboard
      </Link>
    </div>
  )
}
