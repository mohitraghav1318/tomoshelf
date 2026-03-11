const BookCardSkeleton = () => {
    return (
        <div className="bg-gray-200 animate-pulse rounded-lg p-4">

            <div className="h-48 bg-gray-300 rounded-md"></div>

            <div className="mt-4 h-4 bg-gray-300 rounded w-3/4"></div>

            <div className="mt-2 h-3 bg-gray-300 rounded w-1/2"></div>

        </div>
    );
};

export default BookCardSkeleton;