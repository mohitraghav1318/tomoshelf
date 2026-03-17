import { useState } from 'react';
import { X } from 'lucide-react';

const ProgressModal = ({ entry, onClose, onUpdate }) => {
    const [currentPage, setCurrentPage] = useState(entry.currentPage || 0);
    const [updating, setUpdating] = useState(false);

    const totalPages = entry.bookData.pageCount || 0;
    const percentage = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await onUpdate(currentPage);
            onClose();
        } catch (error) {
            alert('Failed to update progress');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-md w-full p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Update Progress</h3>
                        <p className="text-gray-400 text-sm">{entry.bookData.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Current Page
                        </label>
                        <input
                            type="number"
                            min="0"
                            max={totalPages}
                            value={currentPage}
                            onChange={(e) => setCurrentPage(Math.min(parseInt(e.target.value) || 0, totalPages))}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Out of {totalPages} pages ({percentage}% complete)
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="w-full bg-gray-800 rounded-full h-3">
                            <div
                                className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 mb-6">
                        <button
                            type="button"
                            onClick={() => setCurrentPage(Math.floor(totalPages * 0.25))}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded text-sm transition-colors"
                        >
                            25%
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage(Math.floor(totalPages * 0.5))}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded text-sm transition-colors"
                        >
                            50%
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage(Math.floor(totalPages * 0.75))}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded text-sm transition-colors"
                        >
                            75%
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage(totalPages)}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded text-sm transition-colors"
                        >
                            100%
                        </button>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updating}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white py-3 rounded-lg font-semibold transition-colors"
                        >
                            {updating ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProgressModal;