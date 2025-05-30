import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    categories: {
      type: [String],
      required: true,
      default: [],
    },
    variants: [
      {
        type: {
          type: String,
          required: true,
        },
        values: {
          type: [String],
          required: true,
        },
      },
    ],
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
