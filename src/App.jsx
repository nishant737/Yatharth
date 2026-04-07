import { useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import StorySection from './components/StorySection'
import CraftSection from './components/CraftSection'
import ClientSection from './components/ClientSection'
import ContactSection from './components/ContactSection'

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <LoadingScreen onComplete={() => setLoaded(true)} />

      {/* Lock scroll while loading */}
      <style>{`body { overflow: ${loaded ? 'auto' : 'hidden'}; }`}</style>

      <Navbar />
      <main>
        <HeroSection />
        <StorySection />

        {/* Craft stays pinned while Client scrolls up over it */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, height: '100vh' }}>
          <CraftSection />
        </div>

        <ClientSection />
        <ContactSection />
      </main>
    </>
  )
}
