const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const passport = require("passport");

const Goodie = require("./models/Goodie");
const Order = require("./models/Order");
const Razorpay = require("razorpay");

dotenv.config();
const app = express();

require("./config/passport");

const cloudinary = require("cloudinary").v2;


// Middleware
// app.use(cors());
app.use(
	cors({
		origin: [
			"https://kalawatiputra.vercel.app",
			"https://kalawatiputra.com",
		],
	})
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET,
});





// Routes
const subscribeRoutes = require("./routes/subscribe");
const articleRoutes = require("./routes/articles");
const courseRoutes = require("./routes/courses");
const authRoutes = require("./routes/auth");
const adminArticleRoutes = require("./routes/admin/articles");
const adminCourseRoutes = require("./routes/admin/courses");
const roadmapRoutes = require("./routes/admin/roadmapRoutes");
const collegeRoutes = require("./routes/admin/collegeRoutes");
const counselingRoutes = require("./routes/admin/counselingRoutes");
const dsapracticeRoutes = require("./routes/admin/dsapracticeRoutes");
const internshipRoutes = require("./routes/admin/internshipRoutes");
const mentorshipRoutes = require("./routes/admin/mentorshipRoutes");
const chatbotRoutes = require("./routes/chatbot");
const resumeRoutes = require("./routes/resume");
const admissionRoutes = require("./routes/admissionRoutes");

const certificateRoutes = require("./routes/certificate");
const workshopCertificateRoutes = require("./routes/workshopCertificates");
const adminWorkshopRoutes = require("./routes/admin/workshop");
const welcomeCertificatesRouter = require("./routes/welcomeCertificates");

const dsaCertificateRoutes = require("./routes/certificate");
const streakRoutes = require("./routes/streak");
const issueRoutes = require("./routes/issueRoutes");

const contactRoutes = require("./routes/contactRoutes");

const goodiesRoutes = require("./routes/goodies");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

// Dynamic Sitemap
const Article = require("./models/Article");
const Course = require("./models/Course");



// Use routes
app.use("/api/subscribe", subscribeRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", authRoutes);
app.use("/api/admin/articles", adminArticleRoutes);
app.use("/api/admin/courses", adminCourseRoutes);
app.use("/api/admin/roadmaps", roadmapRoutes);
app.use("/api/admin/colleges", collegeRoutes);
app.use("/api/admin/counseling", counselingRoutes);
app.use("/api/admin/dsapractice", dsapracticeRoutes);
app.use("/api/admin/internships", internshipRoutes);
app.use("/api/admin/mentorships", mentorshipRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api", admissionRoutes);
app.use("/api/certificates", dsaCertificateRoutes);
app.use("/api", contactRoutes);

app.use("/api/goodies", goodiesRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// app.use('/api/certificates', certificateRoutes);
// app.use('/api/workshop-certificates', workshopCertificateRoutes);
// app.use('/api/admin/workshop', adminWorkshopRoutes);
// app.use('/api/welcome-certificates', welcomeCertificatesRouter);

// Middleware to set certificate type based on route
const setCertificateType = (type) => (req, res, next) => {
	if (!req.query.type) {
		req.query.type = type; // Set type if not provided in query
	}
	next();
};

// Routes for certificates
app.use("/api/certificates", setCertificateType("DSA"), certificateRoutes);
app.use(
	"/api/welcome-certificates",
	setCertificateType("Welcome"),
	certificateRoutes
);
app.use(
	"/api/workshop-certificates",
	setCertificateType("Workshop"),
	certificateRoutes
);

// Admin workshop routes (unchanged)
app.use("/api/admin/workshop", adminWorkshopRoutes);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/streak", streakRoutes);
app.use("/api/issues", issueRoutes);

// Serve static files and handle SPA routing
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../client/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
	});
}

// MongoDB connection
const connectDB = async () => {
	try {
		
		await mongoose.connect(process.env.MONGO_URI, dbOptions);
		console.log("MongoDB connected");
	} catch (err) {
		console.error("MongoDB connection error:", err.message);
		process.exit(1);
	}
};
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
