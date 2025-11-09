import React, {useRef, useState} from "react";
import axios from "axios";
import {toast, Toaster} from "sonner";
import {FaRegCircleCheck} from "react-icons/fa6";
import {BiError} from "react-icons/bi";
import {RiErrorWarningLine} from "react-icons/ri";

const ResumeScreening = () => {
    const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    const fileInputRef = useRef(null);
    const [uploadState, setUploadState] = useState({
        file: null,
        loading: false,
        response: null,
        error: null
    });
    const [expandedCategory, setExpandedCategory] = useState(null);

    const toggleCategory = (category) => {
        if (expandedCategory === category) {
            setExpandedCategory(null);
        } else {
            setExpandedCategory(category);
        }
    };

    // Uploading the file to backend
    const uploadFileToServer = async (file) => {
        const formData = new FormData();
        formData.append("resume", file);
        formData.append("userId", localStorage.getItem("userId") || "anonymous");
        await axios.post(`${VITE_API_URL}/resume/upload`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data",
            },
        });
    };

    const handleFileSelection = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.size > 20 * 1024 * 1024) {
            toast.error("File should be less than 20MB");
            return;
        }

        setUploadState({file: selectedFile, loading: true, response: null, error: null});

        const form = new FormData();
        form.append("file", selectedFile);

        try {

            await uploadFileToServer(selectedFile);

            const response = await axios.post(
                "https://api.kalawatiputra.com/resume/screen/v1/",
                form
            );
            setUploadState(prev => ({
                ...prev,
                loading: false,
                response: response.data
            }));
        } catch (error) {
            setUploadState(prev => ({
                ...prev,
                loading: false,
                file: null,
                error: "Something went wrong"
            }));
            toast.error("Something went wrong");
        }
    };

    const {file, loading, response} = uploadState;

    return (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
            <Toaster richColors position="top-right"/>
            <div className="container mx-auto max-w-5xl">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-center text-transparent animate-fade-in bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-600">
                    Resume & Interview Prep
                </h1>
                <p className="text-xl text-gray-300 text-center mb-12 max-w-2xl mx-auto">
                    Enhance your resume with AI-powered suggestions, and prepare for interviews with questions tailored
                    to your resume
                </p>

                {/* Upload Section */}
                {(!file || !response) && (
                    <div
                        className="card flex flex-col justify-center items-center mx-auto px-5 py-8 sm:px-6 sm:py-12 w-full max-w-screen-md border border-dashed border-emerald-800 rounded-2xl">
                        <div className="relative">
                            <div
                                className="absolute top-[30px] left-[40px] text-white text-[10px] uppercase font-normal cursor-default px-[3px] py-0 rounded bg-emerald-500">
                                PDF
                            </div>
                            <svg className="w-[140px]" viewBox="0 0 106 49" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M33.5234 14.6551C33.3603 14.5022 33.1755 14.3509 32.9649 14.1946L18.0591 3.3291C16.9126 2.51404 16.098 2.35237 14.5384 2.5994L4.69428 4.15855C1.1496 4.71997 -0.456046 6.90528 0.111792 10.4905L5.16139 42.3724C5.73243 45.9778 7.89107 47.5462 11.4763 46.9783L33.3115 43.52C35.1186 43.2337 36.417 42.5319 37.1842 41.4424H34.8083C34.3124 41.7228 33.7068 41.9209 32.9931 42.0339L11.2996 45.4698C8.66644 45.8869 7.07092 44.7276 6.65386 42.0944L1.6171 10.2936C1.21609 7.76167 2.35926 6.06488 5.0127 5.64461L15.0999 4.04696L17.121 16.8078C17.4386 18.8131 18.5925 19.5439 20.4763 19.2456L33.1966 17.2309L33.5234 19.2944V14.6551ZM67.2454 41.4424C67.8539 43.0756 69.3233 44.0931 71.6213 44.4571L93.4565 47.9155C97.0215 48.4801 99.2036 46.8947 99.7714 43.3095L102.909 23.4998C103.166 21.8794 103.021 21.0882 102.189 19.9183L91.3703 4.97845C90.5318 3.84899 89.807 3.44351 88.2474 3.19648L78.4033 1.63733C75.4667 1.17222 73.4513 2.17834 72.5234 4.57577V13.1975L73.5809 6.52119C73.9819 3.98928 75.5934 2.72879 78.2469 3.14906L88.334 4.74671L86.3129 17.5076C85.9953 19.5128 86.8669 20.5645 88.7507 20.8628L101.471 22.8775L98.2789 43.0316C97.8619 45.6648 96.2663 46.824 93.6129 46.4037L71.9194 42.9678C70.584 42.7563 69.6277 42.2417 69.0639 41.4424H67.2454ZM89.1032 19.4237C87.9891 19.2473 87.6141 18.7311 87.7906 17.617L89.7347 5.34229L101.337 21.3614L89.1032 19.4237ZM20.3668 17.7679C19.2528 17.9444 18.7366 17.5693 18.5601 16.4553L16.616 4.18057L32.601 15.8302L20.3668 17.7679Z"
                                      fill="#10b981" fillOpacity="0.4"></path>
                                <path
                                    d="M42.27 43.3535H64.3774C67.9868 43.3535 69.894 41.4463 69.894 37.8164V17.7598C69.894 16.1191 69.6274 15.3604 68.6226 14.335L55.6001 1.27148C54.5952 0.287109 53.8159 0 52.2368 0H42.27C38.6812 0 36.7534 1.90723 36.7534 5.53711V37.8164C36.7534 41.4668 38.6401 43.3535 42.27 43.3535ZM42.3315 41.8359C39.6655 41.8359 38.271 40.4414 38.271 37.7754V5.57812C38.271 3.01465 39.6655 1.51758 42.3521 1.51758H52.5649V14.4375C52.5649 16.4678 53.5903 17.3701 55.4976 17.3701H68.3765V37.7754C68.3765 40.4414 66.9819 41.8359 64.2954 41.8359H42.3315ZM55.6206 15.8936C54.4927 15.8936 54.0415 15.4424 54.0415 14.3145V1.88672L68.0073 15.8936H55.6206Z"
                                    fill="#10b981"></path>
                            </svg>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelection}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={loading}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 mt-6 px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                                    <span>Analyzing resume...</span>
                                </>
                            ) : (
                                "Choose resume"
                            )}
                        </button>
                        <p className="text-xs font-light text-emerald-600 mt-5">Max file size: 20MB</p>
                    </div>
                )}

                {/* Response Display */}
                {response && response && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">

                        {/* Left Section */}
                        <div
                            className="lg:col-span-1 flex flex-col gap-3 px-3 sm:px-6 py-8 w-full bg-gray-800/30 backdrop-blur-sm rounded-2xl max-w-3xl mx-auto border border-gray-700">
                            <div className="flex flex-col items-center gap-1 pt-4 pb-8 w-full border-b border-gray-700">
                                <h3 className="text-xl text-white">Your Score</h3>
                                <h2 className={`place-content-center text-4xl font-semibold ${response?.ats?.score >= 85 ? "text-emerald-400" : response?.ats?.score >= 65 ? "text-orange-300" : "text-red-400"} mt-3`}>{response?.ats?.score}/100</h2>
                                {response?.ats?.issues?.length > 0 &&
                                    <p className="text-base text-gray-500 font-light">{response?.ats?.issues?.length} Issues
                                        found</p>}
                            </div>

                            {
                                response?.ats?.issues?.length > 0 && (
                                    <>
                                        <p>Issues</p>
                                        <div className="flex flex-col gap-1.5">
                                            {
                                                response.ats.issues.map((issue, idx) => {
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center gap-2 text-gray-300 capitalize p-2 rounded-md bg-gray-800/50 hover:bg-gray-800 transition-colors">
                                                            <BiError className="text-orange-300"/>
                                                            {issue}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </>
                                )
                            }

                            {
                                response?.ats?.sections && (
                                    <>
                                        <p className="mt-1">Sections</p>
                                        <div className="flex flex-col gap-1.5">
                                            {
                                                Object.entries(response?.ats?.sections)?.map((entry, idx) => {
                                                    const [key, value] = entry;
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center gap-2 text-gray-300 capitalize p-2 rounded-md bg-gray-800/50 hover:bg-gray-800 transition-colors">
                                                            {value === "missing" ? <RiErrorWarningLine color="#e92b4d"/> :
                                                                <FaRegCircleCheck color="#57cda4"/>}
                                                            {key}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </>
                                )
                            }
                        </div>

                        {/* Right Section */}
                        <div className="lg:col-span-2 flex flex-col gap-4">

                            {/* Summary Card */}
                            <div
                                className="flex flex-col gap-3 px-3 sm:px-8 py-8 w-full bg-gray-800/30 backdrop-blur-sm rounded-2xl max-w-3xl mx-auto border border-gray-700">
                                <div className="mb-3">
                                    <h2 className="text-2xl text-emerald-300 font-semibold flex items-center gap-2">
                                        <span className="inline-block w-1.5 h-6 bg-emerald-400 rounded-sm"></span>
                                        Summary
                                    </h2>
                                    <p className="text-base text-emerald-100/80 font-light mt-1">A short summary of your
                                        resume.</p>
                                </div>
                                <p className="text-base text-gray-200">{response?.resumeSummary}</p>
                            </div>

                            {/* Improvement Suggestions Card */}
                            <div
                                className="flex flex-col gap-3 px-3 sm:px-8 py-8 w-full bg-gray-800/30 backdrop-blur-sm rounded-2xl max-w-3xl mx-auto border border-gray-700">
                                <div className="mb-3">
                                    <h2 className="text-2xl text-emerald-300 font-semibold flex items-center gap-2">
                                        <span className="inline-block w-1.5 h-6 bg-emerald-400 rounded-sm"></span>
                                        Improvements
                                    </h2>
                                    <p className="text-base text-emerald-100/80 font-light mt-1">Suggestions to enhance
                                        resume quality and align with industry standards</p>
                                </div>
                                {
                                    response?.improvementSuggestions?.map((improvement, idx) => {
                                        return (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-3 p-3 rounded-md bg-gray-800/50 hover:bg-gray-800 transition-colors">
                                                <span className="font-bold text-emerald-400 min-w-5">•</span>
                                                <p className="text-base text-gray-200">{improvement}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            {/* Interview Questions Card */}
                            <div
                                className="flex flex-col gap-3 px-3 sm:px-8 py-8 w-full bg-gray-800/30 backdrop-blur-sm rounded-2xl max-w-3xl mx-auto border border-gray-700">
                                <div className="mb-3">
                                    <h2 className="text-2xl text-emerald-300 font-semibold flex items-center gap-2">
                                        <span className="inline-block w-1.5 h-6 bg-emerald-400 rounded-sm"></span>
                                        Interview Questions
                                    </h2>
                                    <p className="text-base text-emerald-100/80 font-light mt-1">Practice interview
                                        questions tailored just for you</p>
                                </div>
                                {
                                    Object.entries(response.interviewQuestions).map(([category, categoryQuestions], idx) => {
                                        return (
                                            <div key={idx}
                                                 className="border border-gray-700 rounded-lg overflow-hidden">
                                                <button
                                                    className="w-full px-4 py-3 bg-gray-800/70 hover:bg-gray-800 text-left font-medium text-emerald-200 flex justify-between items-center transition-colors cursor-pointer"
                                                    onClick={() => toggleCategory(category)}
                                                >
                                                    <span className="capitalize">{category}</span>
                                                    <span className="text-xl">
                {expandedCategory === category ? "−" : "+"}
              </span>
                                                </button>

                                                {expandedCategory === category && (
                                                    <div className="p-4 space-y-3 animate-fade-in">
                                                        {categoryQuestions.map((item, qIndex) => (
                                                            <div
                                                                key={qIndex}
                                                                className="flex items-start gap-3 p-3 rounded-md bg-gray-800/50"
                                                            >
                                                                <span
                                                                    className="font-bold text-emerald-400 min-w-5">{qIndex + 1}.</span>
                                                                <p className="text-base text-gray-200">{item.question}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeScreening;
