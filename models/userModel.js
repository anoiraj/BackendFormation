const mongoose = require('mongoose');
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['client', 'admin', 'matchOrganizer'], default: 'client' },
  image_User: { type: String, default: "icon-7797704_640.png" },
  age: Number,
  skillLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  preferredPosition: { type: String },
  location: { type: String },
  isDeleted: { type: Boolean, default: false },
  isBloked: { type: Boolean, default: false },
  
  //match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' }, //One
  matchs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }], //Many
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
  



  //nzid clés etrangeres***
}
  , { timestamps: true });

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt();
    const User = this;
    User.password = await bcrypt.hash(User.password, salt);
    // User.statu = false ken ma7atitch default lfo9
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User 
