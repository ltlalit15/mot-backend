const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const session = require('express-session');


require('dotenv').config();
const path = require('path');


dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "https://mot-management.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

// ✅ Increase Payload Limit for Base64 Images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 


// ✅ **File Upload Middleware**
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'upload')));
app.use(
    session({
        secret: 'your_secret_key', // Change this to a secure key
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 86400000 }, // 1 day expiration
    })
);

// parse application/json
app.use(bodyParser.json())
// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const staffRoutes = require("./routes/StaffRoutes");
app.use("/api/staff", staffRoutes);



const BookAppoitmentRoutes = require("./routes/BookAppoitmentRoutes");
app.use("/api/bookappoitment", BookAppoitmentRoutes);

const ReviewRoutes = require("./routes/ReviewRoutes");
app.use("/api/review", ReviewRoutes);

const GarageRoutes = require("./routes/GarageRoutes");
app.use("/api/garage", GarageRoutes);

const CalendarRoutes = require("./routes/BookingCalendarRoutes");
app.use("/api/calendar", CalendarRoutes);

const ClientRoutes = require("./routes/ClientManageRoutes");
app.use("/api/client", ClientRoutes);

const vehicleDashboardRoutes = require("./routes/vehicleDashboardRoutes");
app.use("/api/vehicleDashboard", vehicleDashboardRoutes);


const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/category", categoryRoutes);

const leadMagnetRoutes = require("./routes/leadMagnetRoutes");
app.use("/api/leadMagnet", leadMagnetRoutes);

const serviceRoutes = require("./routes/serviceRoutes");
app.use("/api/service", serviceRoutes);

const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
app.use("/api/adminDashboard", adminDashboardRoutes);

const reportDashbaordRoutes = require("./routes/reportDashboardRoutes");
app.use("/api/reportDashboard", reportDashbaordRoutes);

const ManageCustomerRoutes = require("./routes/ManageCustomerRoutes");
app.use("/api/ManageCustomer", ManageCustomerRoutes);

const vehicleRoutes = require("./routes/vehicleRoutes");
app.use("/api/vehicle", vehicleRoutes);

const vehicleBulkRoutes = require("./routes/vehicleBulkRoutes");
app.use("/api/vehicleBulk", vehicleBulkRoutes);

const closedDayRoutes = require("./routes/closedDayRoutes");
app.use("/api/closedDay", closedDayRoutes);

const EmailTemplateRoutes = require("./routes/EmailTemplateRoutes");
app.use("/api/EmailTemplate", EmailTemplateRoutes);

const SystemRoutes = require("./routes/SystemRoutes");
app.use("/api/System", SystemRoutes);

const ActivityRoutes = require("./routes/ActivityRoutes");
app.use("/api/Activity", ActivityRoutes);

const GarageUploadRoutes = require("./routes/GarageUploadRoutes");
app.use("/api/GarageUpload", GarageUploadRoutes);

const GarageReviewRoutes = require("./routes/GarageReviewRoutes");
app.use("/api/GarageReview", GarageReviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


