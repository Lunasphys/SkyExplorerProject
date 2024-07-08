const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

exports.login = async (req, res) => {
  try {
    const { mail, password } = req.body;
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

    const token = jwt.sign(
      { _id: user._id, role: user.role, first_name: user.first_name, last_name: user.last_name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('User logged in successfully:', user);
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};


exports.getUsers = async (req, res) => {
  try {
    const name = req.query.name;
    if (name) {
      const users = await User.find({ first_name: { $regex: name, $options: 'i' } });
      return res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error });
  }
};

exports.getProfessors = async (req, res) => {
  try {
    const professors = await User.find({ role: 'professor' });
    res.status(200).json(professors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching professors', error });
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

exports.getUser = async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};