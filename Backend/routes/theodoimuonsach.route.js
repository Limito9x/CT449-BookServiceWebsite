const {
  borrowDelete,
  borrowGetAll,
  borrowGetOne,
  borrowRequest,
  borrowUpdate,
} = require("../controllers/theodoimuonsach.controller");
const {authMiddleware,requireRole} = require("../controllers/auth.controller")
const express = require("express");
const router = express.Router();

router.post("/", authMiddleware, requireRole(["docgia"]), borrowRequest);
router.get(
  "/",
  authMiddleware,
  requireRole(["nhanvien", "admin"]),
  borrowGetAll
);
router.get("/:id", authMiddleware, requireRole(["nhanvien","admin","docgia"]), borrowGetOne);
router.patch(
  "/:id",
  authMiddleware,
  requireRole(["nhanvien", "admin"]),
  borrowUpdate
);
router.delete(
  "/:id",
  authMiddleware,
  requireRole(["nhanvien", "admin"]),
  borrowDelete
);

module.exports = router;