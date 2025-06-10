const BookAppointment = require("../models/BookAppoitment"); // Model ka naam sahi use karein


const User = require("../models/User");
// POST - Create new booking appointment
// exports.BookAppointment = async (req, res) => {
//   try {
//     const bookAppointment = new BookAppointment(req.body);
//     console.log("Saving booking appointment:", bookAppointment);
//     await bookAppointment.save();
//     res.status(201).json({
//         status:true,
//        message:"Appoitment Successfully",
//         data:bookAppointment
//     });
//   } catch (error) {
//     console.error( "Error creating booking appointment:", error);
//     res.status(400).json({ error: error.message });
//   }
// };



exports.BookAppointment = async (req, res) => {
  try {
    const {
      vehicleRegistration,
      vinNumber,
      lastMotDate,
      make,
      model,
      year,
      color,
      engineSize,
      fuelType,
      motStatus,
      daysOverdue,
      selectedDate,
      selectedTime,
      selectedServices,
      additionalServices,
      motTestCost,
      additionalServicesCost,
      totalCost,
      reactivationFee,
      administrativeProcessing,
      vat,
      paymentMethod,
      cardDetails,
      billingAddress,
      userId  
    } = req.body;

    // Validate vehicleRegistration is not null or empty
    if (!vehicleRegistration || vehicleRegistration.trim() === "") {
      return res.status(400).json({
        status: false,
        message: 'Vehicle registration is required and cannot be null or empty.'
      });
    }

    

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found.'
      });
    }

    // Create a new booking
    const newBookAppointment = new BookAppointment({
      vehicle: {
        vehicleRegistration,
        vinNumber,
        lastMotDate,
        make,
        model,
        year,
        color,
        engineSize,
        fuelType,
        motStatus,
        daysOverdue
      },
      appointmentDetails: {
        selectedDate,
        selectedTime,
        selectedServices
      },
      bookingSummary: {
        additionalServices,
        costSummary: {
          motTest: motTestCost,
          additionalServices: additionalServicesCost,
          total: totalCost
        }
      },
      paymentDetails: {
        reactivationFee,
        administrativeProcessing,
        vat,
        total: totalCost + reactivationFee + administrativeProcessing + vat,
        paymentMethod,
        paymentStatus: 'pending',
        cardDetails,
        billingAddress
      },
       userId: userId 
    });

    // Save the booking to the database
    await newBookAppointment.save();

    // Return the booking details in the response
    res.status(201).json({
      status: true,
      message: 'Booking successfully created',
      data: newBookAppointment
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(400).json({ error: error.message });
  }
};



// GET - Get all booking appointments
exports.getBookAppointments = async (req, res) => {
  try {
    const bookAppointments = await BookAppointment.find();
    res.json({status: true, message: 'Reterived Bookings data',bookAppointments});
  } catch (error) {
    console.error("Error fetching booking appointments:", error);
    res.status(500).json({ error: error.message });
  }
};



exports.getVehicleHistory = async (req, res) => {
  const vehicleRegistration = req.params.vehicleRegistration;

  try {
    // Fetch the vehicle history by vehicleRegistration from BookAppointment
    const vehicle = await BookAppointment.findOne({
      "vehicle.vehicleRegistration": vehicleRegistration
    });

    if (!vehicle) {
      return res.status(404).json({
        status: false,
        message: 'Vehicle not found.'
      });
    }

    // Calculate total services, average cost, and next service due
    const totalServices = vehicle.bookingSummary.additionalServices.length;
    const totalCost = vehicle.bookingSummary.additionalServices.reduce(
      (acc, service) => acc + service.price, 0
    );
    const averageCost = totalServices > 0 ? (totalCost / totalServices).toFixed(2) : 0;

    // Assuming next service is based on selectedDate (this logic can be modified as needed)
    const nextServiceDue = vehicle.appointmentDetails.selectedDate;
    const motDueDate = vehicle.vehicle.lastMotDate;

    // Return the vehicle history data
    res.status(200).json({
      status: true,
      message: 'Retrieved Vehicle History data',
      data: {
        vehicle: {
          registration: vehicleRegistration,
          make: vehicle.vehicle.make,
          model: vehicle.vehicle.model,
          year: vehicle.vehicle.year,
          motDueDate: motDueDate,
          nextServiceDue: nextServiceDue
        },
        serviceSummary: {
          totalServices: totalServices,
          averageCost: `£${averageCost}`,
        },
        serviceHistory: vehicle.bookingSummary.additionalServices.reverse().map(service => ({
          serviceName: service.serviceName,
          price: `£${service.price}`
        }))
      }
    });
  } catch (error) {
    console.error("Error fetching vehicle history:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching vehicle history.",
      error: error.message
    });
  }
};

