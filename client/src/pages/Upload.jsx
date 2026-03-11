import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const Upload = () => {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [coverImage, setCoverImage] = useState(null);
    const [pdf, setPdf] = useState(null);

    const handleUpload = async (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append("title", title);
        formData.append("description", description);
        formData.append("cover", coverImage);
        formData.append("pdf", pdf);

        try {

            await API.post("/books/uploads", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            alert("Book uploaded successfully");

            navigate("/");

        } catch (error) {
            console.error(error);
            alert("Upload failed");
        }
    };

    return (

        <div className="max-w-xl mx-auto py-10 px-6">

            <h1 className="text-3xl font-bold mb-6">
                Upload Book
            </h1>

            <form
                onSubmit={handleUpload}
                className="flex flex-col gap-4"
            >

                <input
                    type="text"
                    placeholder="Book Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 rounded"
                    required
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 rounded"
                    rows="4"
                />

                <label className="font-medium">
                    Cover Image
                </label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverImage(e.target.files[0])}
                    required
                />

                <label className="font-medium">
                    PDF File
                </label>

                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdf(e.target.files[0])}
                    required
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 rounded"
                >
                    Upload Book
                </button>

            </form>

        </div>
    );
};

export default Upload;