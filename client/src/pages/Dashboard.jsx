import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [editing, setEditing] = useState(false);

    const fetchUser = async () => {
        try {

            const res = await API.get("/users/me");

            setUser(res.data);
            setName(res.data.name);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {

            const res = await API.put("/users/update", {
                name
            });

            setUser(res.data);
            setEditing(false);

            alert("Profile updated successfully");

        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {

        const confirmDelete = window.confirm(
            "Delete your account permanently?"
        );

        if (!confirmDelete) return;

        try {

            await API.delete("/users/delete");

            alert("Your account was deleted. Thanks for using TomoShelf 👋");

            logout();

            navigate("/");

        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {

        alert("Thanks for using TomoShelf 👋");

        logout();

        navigate("/");
    };

    if (!user) {
        return <div className="text-center py-20">Loading...</div>;
    }

    return (

        <div className="max-w-3xl mx-auto py-10 px-6">

            <h1 className="text-3xl font-bold mb-8">
                Dashboard
            </h1>

            {/* Profile Section */}

            <div className="bg-white shadow-md rounded-lg p-6 mb-10">

                <h2 className="text-xl font-semibold mb-4">
                    Profile
                </h2>

                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        className="bg-gray-700 text-white px-4 py-2 rounded mb-4"
                    >
                        Update Profile
                    </button>
                )}

                <form onSubmit={handleUpdate} className="flex flex-col gap-4">

                    <input
                        type="text"
                        value={name}
                        disabled={!editing}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 rounded"
                    />

                    <input
                        type="email"
                        value={user.email}
                        disabled
                        className="border p-2 rounded bg-gray-100"
                    />

                    {editing && (
                        <button
                            className="bg-blue-500 text-white py-2 rounded"
                        >
                            Save Changes
                        </button>
                    )}

                </form>

            </div>


            {/* Danger Zone */}

            <div className="bg-red-50 border border-red-300 rounded-lg p-6">

                <h2 className="text-xl font-semibold text-red-600 mb-4">
                    Danger Zone
                </h2>

                <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Delete Account
                </button>

                <button
                    onClick={handleLogout}
                    className="ml-4 bg-gray-700 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>

            </div>

        </div>
    );
};

export default Dashboard;