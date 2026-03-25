import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 z-30 flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
          aria-label="Ouvrir le menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <span className="text-lg font-bold text-gray-900">CRM Sales</span>
      </header>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content: top padding on mobile for header, left margin on desktop for sidebar */}
      <main className="pt-14 px-4 pb-8 md:pt-8 md:pl-72 md:pr-8">
        <Outlet />
      </main>
    </div>
  )
}
