import { useState, useContext } from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {

    const [open, setOpen] = useState(false);

    const { token, logout } = useContext(AuthContext);

    return (
        <nav className="w-full bg-black text-white px-6 py-4">

            <div className="flex items-center justify-between">

                {/* Logo */}
                <Link to="/">
                    <h1 className="text-2xl font-bold">TomoShelf</h1>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-4">

                    <input
                        type="text"
                        placeholder="Search books..."
                        className="px-4 py-2 rounded text-black"
                    />

                    {!token && (
                        <>
                            <Link to="/login">
                                <button className="bg-gray-700 px-4 py-2 rounded">
                                    Login
                                </button>
                            </Link>

                            <Link to="/signup">
                                <button className="bg-blue-500 px-4 py-2 rounded">
                                    Signup
                                </button>
                            </Link>
                        </>
                    )}

                    {token && (
                        <>
                            <Link to="/upload">
                                <button className="bg-blue-500 px-4 py-2 rounded">
                                    Upload
                                </button>
                            </Link>

                            <Link to="/dashboard">
                                <button className="bg-gray-700 px-4 py-2 rounded">
                                    Dashboard
                                </button>
                            </Link>
                        </>
                    )}

                </div>

                {/* Hamburger */}
                <button
                    className="md:hidden"
                    onClick={() => setOpen(!open)}
                >
                    <Menu size={28} />
                </button>

            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="flex flex-col gap-4 mt-4 md:hidden">

                    <input
                        type="text"
                        placeholder="Search books..."
                        className="px-4 py-2 rounded text-black"
                    />

                    {!token && (
                        <>
                            <Link to="/login">
                                <button className="bg-gray-700 px-4 py-2 rounded w-full">
                                    Login
                                </button>
                            </Link>

                            <Link to="/signup">
                                <button className="bg-blue-500 px-4 py-2 rounded w-full">
                                    Signup
                                </button>
                            </Link>
                        </>
                    )}

                    {token && (
                        <>
                            <Link to="/upload">
                                <button className="bg-blue-500 px-4 py-2 rounded w-full">
                                    Upload
                                </button>
                            </Link>

                            <Link to="/dashboard">
                                <button className="bg-gray-700 px-4 py-2 rounded">
                                    Dashboard
                                </button>
                            </Link>
                        </>
                    )}

                </div>
            )}

        </nav>
    );
}

export default Navbar;