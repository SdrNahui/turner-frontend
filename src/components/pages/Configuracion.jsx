import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../api/auth.js';

export function Configuracion({ onLogout }) {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleGuardar = async () => {
        setError('');
        setSuccess('');
        if (!currentPassword) {
            setError('Ingresá tu contraseña actual');
            return;
        }
        if (newPassword && newPassword !== confirmPassword) {
            setError('Las contraseñas nuevas no coinciden');
            return;
        }
        setLoading(true);
        try {
            await changePassword({ currentPassword, newUsername, newPassword });
            setSuccess('Datos actualizados. Iniciá sesión nuevamente.');
            setTimeout(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                onLogout();
                navigate('/');
            }, 2000);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4 max-w-sm">
            <button onClick={() => navigate('/')}
                    className="text-zinc-400 hover:text-white text-sm mb-4 flex items-center gap-1">
                ← Volver
            </button>

            <div className="bg-zinc-800 rounded-xl p-6">
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-4">Configuración</p>

                <div className="flex flex-col gap-3">
                    <div>
                        <p className="text-zinc-400 text-xs mb-1">Contraseña actual</p>
                        <div className="relative">
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={e =>
                                    setCurrentPassword(e.target.value)}
                                placeholder="Contraseña"
                                className="bg-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm w-full pr-10"/>
                            <button
                                type="button" onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400
                                hover:text-white">
                                {showCurrent ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                    <div>
                        <p className="text-zinc-400 text-xs mb-1">Nuevo usuario (opcional)</p>
                        <input value={newUsername}
                               onChange={e => setNewUsername(e.target.value)}
                               placeholder="Dejá vacío para no cambiar"
                               className="bg-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm w-full"/>
                    </div>
                    <div>
                        <p className="text-zinc-400 text-xs mb-1">Nueva contraseña</p>
                        <div className="relative">
                            <input
                                type={showNew ? 'text' : 'password'}
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                placeholder="Contraseña"
                                className="bg-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm w-full pr-10"/>
                            <button
                                type="button" onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400
                                hover:text-white">
                                {showNew ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                    <div>
                        <p className="text-zinc-400 text-xs mb-1">Confirmar nueva contraseña</p>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={e =>
                                    setConfirmPassword(e.target.value)}
                                placeholder="Contraseña"
                                className="bg-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm w-full pr-10"/>
                            <button
                                type="button" onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400
                                hover:text-white">
                                {showConfirm ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-red-400 text-xs">{error}</p>}
                    {success && <p className="text-green-400 text-xs">{success}</p>}

                    <button onClick={handleGuardar} disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 text-sm
                        transition-colors disabled:opacity-50">
                        {loading ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </div>
            </div>
        </div>
    )
}