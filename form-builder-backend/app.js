const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// MongoDB connection setup
mongoose.connect('mongodb+srv://lokeshkale2020:pMW5JpaP5ggCHNZn@cluster0.zdvdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));


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

const Form = mongoose.model('Form', formSchema);


app.use(cors({
    origin: '*', // This allows all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  }));
app.use(express.json());


app.get('/api/forms', async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});


app.get('/api/forms/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (form) {
      res.json(form);
    } else {
      res.status(404).send('Form not found');
    }
  } catch (error) {
    res.status(500).send("Server Error");
  }
});


app.post('/api/forms', async (req, res) => {
  const { label, inputs } = req.body;
  try {
    const newForm = new Form({ label, inputs });
    await newForm.save();
    res.status(201).json(newForm);
  } catch (error) {
    res.status(400).send("Error creating form");
  }
});


app.put('/api/forms/:id', async (req, res) => {
  const { label, inputs } = req.body;
  try {
    const form = await Form.findByIdAndUpdate(req.params.id, { label, inputs }, { new: true });
    if (form) {
      res.json(form);
    } else {
      res.status(404).send('Form not found');
    }
  } catch (error) {
    res.status(400).send("Error updating form");
  }
});


app.delete('/api/forms/:id', async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (form) {
      res.status(200).send('Form deleted');
    } else {
      res.status(404).send('Form not found');
    }
  } catch (error) {
    res.status(500).send("Error deleting form");
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
