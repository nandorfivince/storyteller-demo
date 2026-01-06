import { useState } from 'react'
import Consumer from './pages/Consumer'
import Analytics from './pages/Analytics'

type Page = 'consumer' | 'analytics'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('consumer')

  return (
    <div className="app">
      <header>
        <h1>MiniStories Playground</h1>
        <p>Sport Highlights Demo</p>
        <nav className="nav">
          <button
            className={`nav-btn ${currentPage === 'consumer' ? 'active' : ''}`}
            onClick={() => setCurrentPage('consumer')}
          >
            Stories
          </button>
          <button
            className={`nav-btn ${currentPage === 'analytics' ? 'active' : ''}`}
            onClick={() => setCurrentPage('analytics')}
          >
            Analytics
          </button>
        </nav>
      </header>
      <main>
        {currentPage === 'consumer' && <Consumer />}
        {currentPage === 'analytics' && <Analytics />}
      </main>
    </div>
  )
}
