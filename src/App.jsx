import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import PathwayGenerator from './pages/PathwayGenerator'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pathway" element={<PathwayGenerator />} />
      </Routes>
    </BrowserRouter>
  )
}