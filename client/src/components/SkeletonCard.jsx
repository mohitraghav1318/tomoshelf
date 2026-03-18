// src/components/SkeletonCard.jsx
const SkeletonCard = ({ variant = "book" }) => {
    const pulse = "animate-pulse bg-gray-200 dark:bg-gray-700 rounded";

    if (variant === "shelf") {
        return (
            <div className="flex gap-4 p-4 border rounded-xl">
                <div className={`${pulse} w-16 h-24 shrink-0`} />
                <div className="flex-1 space-y-2 py-1">
                    <div className={`${pulse} h-4 w-3/4`} />
                    <div className={`${pulse} h-3 w-1/2`} />
                    <div className={`${pulse} h-3 w-1/4`} />
                </div>
            </div>
        );
    }

    // Default: search result / browse card
    return (
        <div className="flex flex-col gap-2">
            <div className={`${pulse} w-full h-48`} />
            <div className={`${pulse} h-4 w-3/4`} />
            <div className={`${pulse} h-3 w-1/2`} />
        </div>
    );
};

export default SkeletonCard;