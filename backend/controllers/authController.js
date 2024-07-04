const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Fonction pour hacher les mots de passe
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Fonction pour comparer les mots de passe
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

exports.login = async (req, res) => {
  try {
    const { mail, password } = req.body;
    console.log('Login attempt received:', { mail, password });

    const user = await User.findOne({ mail });
    if (!user) {
      console.log('User not found:', mail);
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      console.log('Incorrect credentials for user:', mail);
      return res.status(400).json({ message: 'Incorrect credentials' });
    }

    console.log('User logged in successfully:', user);
    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, age, mail, phone, address, complementary, postal_code, password, role } = req.body;
    console.log('Registering user:', { first_name, last_name, age, mail, phone, address, complementary, postal_code, password, role });

    const hashedPassword = await hashPassword(password);

    const user = new User({ first_name, last_name, age, mail, phone, address, complementary, postal_code, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
};

exports.createAccount = async (req, res) => {
  const adminUser = await User.findById(req.user.id);
  if (!adminUser || adminUser.role !== "admin") {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const { first_name, last_name, age, mail, phone, address, complementary, postal_code, password, role } = req.body;
    console.log('Creating account:', { first_name, last_name, age, mail, phone, address, complementary, postal_code, password, role });

    const hashedPassword = await hashPassword(password);

    const newUser = new User({ first_name, last_name, age, mail, phone, address, complementary, postal_code, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ message: 'Error creating account', error });
  }
};
