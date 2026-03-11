import { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {

            const res = await API.post("/auth/login", {
                email,
                password
            });

            // use context login instead of localStorage
            login(res.data.token);

            navigate("/");

        } catch (error) {
            console.error(error);
            alert("Login failed");
        }
    };

    return (

        <div className="flex items-center justify-center min-h-screen bg-gray-100">

            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col gap-4"
            >

                <h2 className="text-2xl font-bold text-center">
                    Login
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 rounded"
                >
                    Login
                </button>

            </form>

        </div>
    );
};

export default Login;