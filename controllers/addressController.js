const Address = require("../models/Address");

// Create new address
exports.createAddress = async (req, res) => {
  try {
    const { name, address, city, country, postalCode, phone, isDefault } = req.body;

    // If marked as default, unset other defaults
    if (isDefault) {
      await Address.updateMany(
        { userId: req.user.id },
        { $set: { isDefault: false } }
      );
    }

    const newAddress = await Address.create({
      userId: req.user.id,
      name,
      address,
      city,
      country,
      postalCode,
      phone,
      isDefault,
    });

    res.status(201).json(newAddress);
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ message: "Failed to create address" });
  }
};

// Get all addresses for logged-in user
exports.getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const address = await Address.findOne({ _id: addressId, userId: req.user.id });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    const { name, address: addr, city, country, postalCode, phone, isDefault } = req.body;

    // If setting this one as default, unset others
    if (isDefault) {
      await Address.updateMany(
        { userId: req.user.id },
        { $set: { isDefault: false } }
      );
    }

    address.name = name || address.name;
    address.address = addr || address.address;
    address.city = city || address.city;
    address.country = country || address.country;
    address.postalCode = postalCode || address.postalCode;
    address.phone = phone || address.phone;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await address.save();

    res.json(address);
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Failed to update address" });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const address = await Address.findOneAndDelete({
      _id: addressId,
      userId: req.user.id,
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Failed to delete address" });
  }
};

// Set default address
exports.setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const address = await Address.findOne({ _id: addressId, userId: req.user.id });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Unset previous defaults
    await Address.updateMany(
      { userId: req.user.id },
      { $set: { isDefault: false } }
    );

    // Set this address as default
    address.isDefault = true;
    await address.save();

    res.json({ message: "Default address set successfully", address });
  } catch (error) {
    console.error("Error setting default address:", error);
    res.status(500).json({ message: "Failed to set default address" });
  }
};
