import { Link } from "react-router-dom";

const CollectionCard = ({ title, link }) => {
    return (
        <Link
            to={link}
            className="bg-white shadow p-6 rounded-lg hover:shadow-lg block"
        >
            <h2 className="text-xl font-semibold">{title}</h2>
        </Link>
    );
};

export default CollectionCard;