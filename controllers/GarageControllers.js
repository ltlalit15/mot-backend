const Garage = require("../models/Garage");  
const Staff = require("../models/Staff");
const Service = require("../models/service");
// const Service = require("../models/Service");
const Booking = require("../models/BookAppoitment");
const mongoose = require("mongoose");

exports.createGarage = async (req, res) => {
  try {
    // Create a new garage document using the request body
    const garage = new Garage({
      ...req.body, // Spread all the fields from req.body
      availableService: req.body.availableService || [] // Make sure availableService is assigned correctly
    });

    // Save the garage data
    console.log("Saving garage:", garage);
    await garage.save();

    // Respond with success message and data
    res.status(201).json({
      status: true,
      message: "Garage created successfully",
      data: garage
    });
  } catch (error) {
    console.error("Error creating garage:", error);
    res.status(400).json({
      status: false,
      message: "Failed to create garage",
      error: error.message
    });
  }
};



// exports.getAllGarages = async (req, res) => {
//   try {
//     // Find all garages in the collection
//     const garages = await Garage.find();

//     // If no garages are found, return an empty array
//     if (!garages || garages.length === 0) {
//       return res.status(404).json({
//         status: false,
//         message: "No garages found"
//       });
//     }

//     // Respond with the list of garages
//     res.status(200).json({
//       status: true,
//       message: "Garages retrieved successfully",
//       data: garages
//     });
//   } catch (error) {
//     console.error("Error retrieving garages:", error);
//     res.status(500).json({
//       status: false,
//       message: "Failed to retrieve garages",
//       error: error.message
//     });
//   }
// };





exports.getAllGarages = async (req, res) => {
  try {
    // Find all garages in the collection
    const garages = await Garage.find();

    // If no garages are found, return an empty array
    if (!garages || garages.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No garages found"
      });
    }

    // Count the total number of garages
    const totalGarages = await Garage.countDocuments();

    // Count the total number of staff
    const totalStaff = await Staff.countDocuments();

    // Count the total number of services
    const totalServices = await Service.countDocuments();

    // Respond with the list of garages and counts
    res.status(200).json({
      status: true,
      message: "Garages retrieved successfully",
      data: {
        garages,
        totalGarages,
        totalStaff,
        totalServices
      }
    });
  } catch (error) {
    console.error("Error retrieving garages:", error);
    res.status(500).json({
      status: false,
      message: "Failed to retrieve garages",
      error: error.message
    });
  }
};



exports.editGarage = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedGarage = await Garage.findByIdAndUpdate(
      id,
      {
        ...req.body,
        availableService: req.body.availableService || [],
      },
      { new: true }
    );

    if (!updatedGarage) {
      return res.status(404).json({
        status: false,
        message: "Garage not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Garage updated successfully",
      data: updatedGarage,
    });
  } catch (error) {
    console.error("Error updating garage:", error);
    res.status(400).json({
      status: false,
      message: "Failed to update garage",
      error: error.message,
    });
  }
};



exports.deleteGarage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGarage = await Garage.findByIdAndDelete(id);

    if (!deletedGarage) {
      return res.status(404).json({
        status: false,
        message: "Garage not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Garage deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting garage:", error);
    res.status(500).json({
      status: false,
      message: "Failed to delete garage",
      error: error.message,
    });
  }
};

