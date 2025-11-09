import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Image } from 'lucide-react';

const Roadmap = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await axios.get(`${VITE_API_URL}/admin/roadmaps`);
        setRoadmaps(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  const getFileUrl = (file) => {
    if (file.startsWith('http')) return file;
    return `${API_BASE_URL}${file}`;
  };

  // Wave animation component
  const WaveBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute bottom-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#10B981"
          fillOpacity="0.1"
          d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        >
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
              M0,128L48,149.3C96,171,192,213,288,208C384,203,480,149,576,154.7C672,160,768,224,864,229.3C960,235,1056,181,1152,170.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
              M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </path>
      </svg>
    </div>
  );

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-black text-white min-h-screen py-16 px-4 overflow-hidden">
      <WaveBackground />
      <div className="container mx-auto relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600"
        >
          Learning Roadmaps
        </motion.h1>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-emerald-400"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
          </motion.div>
        ) : (
          <div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.2 }}
            >
              {roadmaps.map((roadmap) => (
                <motion.div
                  key={roadmap._id}
                  className="relative bg-gray-900/80 p-6 rounded-xl shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 border border-emerald-500/20 cursor-pointer overflow-hidden"
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => setSelectedRoadmap(roadmap)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <h2 className="relative text-xl font-semibold text-emerald-400">{roadmap.subject}</h2>
                </motion.div>
              ))}
            </motion.div>

            <AnimatePresence>
              {selectedRoadmap && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-gray-900/90 p-8 rounded-xl shadow-2xl border border-emerald-500/30"
                >
                  <h2 className="text-3xl font-bold text-emerald-400 mb-6">{selectedRoadmap.subject}</h2>
                  {selectedRoadmap.content && (
                    <p className="text-gray-300 mb-6 leading-relaxed">{selectedRoadmap.content}</p>
                  )}
                  {selectedRoadmap.files && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedRoadmap.files.map((file, index) => (
                        <motion.div
                          key={index}
                          className="relative"
                          whileHover={{ scale: 1.02 }}
                        >
                          {file.endsWith('.pdf') ? (
                            <a
                              href={getFileUrl(file)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                              <FileText className="w-6 h-6" />
                              <span>View PDF {index + 1}</span>
                            </a>
                          ) : (
                            <div className="relative rounded-lg overflow-hidden">
                              <img
                                src={getFileUrl(file)}
                                alt={`Roadmap ${index}`}
                                className="w-full max-w-md rounded-lg"
                              />
                              <div className="absolute inset-0 bg-emerald-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <Image className="w-8 h-8 text-emerald-400" />
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roadmap;