const Customer = require("../models/ManageCustomer");

exports.createManageCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    console.log("customer");
    await customer.save();
    res.status(201).json({
      status:true,
      message:"Customer create successfully",
      data:customer
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getAllManageCustomer = async (req, res) => {
  try {
    // Fetch all customers from the database
    const customers = await Customer.find();

    // Check if there are no customers
    if (customers.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No customers found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Customers retrieved successfully",
      data: customers
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch customers",
      error: error.message
    });
  }
};



