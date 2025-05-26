const express = require("express");
const router = express.Router();
const {
  createAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");
const authenticateToken = require("../middleware/authMiddleware");

// Apply authentication to all routes below
router.use(authenticateToken);

// Create new address
router.post("/", createAddress);

// Get all addresses for logged-in user (we’ll get userId from token, not param)
router.get("/", getUserAddresses);

// Update an address (make sure to check ownership inside controller)
router.put("/:addressId", updateAddress);

// Delete an address (check ownership inside controller)
router.delete("/:addressId", deleteAddress);

// Set default address (check ownership inside controller)
router.patch("/set-default/:addressId", setDefaultAddress);

module.exports = router;
