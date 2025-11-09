import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CreateCourse from '../courses_pages/CreateCourse.jsx';

function ManageCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [createMode, setCreateMode] = useState(false);
    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get(`${VITE_API_URL}/admin/courses`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setCourses(res.data);
            } catch (err) {
                setError('Failed to load courses');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${VITE_API_URL}/courses`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setCourses([...courses, res.data]);
            setCreateMode(false);
            setFormData({ title: '', description: '', category: '' });
            alert('Course created successfully!');
        } catch (err) {
            setError('Failed to create course');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await axios.delete(`${VITE_API_URL}/courses/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setCourses(courses.filter((course) => course._id !== id));
            } catch (err) {
                setError('Failed to delete course');
            }
        }
    };

    return (
        <div className="bg-[#121212] text-white min-h-screen py-16  px-4">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-center mb-12">Manage Courses</h1>
                {error && <p className="text-red-500 text-center mb-8">{error}</p>}

                <button
                    onClick={() => setCreateMode(!createMode)}
                    className="mb-8 bg-[#4CAF50] text-white px-6 py-3 rounded-lg hover:bg-[#388E3C] transition-transform transform hover:scale-105"
                >
                    {createMode ? 'Cancel' : 'Create New Course'}
                </button>

                {createMode && (
                    <div className="bg-[#1E1E1E] rounded-lg shadow-xl p-8 mb-12">
                        <h2 className="text-2xl font-semibold mb-6">Create Course</h2>
                        {/* <form onSubmit={handleCreateSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-[#2A2A2A] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-colors"
                                    placeholder="Enter course title"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-[#2A2A2A] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-colors"
                                    placeholder="Enter course description"
                                    rows="5"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-[#2A2A2A] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-colors"
                                    placeholder="Enter course category"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#4CAF50] text-white py-3 rounded-lg hover:bg-[#388E3C] transition-transform transform hover:scale-105"
                            >
                                Create Course
                            </button>
                        </form> */}

                        <CreateCourse></CreateCourse>
                    </div>
                )}

                {loading ? (
                    <div className="text-center text-gray-400">Loading courses...</div>
                ) : courses.length === 0 ? (
                    <div className="text-center text-gray-400">No courses available.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-[#1E1E1E] rounded-lg shadow-lg">
                            <thead>
                                <tr className="bg-[#2A2A2A] text-gray-300">
                                    <th className="py-3 px-6 text-left">Title</th>
                                    <th className="py-3 px-6 text-left">Author</th>
                                    <th className="py-3 px-6 text-left">Category</th>
                                    <th className="py-3 px-6 text-left">Created At</th>
                                    <th className="py-3 px-6 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course._id} className="border-b border-gray-700 hover:bg-[#2A2A2A]">
                                        <td className="py-3 px-6">{course.title}</td>
                                        <td className="py-3 px-6">{course.author.name}</td>
                                        <td className="py-3 px-6">{course.category}</td>
                                        <td className="py-3 px-6">{new Date(course.createdAt).toLocaleDateString()}</td>
                                        <td className="py-3 px-6 flex space-x-2">
                                            <Link
                                                to={`/edit-course/${course._id}`}
                                                className="text-[#4CAF50] hover:underline hover:text-[#388E3C] transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(course._id)}
                                                className="text-red-500 hover:underline hover:text-red-400 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageCourses;
