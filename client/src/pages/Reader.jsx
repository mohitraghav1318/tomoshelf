import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import API from "../api/axios";

import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const Reader = () => {

    const { id } = useParams();

    const [book, setBook] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1);

    const fetchBook = async () => {
        try {
            const res = await API.get(`/books/${id}`);
            setBook(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBook();
    }, [id]);

    const pdfOptions = useMemo(() => ({
        disableRange: true,
        disableStream: true,
        disableAutoFetch: true,
    }), []);

    if (!book) {
        return <div className="text-center py-20">Loading book...</div>;
    }

    // FIX: Use Cloudinary URL directly
    const pdfUrl = book.pdfUrl;

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const pageWidth = Math.min(window.innerWidth - 40, 800);

    const zoomIn = () => {
        setScale(prev => Math.min(prev + 0.2, 3));
    };

    const zoomOut = () => {
        setScale(prev => Math.max(prev - 0.2, 0.6));
    };

    return (
        <div className="flex flex-col items-center py-10 min-h-screen bg-gray-100">

            <h1 className="text-2xl font-bold mb-6">
                {book.title}
            </h1>

            {/* Zoom Controls */}

            <div className="flex gap-4 mb-6">

                <button
                    onClick={zoomOut}
                    className="bg-gray-700 text-white px-3 py-1 rounded"
                >
                    -
                </button>

                <span className="px-2">
                    {Math.round(scale * 100)}%
                </span>

                <button
                    onClick={zoomIn}
                    className="bg-gray-700 text-white px-3 py-1 rounded"
                >
                    +
                </button>

            </div>

            {/* PDF Viewer */}

            <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                options={pdfOptions}
                loading={<p>Loading PDF...</p>}
                error={<p>Failed to load PDF.</p>}
            >
                <Page
                    pageNumber={pageNumber}
                    width={pageWidth}
                    scale={scale}
                />
            </Document>

            {/* Navigation */}

            <div className="flex gap-4 mt-6 items-center">

                <button
                    onClick={() => setPageNumber(prev => prev - 1)}
                    disabled={pageNumber <= 1}
                    className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Prev
                </button>

                <p>
                    Page {pageNumber} of {numPages}
                </p>

                <button
                    onClick={() => setPageNumber(prev => prev + 1)}
                    disabled={pageNumber >= numPages}
                    className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Next
                </button>

            </div>

        </div>
    );
};

export default Reader;