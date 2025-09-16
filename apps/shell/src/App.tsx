import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { MicroFrontendLoader } from './components/MicroFrontendLoader'

function App() {
  return (
    <Layout>
      <Routes>
        <Route 
          path="/" 
          element={<MicroFrontendLoader moduleName="dashboard" />} 
        />
        <Route 
          path="/users" 
          element={<MicroFrontendLoader moduleName="users" />} 
        />
        <Route 
          path="/settings" 
          element={<MicroFrontendLoader moduleName="settings" />} 
        />
      </Routes>
    </Layout>
  )
}

export default App







