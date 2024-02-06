const express = require('express');
const router = express.Router();
const userModel = require('../models/users');

router.put('/:id', async function(req, res, next) {
  try {
    const id = req.params.id;

    // Find the user by ID
    const user = await userModel.findById(id);

    // Check if the user exists
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }

    // Update the 'approved' field to true
    user.approved = true;

    // Save the updated user
    const updatedUser = await user.save();

    return res.status(200).send({
      data: updatedUser,
      message: "User approved successfully",
      success: true,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal Server Error",
      success: false,
    });
  }
});

module.exports = router;