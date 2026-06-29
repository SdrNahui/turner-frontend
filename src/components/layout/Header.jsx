export function Header({ onToggleMenu }) {
    return (
        <header className="flex items-center p-4 bg-zinc-900 sticky top-0 z-30">
            <button className="text-white bg-zinc-800 px-4 py-2 rounded-md hover:bg-zinc-700 transition-colors"
                    onClick={onToggleMenu}>Menu</button>
            <h1 className="text-white text-2xl ml-4">Turamali Masajes</h1>
        </header>
    )
}