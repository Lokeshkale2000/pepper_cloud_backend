require('dotenv').config(); // To load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Define the form schema
const formSchema = new mongoose.Schema({
  label: { type: String, required: true },
  inputs: [{
    type: {
      type: String,
      required: true
    },
    label: String,
    placeholder: String
  }]
});

// Form model
const Form = mongoose.model('Form', formSchema);

// Middleware
app.use(cors());
app.use(express.json());

// Get all forms
app.get('/api/forms', async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Get form by ID
app.get('/api/forms/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (form) {
      res.json(form);
    } else {
      res.status(404).send('Form not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Create a new form
app.post('/api/forms', async (req, res) => {
  const { label, inputs } = req.body;

  // Simple validation check
  if (!label || !inputs) {
    return res.status(400).send("Label and inputs are required");
  }

  try {
    const newForm = new Form({ label, inputs });
    await newForm.save();
    res.status(201).json(newForm);
  } catch (error) {
    console.error(error);
    res.status(400).send("Error creating form");
  }
});

// Update a form by ID
app.put('/api/forms/:id', async (req, res) => {
  const { label, inputs } = req.body;

  // Simple validation check
  if (!label || !inputs) {
    return res.status(400).send("Label and inputs are required");
  }

  try {
    const form = await Form.findByIdAndUpdate(req.params.id, { label, inputs }, { new: true });
    if (form) {
      res.json(form);
    } else {
      res.status(404).send('Form not found');
    }
  } catch (error) {
    console.error(error);
    res.status(400).send("Error updating form");
  }
});

// Delete a form by ID
app.delete('/api/forms/:id', async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (form) {
      res.status(200).send('Form deleted');
    } else {
      res.status(404).send('Form not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting form");
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
