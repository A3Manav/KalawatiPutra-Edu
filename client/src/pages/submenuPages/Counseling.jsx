
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const Counseling = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${VITE_API_URL}/admin/counseling`);
                setPosts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen py-16 px-4 overflow-x-hidden relative">
            {/* Design elements - diagonal lines */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 border-t-4 border-l-4 border-emerald-400 rounded-full"></div>
                <div className="absolute -bottom-40 -right-40 w-96 h-96 border-b-4 border-r-4 border-emerald-400 rounded-full"></div>
            </div>

            <div className="container mx-auto overflow-hidden relative z-10">
                <div className="flex justify-center mb-12">
                    <h1 className="text-4xl font-bold text-center relative">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">Counseling</span>
                        <div className="w-24 h-1 bg-emerald-500 mx-auto mt-3"></div>
                    </h1>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {posts.map((post) => (
                            <div
                                key={post._id}
                                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-xl overflow-hidden hover:shadow-emerald-900/20 hover:shadow-lg transition-all duration-300 border-l-4 border-emerald-500"
                            >
                                <h2 className="text-xl font-semibold mb-3 text-emerald-400">{post.title}</h2>
                                <p className="text-gray-300">{post.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Counseling;