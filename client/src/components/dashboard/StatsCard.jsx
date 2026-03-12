import React from "react";

const StatsCard = ({ title, value }) => {
    return (
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
            <p className="text-3xl font-bold">{value}</p>
            <p className="mt-2 text-gray-600">{title}</p>
        </div>
    );
};

export default StatsCard;
