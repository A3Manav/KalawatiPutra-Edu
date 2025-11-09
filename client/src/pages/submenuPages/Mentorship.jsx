import React, { useState, useEffect } from 'react';
import { Mail, Phone, Linkedin, Award, Briefcase } from 'lucide-react';

const Mentorship = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const res = await fetch(`${VITE_API_URL}/admin/mentorships`);
                const data = await res.json();
                setMentors(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, []);

    return (
        <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen py-16 px-4 overflow-x-hidden">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-center mb-12">
                    <span className="bg-gradient-to-r from-gray-300 to-gray-100 text-transparent bg-clip-text">Mentorship Program</span>
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mentors.map((mentor) => (
                            <div
                                key={mentor._id}
                                className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-center mb-6">
                                        {mentor.photo ? (
                                            <img
                                                src={mentor.photo}
                                                alt={mentor.name}
                                                className="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                                                <span className="text-2xl font-bold">
                                                    {mentor.name?.charAt(0) || "M"}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <h2 className="text-xl font-semibold mb-4 text-center text-gray-100">{mentor.name}</h2>

                                    <div className="space-y-3">
                                        {mentor.email && (
                                            <div className="flex items-center text-gray-300">
                                                <Mail size={16} className="mr-2 text-gray-400" />
                                                <span>{mentor.email}</span>
                                            </div>
                                        )}

                                        {mentor.phone && (
                                            <div className="flex items-center text-gray-300">
                                                <Phone size={16} className="mr-2 text-gray-400" />
                                                <span>{mentor.phone}</span>
                                            </div>
                                        )}

                                        {mentor.linkedin && (
                                            <div className="flex items-center text-gray-300">
                                                <Linkedin size={16} className="mr-2 text-gray-400" />
                                                <a
                                                    href={mentor.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 hover:text-blue-300 hover:underline"
                                                >
                                                    LinkedIn Profile
                                                </a>
                                            </div>
                                        )}

                                        {mentor.experience && (
                                            <div className="flex items-center text-gray-300">
                                                <Award size={16} className="mr-2 text-gray-400" />
                                                <span>{mentor.experience}</span>
                                            </div>
                                        )}

                                        {mentor.domain && (
                                            <div className="flex items-center text-gray-300">
                                                <Briefcase size={16} className="mr-2 text-gray-400" />
                                                <span>{mentor.domain}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Mentorship;