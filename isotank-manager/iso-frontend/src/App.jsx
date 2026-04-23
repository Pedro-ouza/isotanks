import { useState } from 'react'
import { Droplet, Home } from 'lucide-react'
import MenuInicial from './screens/MenuInicial'
import RealizarPedido from './screens/RealizarPedido'
import EscolherIsotanks from './screens/EscolherIsotanks'
import GerenciarPedidos from './screens/GerenciarPedidos'
import AprovacaoIsotanks from './screens/AprovacaoIsotanks'
import UploadIsotanks from './screens/UploadIsotanks'

function App() {
  const [currentScreen, setCurrentScreen] = useState('menu')
  const [userProfile, setUserProfile] = useState(null) // 'aprovador' ou 'planejador'

  const navigate = (screen) => {
    setCurrentScreen(screen)
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return <MenuInicial navigate={navigate} setProfile={setUserProfile} profile={userProfile} />
      case 'realizarPedido':
        return <RealizarPedido navigate={navigate} />
      case 'escolherIsotanks':
        return <EscolherIsotanks navigate={navigate} />
      case 'gerenciarPedidos':
        return <GerenciarPedidos navigate={navigate} />
      case 'aprovacaoIsotanks':
        return <AprovacaoIsotanks navigate={navigate} />
      case 'uploadIsotanks':
        return <UploadIsotanks navigate={navigate} />
      default:
        return <MenuInicial navigate={navigate} setProfile={setUserProfile} profile={userProfile} />
    }
  }

  return (
    <div className="app-container">
      {currentScreen !== 'menu' && (
        <nav className="navbar">
          <div className="brand">
            <Droplet size={28} color="var(--primary)" />
            Isotank Manager
            <span className={`badge ${userProfile === 'aprovador' ? 'badge-info' : 'badge-warning'}`} style={{ marginLeft: '1rem' }}>
              {userProfile === 'aprovador' ? 'Aprovador' : 'Planejador'}
            </span>
          </div>
          <div className="nav-links">
            <button className="btn btn-secondary" onClick={() => navigate('menu')}>
              <Home size={18} /> Menu Inicial
            </button>
          </div>
        </nav>
      )}
      <main className="container">
        {renderScreen()}
      </main>
    </div>
  )
}

export default App