exports.getAllVehicleHistories = async (req, res) => {
  try {
    // Fetch all vehicle history records from BookAppointment
    const vehicles = await BookAppointment.find();

    if (!vehicles || vehicles.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'No vehicle history found.'
      });
    }

    // Loop through each vehicle and calculate the required data
    const vehicleHistories = vehicles.map(vehicle => {
      // Calculate total services, average cost, and next service due
      const totalServices = vehicle.bookingSummary.additionalServices.length;
      const totalCost = vehicle.bookingSummary.additionalServices.reduce(
        (acc, service) => acc + service.price, 0
      );
      const averageCost = totalServices > 0 ? (totalCost / totalServices).toFixed(2) : 0;

      // Assuming next service is based on selectedDate (this logic can be modified as needed)
      const nextServiceDue = vehicle.appointmentDetails.selectedDate;
      const motDueDate = vehicle.vehicle.lastMotDate;

      return {
        vehicle: {
          registration: vehicle.vehicle.vehicleRegistration,
          make: vehicle.vehicle.make,
          model: vehicle.vehicle.model,
          year: vehicle.vehicle.year,
          motDueDate: motDueDate,
          nextServiceDue: nextServiceDue
        },
        serviceSummary: {
          totalServices: totalServices,
          averageCost: `£${averageCost}`,
        },
        serviceHistory: vehicle.bookingSummary.additionalServices.reverse().map(service => ({
          serviceName: service.serviceName,
          price: `£${service.price}`
        }))
      };
    });

    // Return the vehicle histories data
    res.status(200).json({
      status: true,
      message: 'Retrieved All Vehicle Histories data',
      data: vehicleHistories
    });
  } catch (error) {
    console.error("Error fetching vehicle histories:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching vehicle histories.",
      error: error.message
    });
  }
};




exports.editBookAppointment = async (req, res) => {
  try {
    const { id } = req.params;  // Get booking ID from request parameters
    const {
      vehicleRegistration,
      vinNumber,
      lastMotDate,
      make,
      model,
      year,
      color,
      engineSize,
      fuelType,
      motStatus,
      daysOverdue,
      selectedDate,
      selectedTime,
      selectedServices,
      additionalServices,
      motTestCost,
      additionalServicesCost,
      totalCost,
      reactivationFee,
      administrativeProcessing,
      vat,
      paymentMethod,
      cardDetails,
      billingAddress,
      userId  // User ID is provided in the request body
    } = req.body;

    // Validate vehicleRegistration is not null or empty
    if (!vehicleRegistration || vehicleRegistration.trim() === "") {
      return res.status(400).json({
        status: false,
        message: 'Vehicle registration is required and cannot be null or empty.'
      });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found.'
      });
    }

    // Find the booking by ID
    const booking = await BookAppointment.findById(id);
    if (!booking) {
      return res.status(404).json({
        status: false,
        message: 'Booking not found.'
      });
    }

    // Update booking details, including userId
    booking.vehicle = {
      vehicleRegistration,
      vinNumber,
      lastMotDate,
      make,
      model,
      year,
      color,
      engineSize,
      fuelType,
      motStatus,
      daysOverdue
    };

    booking.appointmentDetails = {
      selectedDate,
      selectedTime,
      selectedServices
    };

    booking.bookingSummary = {
      additionalServices,
      costSummary: {
        motTest: motTestCost,
        additionalServices: additionalServicesCost,
        total: totalCost
      }
    };

    booking.paymentDetails = {
      reactivationFee,
      administrativeProcessing,
      vat,
      total: totalCost + reactivationFee + administrativeProcessing + vat,
      paymentMethod,
      paymentStatus: 'pending',  // Assuming status remains 'pending' until payment is completed
      cardDetails,
      billingAddress
    };

    // Update the userId in the booking
    booking.userId = userId;

    // Save the updated booking
    await booking.save();

    res.status(200).json({
      status: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(400).json({ status: false, message: 'Failed to update booking', error: error.message });
  }
};





exports.deleteBookAppointment = async (req, res) => {
  try {
    const { id } = req.params;  // Get booking ID from request parameters

    // Find and delete the booking by ID
    const deletedBooking = await BookAppointment.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res.status(404).json({
        status: false,
        message: 'Booking not found or already deleted.'
      });
    }

    res.status(200).json({
      status: true,
      message: 'Booking deleted successfully',
      
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(400).json({ status: false, message: 'Failed to delete booking', error: error.message });
  }
};









