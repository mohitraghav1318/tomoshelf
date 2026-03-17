import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getShelf, removeBookFromShelf, updateShelfEntry } from '../services/shelfService';
import { BookOpen, Trash2, Edit } from 'lucide-react';
import ProgressModal from '../components/ProgressModal';

const MyShelf = () => {
    const [shelf, setShelf] = useState([]);
    const [allBooks, setAllBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [showProgressModal, setShowProgressModal] = useState(false);
    const { token, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchShelf();
    }, [filter, isAuthenticated]);

    const fetchShelf = async () => {
        setLoading(true);
        try {
            const statusFilter = filter === 'all' ? null : filter;
            const data = await getShelf(token, statusFilter);
            setShelf(data);

            if (filter !== 'all') {
                const allData = await getShelf(token, null);
                setAllBooks(allData);
            } else {
                setAllBooks(data);
            }
        } catch (error) {
            console.error('Failed to fetch shelf:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (entryId) => {
        if (!confirm('Remove this book from your shelf?')) return;

        try {
            await removeBookFromShelf(token, entryId);
            setShelf(shelf.filter(entry => entry._id !== entryId));
        } catch (error) {
            console.error('Failed to remove book:', error);
            alert(error.message);
        }
    };

    const handleStatusChange = async (entryId, newStatus) => {
        try {
            await updateShelfEntry(token, entryId, { status: newStatus });
            fetchShelf();
        } catch (error) {
            console.error('Failed to update status:', error);
            alert(error.message);
        }
    };

    const handleUpdateProgress = async (entryId, currentPage) => {
        try {
            await updateShelfEntry(token, entryId, { currentPage });
            fetchShelf();
        } catch (error) {
            console.error('Failed to update progress:', error);
            throw error;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'reading':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/50';
            case 'completed':
                return 'bg-green-500/10 text-green-400 border-green-500/50';
            case 'want-to-read':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/50';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/50';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'reading': return 'Reading';
            case 'completed': return 'Completed';
            case 'want-to-read': return 'Want to Read';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 pb-12">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">My Shelf</h1>
                    <p className="text-gray-400">Track and organize your reading journey</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Total Books</p>
                        <p className="text-3xl font-bold text-white">{allBooks.length}</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Reading</p>
                        <p className="text-3xl font-bold text-blue-400">
                            {allBooks.filter((e) => e.status === 'reading').length}
                        </p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Completed</p>
                        <p className="text-3xl font-bold text-green-400">
                            {allBooks.filter((e) => e.status === 'completed').length}
                        </p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                        <p className="text-gray-400 text-sm mb-1">Want to Read</p>
                        <p className="text-3xl font-bold text-purple-400">
                            {allBooks.filter((e) => e.status === 'want-to-read').length}
                        </p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto">
                    {[
                        { key: 'all', label: 'All Books' },
                        { key: 'reading', label: 'Reading' },
                        { key: 'completed', label: 'Completed' },
                        { key: 'want-to-read', label: 'Want to Read' }
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                                filter === tab.key
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Shelf Grid */}
                {shelf.length === 0 ? (
                    <div className="text-center py-20">
                        <BookOpen className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">
                            No books {filter !== 'all' && `in "${getStatusLabel(filter)}"`}
                        </h3>
                        <p className="text-gray-500 mb-6">Start adding books to your shelf!</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Discover Books
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shelf.map((entry) => (
                            <div
                                key={entry._id}
                                className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-purple-500 transition-all"
                            >
                                <div className="flex gap-4 p-4">
                                    {/* Book Cover */}
                                    <div
                                        className="w-24 h-36 bg-gray-800 rounded overflow-hidden flex-shrink-0 cursor-pointer"
                                        onClick={() => navigate(`/book/${entry.bookId}`)}
                                    >
                                        {entry.bookData.thumbnail ? (
                                            <img
                                                src={entry.bookData.thumbnail.replace('http://', 'https://')}
                                                alt={entry.bookData.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <BookOpen className="w-8 h-8 text-gray-700" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Book Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3
                                            className="font-semibold text-white text-sm line-clamp-2 mb-1 cursor-pointer hover:text-purple-400"
                                            onClick={() => navigate(`/book/${entry.bookId}`)}
                                        >
                                            {entry.bookData.title}
                                        </h3>
                                        <p className="text-gray-400 text-xs mb-3">
                                            {entry.bookData.authors?.join(', ')}
                                        </p>

                                        {/* Status Dropdown */}
                                        <select
                                            value={entry.status}
                                            onChange={(e) => handleStatusChange(entry._id, e.target.value)}
                                            className={`w-full px-3 py-1.5 rounded border text-xs font-medium mb-2 ${getStatusColor(entry.status)} bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                        >
                                            <option value="want-to-read">Want to Read</option>
                                            <option value="reading">Reading</option>
                                            <option value="completed">Completed</option>
                                        </select>

                                        {/* Progress (if reading) */}
                                        {entry.status === 'reading' && entry.bookData.pageCount && (
                                            <div className="mb-2">
                                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                    <span>Progress</span>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedEntry(entry);
                                                            setShowProgressModal(true);
                                                        }}
                                                        className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                                                    >
                                                        <Edit className="w-3 h-3" />
                                                        Update
                                                    </button>
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                    <span>{entry.currentPage} / {entry.bookData.pageCount} pages</span>
                                                    <span>{Math.round((entry.currentPage / entry.bookData.pageCount) * 100)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-800 rounded-full h-1.5">
                                                    <div
                                                        className="bg-purple-600 h-1.5 rounded-full"
                                                        style={{
                                                            width: `${Math.min(
                                                                (entry.currentPage / entry.bookData.pageCount) * 100,
                                                                100
                                                            )}%`
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemove(entry._id)}
                                            className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Progress Modal — rendered outside the grid to avoid z-index issues */}
            {showProgressModal && selectedEntry && (
                <ProgressModal
                    entry={selectedEntry}
                    onClose={() => {
                        setShowProgressModal(false);
                        setSelectedEntry(null);
                    }}
                    onUpdate={(currentPage) =>
                        handleUpdateProgress(selectedEntry._id, currentPage)
                    }
                />
            )}
        </div>
    );
};

export default MyShelf;