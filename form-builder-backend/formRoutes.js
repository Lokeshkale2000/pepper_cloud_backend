const express = require("express");
const Form = require("./Form");

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});


router.get("/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (form) {
      res.json(form);
    } else {
      res.status(404).send("Form not found");
    }
  } catch (error) {
    res.status(500).send("Server Error");
  }
});


router.post("/", async (req, res) => {
  const { label, inputs } = req.body;
  try {
    const newForm = new Form({ label, inputs });
    await newForm.save();
    res.status(201).json(newForm);
  } catch (error) {
    res.status(400).send("Error creating form");
  }
});


router.put("/:id", async (req, res) => {
  const { label, inputs } = req.body;
  try {
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      { label, inputs },
      { new: true }
    );
    if (form) {
      res.json(form);
    } else {
      res.status(404).send("Form not found");
    }
  } catch (error) {
    res.status(400).send("Error updating form");
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (form) {
      res.status(200).send("Form deleted");
    } else {
      res.status(404).send("Form not found");
    }
  } catch (error) {
    res.status(500).send("Error deleting form");
  }
});

module.exports = router;
