const Client = require("../models/ClientManage");

exports.createClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    console.log("Creating client:", client);
    const savedClient = await client.save();

    res.status(201).json({
      status: true,
      message: "Client created successfully",
      data: savedClient,
    });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(400).json({
      status: false,
      message: "Failed to create client",
      error: error.message,
    });
  }
};

exports.getClient = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json({
      status: true,
      data: clients,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch clients",
      error: error.message,
    });
  }
};


exports.editClient = async (req, res) => {
  try {
    const { id } = req.params;  // Get client ID from request parameters
    const updatedData = req.body; // Get updated client data from the request body

    // Find and update the client by ID
    const updatedClient = await Client.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedClient) {
      return res.status(404).json({
        status: false,
        message: 'Client not found',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Client updated successfully',
      data: updatedClient,
    });
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(400).json({
      status: false,
      message: 'Failed to update client',
      error: error.message,
    });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;  // Get client ID from request parameters

    // Find and delete the client by ID
    const deletedClient = await Client.findByIdAndDelete(id);

    if (!deletedClient) {
      return res.status(404).json({
        status: false,
        message: 'Client not found or already deleted',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Client deleted successfully',
     
    });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(400).json({
      status: false,
      message: 'Failed to delete client',
      error: error.message,
    });
  }
};
