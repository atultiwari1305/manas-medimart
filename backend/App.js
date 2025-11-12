// External dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const cookies = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");

// Load environment variables from backend/.env
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Import Controllers (if directly used)
const { patientRegister } = require("./src/Routes/userController");
const { createPharmacistReq, searchMedicine } = require("./src/Routes/pharmacistController");
const { addAdmin, viewPatientDet, PatientDetailsResults } = require("./src/Routes/adminController");

// Import Routers
const admin = require("./src/Routers/adminRoute");
const pharmacist = require("./src/Routers/pharmacistRoute");
const patient = require("./src/Routers/patientRoute");
const auth = require("./src/Routers/authRoute");
const cart = require("./src/Routers/cartRoute");
const order = require("./src/Routers/orderRoute");

// Express app setup
const app = express();
app.use(express.static("uploads"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "src/Views"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookies());

// CORS setup
const corsOptions = {
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`✅ User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected", socket.id);
  });
});

// Environment variables
const PORT = process.env.PORT || 8001;
const MongoURI = process.env.MongoURI;

// MongoDB Connection
mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("✅ MongoDB is now connected!");
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// API Routes
app.use("/", auth);
app.use("/pharmacist", pharmacist);
app.use("/admin", admin);
app.use("/patient", patient);
app.use("/cart", cart);
app.use("/order", order);