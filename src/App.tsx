import { CustomPage, ExtraBlocks } from './components/BuilderView'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import EventsPage from './pages/EventsPage'
import DirectionPage from './pages/DirectionPage'
import Admin from './pages/Admin'
import { ContentProvider } from './content-store'

function ScrollManager() {
  const { pathname, state, key } = useLocation()
  useEffect(() => {
    const id = (state as { scrollTo?: string } | null)?.scrollTo
    if (pathname === '/' && id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50)
    else window.scrollTo(0, 0)
  }, [pathname, state, key])
  return null
}

export default function App() {
  return (
    <ContentProvider>
    <Layout>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<ExtraBlocks target="home"><Home /></ExtraBlocks>} />
        <Route path="/qadam/:slug" element={<ExtraBlocks><DirectionPage /></ExtraBlocks>} />
        <Route path="/page/:id" element={<CustomPage />} />
        <Route path="/events/:category" element={<EventsPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<div className="py-32 text-center text-xl">Бет табылмады</div>} />
      </Routes>
    </Layout>
    </ContentProvider>
  )
}
