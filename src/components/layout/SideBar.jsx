import {Link, useNavigate} from "react-router-dom";

export function SideBar({isOpen, onClose, onLogout, role}){
    const navigate = useNavigate();
    const handleLogout = ()=> {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        onLogout();
        onClose();
        navigate("/");
    }
    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-40 duration-300 ${isOpen ? 'block' : 'hidden'}`}
                 onClick={onClose}/>
            <aside className={`fixed top-0 h-screen w-44 bg-zinc-900 flex flex-col gap-3 p-4 z-50 transition-all 
            duration-300 ${isOpen ? 'left-0' : '-left-64'}`}>
                <h2>Menu</h2>
                <Link to="/" onClick={onClose} className="text-zinc-300 hover:text-white hover:bg-zinc-700
                px-3 py-2 rounded-md transition-colors">Inicio</Link>
                {role === 'ADMIN' && (
                    <>
                    <Link to="/turnos" onClick={onClose} className="text-zinc-300 hover:text-white
                    hover:bg-zinc-700 px-3 py-2 rounded-md transition-colors">Turnos</Link>
                    <Link to="/clientes" onClick={onClose} className="text-zinc-300 hover:text-white
                    hover:bg-zinc-700 px-3 py-2 rounded-md transition-colors">Clientes</Link>
            <Link to="/masajes" onClick={onClose} className="text-zinc-300 hover:text-white hover:bg-zinc-700
                px-3 py-2 rounded-md transition-colors">Masajes</Link>
                    </>
                )}
                <div className="mt-auto flex flex-col gap-2">
                    <Link to="/configuracion" onClick={onClose} className="text-zinc-500 hover:text-white
                hover:bg-zinc-800 px-1 py-2 rounded-md transition-colors">⚙️ Config</Link>
                    <button onClick={handleLogout} className="text-red-300 text-sm text-left w-full px-3 py-2
                    rounded-md hover:bg-zinc-800 transition-colors">Cerrar sesión</button>
                </div>
            </aside>
            </>
    )
}