const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../controllers/propertyController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// GET
router.get("/", controller.getAll);

// ADD PROPERTY (WITH IMAGE)
router.post("/add", upload.single("image"), controller.add);

// DELETE
router.delete("/:id", controller.remove);

module.exports = router;