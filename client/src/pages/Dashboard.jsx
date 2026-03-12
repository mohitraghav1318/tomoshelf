import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import StatsCard from "../components/dashboard/StatsCard";

const Dashboard = () => {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {

        try {

            const res = await API.get("/users/dashboard");
            setStats(res.data);

        } catch (error) {

            console.error("Error fetching dashboard stats:", error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-20">
                Loading dashboard...
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">

            <h1 className="text-3xl font-bold mb-8">
                Welcome back 👋
            </h1>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-10">
                <StatsCard title="Library Books" value={stats.library} />
                <StatsCard title="Published Books" value={stats.published} />
                <StatsCard title="Achievements" value={stats.achievements} />
                <StatsCard title="Collections" value={stats.collections} />
            </div>

            {/* Navigation */}
            <div className="grid md:grid-cols-2 gap-6">

                <Link
                    to="/library"
                    className="bg-white shadow p-6 rounded-lg hover:shadow-lg transition"
                >
                    My Library
                </Link>

                <Link
                    to="/publisher"
                    className="bg-white shadow p-6 rounded-lg hover:shadow-lg transition"
                >
                    Publisher
                </Link>

                <Link
                    to="/achievements"
                    className="bg-white shadow p-6 rounded-lg hover:shadow-lg transition"
                >
                    Achievements
                </Link>

                <Link
                    to="/profile"
                    className="bg-white shadow p-6 rounded-lg hover:shadow-lg transition"
                >
                    Profile Settings
                </Link>

            </div>

        </div>
    );
};

export default Dashboard;