import { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (e) => {

        e.preventDefault();

        try {

            const res = await API.post("/auth/signup", {
                name,
                email,
                password
            });

            // automatically log the user in
            login(res.data.token);

            alert("Welcome to TomoShelf 🎉");

            navigate("/");

        } catch (error) {
            console.error(error);
            alert("Signup failed");
        }
    };

    return (

        <div className="flex items-center justify-center min-h-screen bg-gray-100">

            <form
                onSubmit={handleSignup}
                className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col gap-4"
            >

                <h2 className="text-2xl font-bold text-center">
                    Signup
                </h2>

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                    required
                />

                <button
                    type="submit"
                    className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                >
                    Signup
                </button>

            </form>

        </div>
    );
};

export default Signup;