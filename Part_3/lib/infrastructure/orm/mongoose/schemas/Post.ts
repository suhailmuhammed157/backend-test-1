import mongoose from "../mongoose";

const schema = new mongoose.Schema(
  {
    title: String,
    description: String,
    main_image: String,
    dateTime: String,
    additional_images: {
      type: Array<String>,
      default: [],
    },
  },
  { timestamps: true }
);

schema.set("toObject", { virtuals: true });
schema.set("toJSON", { virtuals: true });

export default mongoose.model("Post", schema);
