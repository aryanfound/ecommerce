const mongoose = require("mongoose");

// Define the schema for a single line in the canvas
const lineSchema = new mongoose.Schema({

  points: [Number], // Array of points (x, y)
  toolType: { type: String, required: true }, // E.g., "pen", "eraser"
  color: { type: String, default: "#000000" }, // Default color: Black
  size: { type: Number, default: 5 } ,// Line thickness
  
  
});

// Define the main canvas schema
const canvasSchema = new mongoose.Schema(
  {
    CanvasLines: [lineSchema], // Array of line objects (using the lineSchema)
    title:{type:String}
  },
  { timestamps: true } ,// Adds createdAt & updatedAt
  
  

);

// Create and export Mongoose model
const CanvasModel = mongoose.model("Canvas", canvasSchema);

module.exports = CanvasModel;
