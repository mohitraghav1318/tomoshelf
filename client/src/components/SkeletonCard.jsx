const SkeletonCard = ({ variant = "book" }) => {
    const pulse = "animate-pulse bg-slate-900 border border-slate-800 rounded-2xl";

    if (variant === "shelf") {
        return (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex gap-6">
                <div className={`${pulse} w-24 h-36 shrink-0`} />
                <div className="flex-1 space-y-4 py-1">
                    <div className="space-y-2">
                        <div className={`${pulse} h-4 w-3/4`} />
                        <div className={`${pulse} h-3 w-1/2`} />
                    </div>
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`${pulse} w-3 h-3 rounded-full`} />
                        ))}
                    </div>
                    <div className={`${pulse} h-8 w-full rounded-lg`} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <div className={`${pulse} aspect-[2/3] w-full`} />
            <div className="space-y-2 px-1">
                <div className={`${pulse} h-4 w-11/12`} />
                <div className={`${pulse} h-3 w-2/3`} />
            </div>
        </div>
    );
};

export default SkeletonCard;