import './App.css'
import { useState } from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Header} from "./components/layout/Header.jsx";
import {SideBar} from "./components/layout/SideBar.jsx";
import {Dashboard} from "./components/pages/Dashboard.jsx"
import {Turnos} from "./components/pages/Turnos.jsx"
import {Clientes} from "./components/pages/Clientes.jsx"
import {Masajes} from "./components/pages/Masajes.jsx"
import {ClienteDetalle} from "./components/pages/ClienteDetalle.jsx";
import {MasajeDetalle} from "./components/pages/MasajeDetalle.jsx";
import {Login} from "./components/pages/Login.jsx";
import {Configuracion} from "./components/pages/Configuracion.jsx";
export default function App(){
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setRole(null);
  };

  if(!role) return <Login onLogin={setRole}/>;

  return (
      <BrowserRouter>
          <div className="min-h-screen bg-zinc-900">
            <Header onToggleMenu={() => setSidebarOpen(!sidebarOpen)}/>
            <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
                     onLogout={handleLogout} role = {role}/>
            <div className="pt-4 px-4">
              <Routes>
                <Route path="/" element={<Dashboard role = {role}/>}/>
                  {role === 'ADMIN' && (
                      <>
                          <Route path="/turnos" element={<Turnos role = {role}/>}/>
                          <Route path="/clientes" element={<Clientes role = {role}/>}/>
                          <Route path="/clientes/:id" element={<ClienteDetalle role = {role}/>}/>
                          <Route path="/masajes" element={<Masajes role = {role}/>}/>
                          <Route path="/masajes/:id" element={<MasajeDetalle role = {role}/>}/>
                      </>
                  )}
                <Route path="/configuracion" element={<Configuracion onLogout={handleLogout}/>}/>
              </Routes>
            </div>
          </div>
      </BrowserRouter>
  )
}
