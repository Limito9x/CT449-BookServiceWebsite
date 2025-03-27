const express = require("express");
const { addStaff,getStaff,getAllStaffs,updateStaff,deleteStaff } = require("../controllers/nhanvien.controller")
const router = express.Router();
const { authMiddleware } = require("../controllers/auth.controller");
const { validateRegister } = require("../utils/tool.util");

router.post("/", validateRegister,authMiddleware ,addStaff);
router.get("/:id", getStaff);
router.get("/",getAllStaffs);
router.patch("/:id",authMiddleware,updateStaff);
router.delete("/:id",deleteStaff);

module.exports = router;
