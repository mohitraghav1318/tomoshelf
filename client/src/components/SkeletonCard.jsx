// src/components/SkeletonCard.jsx
const SkeletonCard = ({ variant = "book" }) => {
    const pulse = "animate-pulse bg-white/5 border border-white/5 rounded-2xl";
    const shimmer = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

    if (variant === "shelf") {
        return (
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden p-4 flex gap-4">
                {/* Book Cover Skeleton */}
                <div className={`${pulse} ${shimmer} w-24 h-36 shrink-0`} />
                
                {/* Info Skeleton */}
                <div className="flex-1 space-y-4 py-1">
                    <div className="space-y-2">
                        <div className={`${pulse} ${shimmer} h-5 w-3/4`} />
                        <div className={`${pulse} ${shimmer} h-3 w-1/2`} />
                    </div>
                    
                    {/* Star Rating Skeleton */}
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`${pulse} w-3 h-3 rounded-full`} />
                        ))}
                    </div>

                    {/* Status Select Skeleton */}
                    <div className={`${pulse} ${shimmer} h-8 w-full rounded-lg`} />
                    
                    {/* Progress Bar Skeleton */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <div className={`${pulse} h-2 w-16`} />
                            <div className={`${pulse} h-2 w-8`} />
                        </div>
                        <div className={`${pulse} h-2 w-full`} />
                    </div>
                </div>
            </div>
        );
    }

    // Default: search result / browse card (Portrait Book Card)
    return (
        <div className="flex flex-col gap-3">
            <div className={`${pulse} ${shimmer} aspect-[2/3] w-full`} />
            <div className="space-y-2 px-1">
                <div className={`${pulse} ${shimmer} h-4 w-11/12`} />
                <div className={`${pulse} ${shimmer} h-3 w-2/3`} />
            </div>
        </div>
    );
};

export default SkeletonCard;