import { useState } from 'react';

// Props:
//   rating   → current saved rating (0 = none, 1–5 = stars)
//   onChange → function to call when user picks a star
//              if you DON'T pass onChange, it's read-only (display mode)
//   size     → 'sm' for shelf cards, 'lg' for book detail page

const StarRating = ({ rating = 0, onChange, size = 'sm' }) => {
    // hovered tracks which star the mouse is currently over
    // we use this to show a "preview" before the user clicks
    const [hovered, setHovered] = useState(0);

    const isInteractive = typeof onChange === 'function';
    const starSize = size === 'lg' ? 28 : 18;

    // active = what to show right now:
    //   if hovering → show hovered preview
    //   else        → show the saved rating
    const active = hovered || rating;

    const handleClick = (n) => {
        if (!isInteractive) return;
        // clicking the same star again = clear the rating (toggle off)
        onChange(n === rating ? 0 : n);
    };

    return (
        <div
            className="flex items-center gap-0.5"
            onMouseLeave={() => isInteractive && setHovered(0)}
        >
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    disabled={!isInteractive}
                    onClick={() => handleClick(n)}
                    onMouseEnter={() => isInteractive && setHovered(n)}
                    className={`bg-transparent border-0 p-0 leading-none transition-transform
                        ${isInteractive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                >
                    <svg
                        width={starSize}
                        height={starSize}
                        viewBox="0 0 24 24"
                        // filled amber if n ≤ active, outline gray otherwise
                        fill={n <= active ? '#f59e0b' : 'none'}
                        stroke={n <= active ? '#f59e0b' : '#6b7280'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                </button>
            ))}
        </div>
    );
};

export default StarRating;