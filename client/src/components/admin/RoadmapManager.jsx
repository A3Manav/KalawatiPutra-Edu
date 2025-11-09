import React, { useState } from 'react';
import axios from 'axios';
import ItemList from './ItemList';

function RoadmapManager({ roadmaps, setRoadmaps }) {
    const [roadmapForm, setRoadmapForm] = useState({ subject: '', content: '' });
    const [editRoadmap, setEditRoadmap] = useState(null);
    const [files, setFiles] = useState([]);
    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();
            Object.keys(roadmapForm).forEach(key => form.append(key, roadmapForm[key]));
            files.forEach(file => form.append('files', file));
            const response = await axios.post(`${VITE_API_URL}/admin/roadmaps`, form, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setRoadmaps([...roadmaps, response.data]);
            alert('Created successfully');
            setRoadmapForm({ subject: '', content: '' });
            setFiles([]);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
            alert(`Error creating: ${errorMsg}`);
            console.error('Error creating roadmap:', err.response || err);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();
            Object.keys(editRoadmap).forEach(key => form.append(key, editRoadmap[key]));
            files.forEach(file => form.append('files', file));
            const response = await axios.put(`${VITE_API_URL}/admin/roadmaps/${editRoadmap._id}`, form, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setRoadmaps(roadmaps.map(item => item._id === editRoadmap._id ? response.data : item));
            alert('Updated successfully');
            setEditRoadmap(null);
            setFiles([]);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
            alert(`Error updating: ${errorMsg}`);
            console.error('Error updating roadmap:', err.response || err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this roadmap?')) return;
        try {
            await axios.delete(`${VITE_API_URL}/admin/roadmaps/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setRoadmaps(roadmaps.filter(item => item._id !== id));
            alert('Deleted successfully');
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
            alert(`Error deleting: ${errorMsg}`);
            console.error('Error deleting roadmap:', err.response || err);
        }
    };

    return (
        <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-xl mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Manage Roadmaps</h2>
            <ItemList
                items={roadmaps}
                displayField="subject"
                onEdit={setEditRoadmap}
                onDelete={handleDelete}
            />
            {editRoadmap && (
                <div className="mb-8 text-white">
                    <h3 className="text-xl font-semibold mb-2">Edit Roadmap</h3>
                    <form onSubmit={handleEditSubmit}>
                        <input
                            type="text"
                            placeholder="Subject"
                            className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                            value={editRoadmap.subject}
                            onChange={(e) => setEditRoadmap({ ...editRoadmap, subject: e.target.value })}
                        />
                        <textarea
                            placeholder="Content"
                            className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                            value={editRoadmap.content}
                            onChange={(e) => setEditRoadmap({ ...editRoadmap, content: e.target.value })}
                        />
                        <input
                            type="file"
                            multiple
                            accept="image/*,application/pdf"
                            className="mb-4"
                            onChange={(e) => setFiles([...e.target.files])}
                        />
                        <div className="flex gap-4">
                            <button type="submit" className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#388E3C]">
                                Update Roadmap
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditRoadmap(null)}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <h3 className="text-xl font-semibold mb-2 text-white">Create Roadmap</h3>
            <form onSubmit={handleCreateSubmit} className='text-white'>
                <input
                    type="text"
                    placeholder="Subject"
                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                    value={roadmapForm.subject}
                    onChange={(e) => setRoadmapForm({ ...roadmapForm, subject: e.target.value })}
                />
                <textarea
                    placeholder="Content"
                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                    value={roadmapForm.content}
                    onChange={(e) => setRoadmapForm({ ...roadmapForm, content: e.target.value })}
                />
                <input
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    className="mb-4"
                    onChange={(e) => setFiles([...e.target.files])}
                />
                <button type="submit" className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#388E3C]">
                    Create Roadmap
                </button>
            </form>
        </div>
    );
}

export default RoadmapManager;