const express = require("express");
const { registerReader,getReader,getAllReaders,updateReader,deleteReader } = require("../controllers/docgia.controller")
const router = express.Router();
const {
  authMiddleware
} = require("../controllers/auth.controller");
const { validateRegister } = require ("../utils/tool.util")

router.post("/", validateRegister ,registerReader);
router.get("/:id", getReader);
router.get("/",getAllReaders);
router.patch("/:id",authMiddleware,updateReader);
router.delete("/:id",deleteReader);

module.exports = router;
