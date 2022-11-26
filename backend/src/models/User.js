const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      unique: true,
      trim: true,
    },
    prenom: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      trim: true,
    },
    age: {
      type: Number,
      minLength: 1,
      maxLength: 2,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    pwd: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6,
    },
    picture: {
      type: String,
      default: "./images/profiles/noImage.png",
    },
    bio: {
      type: String,
    },
    quartier: {
      type: String,
      required: true,
    },
    sexe: {
      type: Boolean, //0=F, 1=M
    },
    idBadge: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    fb: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function () {
  if (this.isModified("pwd")) this.pwd = await bcrypt.hash(this.pwd, 8);
});

UserSchema.statics.findUser = async (email, pwd) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Erreur Pas possible de se connecter!");
  const isPasswordValid = await bcrypt.compare(pwd, user.pwd);
  if (!isPasswordValid) throw new Error("Erreur Pas possible de se connecter!");
  return user;
};

module.exports = User = mongoose.model("User", UserSchema);
