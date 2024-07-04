const User = require('../models/User');

exports.login = async (req, res) => {
  try {
    const { mail, password } = req.body;
    console.log('Login attempt received:', { mail, password });

    const user = await User.findOne({ mail });
    if (!user) {
      console.log('User not found:', mail);
      return res.status(400).json({ message: 'User not found' });
    }

    if (password !== user.password) {
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

    const user = new User({ first_name, last_name, age, mail, phone, address, complementary, postal_code, password, role });
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
    const newUser = new User({ first_name, last_name, age, mail, phone, address, complementary, postal_code, password, role });
    await newUser.save();
    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating account', error });
  }
};
