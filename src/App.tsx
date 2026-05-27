import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Onboarding from './pages/Onboarding'
import Banter from './pages/Banter'
import Roast from './pages/Roast'
import Sports from './pages/Sports'
import Personality from './pages/Personality'
import Safety from './pages/Safety'
import Workout from './pages/Workout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/banter" element={<Banter />} />
      <Route path="/roast" element={<Roast />} />
      <Route path="/sports" element={<Sports />} />
      <Route path="/personality" element={<Personality />} />
      <Route path="/safety" element={<Safety />} />
      <Route path="/workout" element={<Workout />} />
    </Routes>
  )
}
