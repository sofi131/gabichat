const { User } = require('../models/Associations');
const bcrypt = require('bcrypt');


exports.getGabichat = (req, res) => {
  const { id, username, email, profile_picture, status } = req.session.user;
  res.render("gabichat", { id, username, email, profile_picture, status });
};

exports.postGabichat = async (req, res) => {
  const id = req.session.user.id;
  const { username, email, password } = req.body;
  const image = req.file;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.findByPk(id);
  user.username = username;
  user.email = email;
  user.password = hashedPassword;

  if (image) {
    user.profile_picture = image.filename;
  }

  req.session.user = user;
  
  await user.save();

  res.redirect("/gabichat");
};
