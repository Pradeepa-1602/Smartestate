const router = require("express").Router();
const ctrl = require("../controllers/enquiryController");

router.post("/add", ctrl.add);

// ✅ IMPORTANT: specific route FIRST
router.get("/buyer/:buyer_id", ctrl.getByBuyer);

// ✅ general route LAST
router.get("/:owner_id", ctrl.getByOwner);

module.exports = router;