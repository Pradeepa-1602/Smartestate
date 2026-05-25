require('dotenv').config({
  path: process.env.NODE_ENV === 'docker'
    ? '.env.docker'
    : '.env.local'
});
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");

const app = express();

app.use(cors());

// IMPORTANT (for JSON + form fallback)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/enquiries", enquiryRoutes);

app.listen(5000, () => {
  console.log("Server running on 5000");
});