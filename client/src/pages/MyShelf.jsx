import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getShelf, removeBookFromShelf, updateShelfEntry } from '../services/shelfService';
import { BookOpen, Trash2, Edit } from 'lucide-react';
import ProgressModal from '../components/ProgressModal';
import StarRating from '../components/StarRating';
import SkeletonCard from "../components/SkeletonCard";

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
            console.error('Remove failed:', error);
        }
    };

    const handleStatusChange = async (entryId, newStatus) => {
        try {
            await updateShelfEntry(token, entryId, { status: newStatus });
            fetchShelf();
        } catch (error) {
            console.error('Status update failed:', error);
        }
    };

    const handleUpdateProgress = async (entryId, currentPage) => {
        try {
            await updateShelfEntry(token, entryId, { currentPage });
            fetchShelf();
        } catch (error) {
            console.error('Progress update failed:', error);
            throw error;
        }
    };

    const handleRating = async (entryId, rating) => {
        try {
            await updateShelfEntry(token, entryId, { rating });
            fetchShelf();
        } catch (error) {
            console.error('Rating update failed:', error);
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
            <div className="min-h-screen pt-32 px-6 bg-slate-950">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} variant="shelf" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200 pt-32 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">My Shelf</h1>
                    <p className="text-slate-500 font-medium tracking-wide">Track your reading journey</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Total Books', val: allBooks.length, color: 'text-white' },
                        { label: 'Reading', val: allBooks.filter(e => e.status === 'reading').length, color: 'text-blue-500' },
                        { label: 'Completed', val: allBooks.filter(e => e.status === 'completed').length, color: 'text-green-500' },
                        { label: 'Want to Read', val: allBooks.filter(e => e.status === 'want-to-read').length, color: 'text-purple-500' }
                    ].map((s, i) => (
                        <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{s.label}</p>
                            <p className={`text-4xl font-black ${s.color}`}>{s.val}</p>
                        </div>
                    ))}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                        { key: 'all', label: 'All Books' },
                        { key: 'reading', label: 'Reading' },
                        { key: 'completed', label: 'Completed' },
                        { key: 'want-to-read', label: 'Want to Read' }
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all ${
                                filter === tab.key
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'bg-slate-900 text-slate-500 border border-slate-800 hover:bg-slate-800'
                            }`}
                        >
                            {tab.label.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Shelf Grid */}
                {shelf.length === 0 ? (
                    <div className="text-center py-32 bg-slate-900/30 rounded-3xl border border-slate-900/50">
                        <BookOpen className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-300 mb-2">Shelf is empty</h3>
                        <p className="text-slate-500 mb-8 max-w-xs mx-auto">Start searching and adding books to build your personal library.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40"
                        >
                            Discover Books
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shelf.map((entry) => (
                            <div key={entry._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all shadow-xl group">
                                <div className="flex gap-6 p-5">
                                    {/* Book Cover */}
                                    <div className="w-24 h-36 bg-slate-800 rounded-lg overflow-hidden shrink-0 cursor-pointer shadow-md" onClick={() => navigate(`/book/${entry.bookId}`)}>
                                        {entry.bookData.thumbnail ? (
                                            <img
                                                src={entry.bookData.thumbnail.replace('http://', 'https://')}
                                                alt={entry.bookData.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <BookOpen className="w-8 h-8 text-slate-700" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Book Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-white text-sm line-clamp-2 mb-1 hover:text-blue-400 cursor-pointer transition-colors" onClick={() => navigate(`/book/${entry.bookId}`)}>
                                                {entry.bookData.title}
                                            </h3>
                                            <p className="text-slate-500 text-[10px] font-medium truncate mb-2">
                                                {entry.bookData.authors?.join(', ')}
                                            </p>
                                            <div className="mb-3">
                                                <StarRating
                                                    rating={entry.rating || 0}
                                                    onChange={(newRating) => handleRating(entry._id, newRating)}
                                                    size="sm"
                                                />
                                            </div>
                                            <select
                                                value={entry.status}
                                                onChange={(e) => handleStatusChange(entry._id, e.target.value)}
                                                className="w-full bg-slate-800 border-none rounded-lg py-1.5 px-3 text-[10px] font-bold text-white uppercase tracking-widest cursor-pointer focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                            >
                                                <option value="want-to-read">Want to Read</option>
                                                <option value="reading">Reading</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 mt-auto">
                                            <button onClick={() => handleRemove(entry._id)} className="text-slate-600 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                            {entry.status === 'reading' && (
                                                <button 
                                                    onClick={() => { setSelectedEntry(entry); setShowProgressModal(true); }}
                                                    className="flex items-center gap-1.5 px-3 py-1 bg-blue-600/10 text-blue-500 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                                                >
                                                    <Edit size={12} /> {Math.round((entry.currentPage / entry.bookData.pageCount) * 100)}%
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showProgressModal && selectedEntry && (
                <ProgressModal
                    entry={selectedEntry}
                    onClose={() => { setShowProgressModal(false); setSelectedEntry(null); }}
                    onUpdate={(currentPage) => handleUpdateProgress(selectedEntry._id, currentPage)}
                />
            )}
        </div>
    );
};

export default MyShelf;