import { useNavigate, Link } from 'react-router-dom'
import ContactForm from '../components/contacts/ContactForm'
import { createContact } from '../services/contacts'
import type { ContactInsert } from '../types'

export default function ContactNewPage() {
  const navigate = useNavigate()

  async function handleSubmit(data: ContactInsert) {
    const created = await createContact(data)
    navigate(`/contacts/${created.id}`)
  }

  return (
    <div>
      <Link to="/contacts" className="text-sm text-blue-600 hover:text-blue-800">
        &larr; Retour aux contacts
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Nouveau contact</h1>
      <div className="mt-6">
        <ContactForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/contacts')}
          submitLabel="Créer"
        />
      </div>
    </div>
  )
}
