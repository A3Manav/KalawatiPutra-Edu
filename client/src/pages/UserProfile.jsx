import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {User, Mail, Book, Link, Edit, Save, CameraIcon} from "lucide-react";
import StreakCalendar from "../components/StreakCalendar";

export default function UserProfile() {
	const editProfileRef = useRef(null);
	const [user, setUser] = useState(null);
	const [formData, setFormData] = useState({
		college: "",
		skills: "",
		socialLinks: { linkedin: "", github: "", twitter: "" },
		about: "",
	});
	const [profileImage, setProfileImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const VITE_API_URL =
		import.meta.env.VITE_API_URL || "http://localhost:5000/api";

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await axios.get(`${VITE_API_URL}/auth/profile`, {
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				});
				setUser(res.data);
				setFormData({
					college: res.data.college || "",
					skills: res.data.skills?.join(", ") || "",
					socialLinks: res.data.socialLinks || {
						linkedin: "",
						github: "",
						twitter: "",
					},
					about: res.data.about || "",
				});
			} catch (err) {
				console.error("Error fetching profile:", err);
				toast.error("Failed to load profile");
			}
		};
		fetchProfile();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		if (name in formData.socialLinks) {
			setFormData({
				...formData,
				socialLinks: { ...formData.socialLinks, [name]: value },
			});
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const fileTypes = /jpeg|jpg|png/;
			const extname = fileTypes.test(file.name.toLowerCase());
			const mimetype = fileTypes.test(file.type);
			if (!extname || !mimetype) {
				toast.error("Only JPEG, JPG, or PNG images are allowed");
				return;
			}
			setProfileImage(file);
			openImageCropDialog();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const data = new FormData();
		data.append("college", formData.college);
		data.append("skills", formData.skills);
		data.append("socialLinks", JSON.stringify(formData.socialLinks));
		data.append("about", formData.about);
		if (profileImage) data.append("profileImage", profileImage);

		try {
			const res = await axios.put(`${VITE_API_URL}/auth/profile`, data, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "multipart/form-data",
				},
			});
			setUser(res.data);
			setIsEditing(false);
			toast.success("Profile updated successfully!");
		} catch (err) {
			console.error("Error updating profile:", err);
			toast.error("Failed to update profile");
		} finally {
			setLoading(false);
		}
	};

	const openImageCropDialog = () => {
		// TODO: Implement the profile image crop functionality
		alert("TODO: Open Image Crop Dialog");
	};

	if (!user)
		return (
			<div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
				Loading...
			</div>
		);

	return (
		<div className="bg-gray-900 text-gray-100 min-h-screen">
			<ToastContainer
				position="top-center"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				toastStyle={{
					backgroundColor: '#1f2937',
					color: '#ffffff',
					borderRadius: '8px',
					border: '1px solid #374151',
					padding: '8px',
					minHeight: '40px',
					width: '280px',
				}}
				style={{ width: '320px' }}
			/>
			<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
				<header className="mb-8">
					<h1 className="text-4xl font-bold text-center text-emerald-400 tracking-tight">
						Your Profile
					</h1>
					<div className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-700 w-32 mx-auto mt-4 rounded-full" />
				</header>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column: Profile Image and Basic Info */}
					<div className="lg:col-span-1 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6">
						<div className="flex flex-col items-center">
							<div className="relative group mb-6 rounded-full border-4 border-emerald-600 overflow-hidden">
								<img
									src={user.profileImage || 'https://via.placeholder.com/150'}
									alt="Profile"
									className="w-32 h-32 object-cover"
								/>
								<input ref={editProfileRef} onChange={handleImageChange} type="file" accept="image/*" className="hidden"/>
								<button onClick={() => editProfileRef.current.click()} className="grid place-content-center absolute bottom-0 h-10 w-full bg-emerald-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
									<CameraIcon className="text-white"/>
								</button>
							</div>
							<h2 className="text-2xl font-semibold text-white mb-2">{user.name}</h2>
							<p className="text-gray-400 flex items-center gap-2">
								<Mail size={16} className="text-emerald-400" /> {user.email}
							</p>
						</div>
					</div>

					{/* Right Column: Profile Details or Edit Form */}
					<div className="lg:col-span-2 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6">
						{isEditing ? (
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-300 mb-2">
											College
										</label>
										<div className="relative">
											<span className="absolute inset-y-0 left-0 flex items-center pl-4">
												<Book size={18} className="text-emerald-400" />
											</span>
											<input
												type="text"
												name="college"
												value={formData.college}
												onChange={handleInputChange}
												className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
												placeholder="Enter your college"
											/>
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-300 mb-2">
											Skills (comma-separated)
										</label>
										<input
											type="text"
											name="skills"
											value={formData.skills}
											onChange={handleInputChange}
											className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
											placeholder="e.g., JavaScript, Python, React"
										/>
									</div>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-300 mb-2">
											LinkedIn
										</label>
										<div className="relative">
											<span className="absolute inset-y-0 left-0 flex items-center pl-4">
												<Link size={18} className="text-emerald-400" />
											</span>
											<input
												type="text"
												name="linkedin"
												value={formData.socialLinks.linkedin}
												onChange={handleInputChange}
												className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
												placeholder="LinkedIn URL"
											/>
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-300 mb-2">
											GitHub
										</label>
										<div className="relative">
											<span className="absolute inset-y-0 left-0 flex items-center pl-4">
												<Link size={18} className="text-emerald-400" />
											</span>
											<input
												type="text"
												name="github"
												value={formData.socialLinks.github}
												onChange={handleInputChange}
												className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
												placeholder="GitHub URL"
											/>
										</div>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Twitter
									</label>
									<div className="relative">
										<span className="absolute inset-y-0 left-0 flex items-center pl-4">
											<Link size={18} className="text-emerald-400" />
										</span>
										<input
											type="text"
											name="twitter"
											value={formData.socialLinks.twitter}
											onChange={handleInputChange}
											className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
											placeholder="Twitter URL"
										/>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										About
									</label>
									<textarea
										name="about"
										value={formData.about}
										onChange={handleInputChange}
										className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
										placeholder="Tell us about yourself"
										rows={5}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-300 mb-2">
										Profile Image
									</label>
									<input
										type="file"
										accept="image/jpeg,image/jpg,image/png"
										onChange={handleImageChange}
										className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 file:bg-emerald-600 file:text-white file:border-none file:px-4 file:py-2 file:rounded-lg file:hover:bg-emerald-500 transition-all"
									/>
								</div>
								<div className="flex justify-between gap-4">
									<button
										type="button"
										onClick={() => setIsEditing(false)}
										className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-500 transition-all flex items-center justify-center gap-2"
									>
										Cancel
									</button>
									<button
										type="submit"
										className={`flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
										disabled={loading}
									>
										<Save size={18} />
										{loading ? 'Saving...' : 'Save Changes'}
									</button>
								</div>
							</form>
						) : (
							<div className="space-y-6">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="flex items-center gap-3">
										<Book size={18} className="text-emerald-400" />
										<div>
											<span className="text-gray-300 font-medium">College: </span>
											<span className="text-gray-100">{user.college || 'Not set'}</span>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<User size={18} className="text-emerald-400" />
										<div>
											<span className="text-gray-300 font-medium">Skills: </span>
											<span className="text-gray-100">
												{user.skills?.length > 0 ? user.skills.join(', ') : 'Not set'}
											</span>
										</div>
									</div>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="flex items-center gap-3">
										<Link size={18} className="text-emerald-400" />
										<div>
											<span className="text-gray-300 font-medium">LinkedIn: </span>
											{user.socialLinks?.linkedin ? (
												<a
													href={user.socialLinks.linkedin}
													className="text-emerald-400 hover:underline"
													target="_blank"
													rel="noopener noreferrer"
												>
													{user.socialLinks.linkedin}
												</a>
											) : (
												<span className="text-gray-100">Not set</span>
											)}
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Link size={18} className="text-emerald-400" />
										<div>
											<span className="text-gray-300 font-medium">GitHub: </span>
											{user.socialLinks?.github ? (
												<a
													href={user.socialLinks.github}
													className="text-emerald-400 hover:underline"
													target="_blank"
													rel="noopener noreferrer"
												>
													{user.socialLinks.github}
												</a>
											) : (
												<span className="text-gray-100">Not set</span>
											)}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<Link size={18} className="text-emerald-400" />
									<div>
										<span className="text-gray-300 font-medium">Twitter: </span>
										{user.socialLinks?.twitter ? (
											<a
												href={user.socialLinks.twitter}
												className="text-emerald-400 hover:underline"
												target="_blank"
												rel="noopener noreferrer"
											>
												{user.socialLinks.twitter}
											</a>
										) : (
											<span className="text-gray-100">Not set</span>
										)}
									</div>
								</div>
								<div className="flex items-start gap-3">
									<User size={18} className="text-emerald-400" />
									<div>
										<span className="text-gray-300 font-medium">About: </span>
										<span className="text-gray-100">{user.about || 'Not set'}</span>
									</div>
								</div>
								<button
									onClick={() => setIsEditing(true)}
									className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
								>
									<Edit size={18} />
									Edit Profile
								</button>
							</div>
						)}
					</div>

					{/* Full-width Streak Calendar */}
					<div className="lg:col-span-3">
						<StreakCalendar streaks={user?.streaks || []} />
					</div>
				</div>
			</div>
		</div>
	);
}