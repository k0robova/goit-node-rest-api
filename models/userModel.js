import { model, Schema } from "mongoose";

const subscriptionList = ["starter", "pro", "business"];

const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: 6,
      required: [true, "Set password for user"],
      select: false,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscriptionList,
      default: "starter",
    },
    token: String,
    avatarURL: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Handle Mongoose error
userSchema.post("save", (res, req, next) => {
  error.status = 400;
  next();
});

export const User = model("User", userSchema);
