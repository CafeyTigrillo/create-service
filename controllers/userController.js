const axios = require('axios');
const bcrypt = require('bcrypt');
const { Users } = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');

const validateUserInput = (body) => {
  const { first_name, last_name, email, password, branch_id } = body;
  if (!first_name || !last_name || !email || !password || !branch_id) {
    return 'All fields are required.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format.';
  }

  return null;
};

const generateUniqueIdentifiers = async (first_name, last_name) => {
  let user_id = `${first_name.toLowerCase().slice(0, 2)}${last_name.toLowerCase().slice(0, 2)}${uuidv4().slice(0, 1)}`;
  let username = `${first_name.toLowerCase().slice(0, 3)}.${last_name.toLowerCase().slice(0, 3)}`;

  while (
    await Users.findOne({ where: { user_id } }) ||
    await Users.findOne({ where: { username } })
  ) {
    user_id = `${first_name.toLowerCase().slice(0, 2)}${last_name.toLowerCase().slice(0, 2)}${uuidv4().slice(0, 4)}`;
    username = `${first_name.toLowerCase().slice(0, 3)}.${last_name.toLowerCase().slice(0, 3)}${uuidv4().slice(0, 2)}`;
  }

  return { user_id, username };
};

exports.createUser = async (req, res) => {
  try {
    const validationError = validateUserInput(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { first_name, last_name, email, password, branch_id } = req.body;

    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { user_id, username } = await generateUniqueIdentifiers(first_name, last_name);

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
