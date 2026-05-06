import './App.css'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ViewerPage from './pages/ViewerPage'
import ScansPage from './pages/ScansPage'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <div className='app'>
        <Header />
        <div className='app-body'>
          <Sidebar />
          <Routes>                                                                                
            <Route path="/" element={<ViewerPage />} />
            <Route path="/scans" element={<ScansPage />} />                                       
          </Routes> 
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
