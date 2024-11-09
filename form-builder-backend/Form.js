const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  label: { type: String, required: true },
  inputs: [
    {
      type: {
        type: String,
        required: true,
      },
      label: String,
      placeholder: String,
    },
  ],
});

module.exports = mongoose.model("Form", formSchema);
