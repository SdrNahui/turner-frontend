import {useState} from "react";
import {login} from "../api/auth.js";

export function Login({onLogin}){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if(!username || !password){
        setError('Completa todos los campos');
        return;
        }
       setLoading(true);
        setError('');
        try {
            const data = await login({username, password});
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            onLogin(data.role);
        } catch (e){
            setError(e.message);
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
            <div className="bg-zinc-800 rounded-xl p-8 w-80">
                <div className="flex justify-center mb-4">
                    <img src="/logoTuramali.jpg" className="w-32 h-32 object-contain rounded-full bg-white p-2"/>
                </div>
                <h1 className="text-white text-xl font-medium mb-2">Turamali Masajes</h1>
                <p className="text-zinc-400 text-sm mb-6">Iniciá sesión para continuar</p>



                <div className="flex flex-col gap-3">
                    <input value={username} onChange={e =>
                        setUsername(e.target.value)}
                           placeholder="Usuario"
                           className="bg-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm"/>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            className="bg-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-sm w-full pr-10"/>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white">
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                    {error && (
                        <p className="text-red-500 text-xs text-center bg-red-500/10 py-2 rounded-md">
                            {error}
                        </p>
                    )}
                    <button onClick={handleLogin} disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 text-sm
                        transition-colors disabled:opacity-50">
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </div>
            </div>
        </div>
    )
}