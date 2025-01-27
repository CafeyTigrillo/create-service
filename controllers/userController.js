const axios = require('axios');
const bcrypt = require('bcrypt');
const { Users } = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');

exports.createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, branch_id } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user_id = uuidv4();
    const username = `${first_name.toLowerCase()}.${last_name.toLowerCase()}`;

    const newUser = await Users.create({
      user_id,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      username,
      branch_id,
    });

    const authServiceURL = 'http://localhost:3002/api/create-login';
    await axios.post(authServiceURL, {
      user_id,
      username,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User created successfully.', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
