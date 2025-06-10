const Customer = require("../models/ManageCustomer");

exports.createCustomer = async (req, res) => {
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

exports.getCustomer = async (req, res) => {
  try {
    // Fetch full appointments
    const appointments = await Customer.find().sort({ dateTime: -1 }).lean();

    // Summary counts
    const total = appointments.length;
    const confirmed = appointments.filter(a => a.status === "confirmed").length;
    const pending = appointments.filter(a => a.status === "pending").length;
    const cancelled = appointments.filter(a => a.status === "cancelled").length;

    // Recent activities (last 10)
    const recentActivities = appointments.slice(0, 10).map(item => {
      let actionText = "";
      switch (item.status) {
        case "confirmed": actionText = `Appointment Confirmed - ${item.customer} - ${item.serviceType}`; break;
        case "pending": actionText = `New Appointment Created - ${item.customer} - ${item.serviceType}`; break;
        case "cancelled": actionText = `Appointment Cancelled - ${item.customer} - ${item.serviceType}`; break;
        default: actionText = `Appointment Updated - ${item.customer} - ${item.serviceType}`;
      }
      const dateStr = new Date(item.dateTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      return `${actionText} - ${dateStr}`;
    });

    res.json({
      summary: { total, confirmed, pending, cancelled },
      appointments,
      recentActivities
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



