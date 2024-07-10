const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/skyexplorer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Définition des schémas
const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  age: { type: Number, required: true },
  mail: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  complementary: { type: String },
  postal_code: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'professor', 'student'], required: true },
  city: { type: String, required: true },
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['course', 'leisure'], required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  day: { type: String, required: true },
  hour: { type: String, required: true },
  duration: { type: Number, required: true },
  plane : { type: mongoose.Schema.Types.ObjectId, ref: 'Plane', required: true },
});

const billSchema = new mongoose.Schema({
  updated_from: { type: Date, required: true },
  updated_to: { type: Date, required: true },
  price: { type: Number, required: true },
  payed: {type: Boolean, required: true }, // Ajout de la propriété payed
  pdf: { type: Buffer } // Stockage du PDF en tant que buffer
});

const flightSchema = new mongoose.Schema({
  type: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
});

const paymentSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

const planeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  available: { type: Boolean, required: true },
});

const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema);
const Bill = mongoose.model('Bill', billSchema);
const Flight = mongoose.model('Flight', flightSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const Plane = mongoose.model('Plane', planeSchema);

// Fonction pour hacher les mots de passe
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const insertData = async () => {
  try {
    // Suppression des collections existantes
    await User.deleteMany({});
    await Event.deleteMany({});
    await Bill.deleteMany({});
    await Flight.deleteMany({});
    await Payment.deleteMany({});
    await Plane.deleteMany({});

    // Insertion des planes
    const cesna172 = new Plane({
      name: 'Cessna 172',
      model: 'C172',
      available: true,
    });

    const piperCherokee = new Plane({
      name: 'Piper Cherokee',
      model: 'PA-28',
      available: true,
    });

    const cesna152 = new Plane({
      name: 'Cessna 152',
      model: 'C152',
      available: true,
    });

    const piperArrow = new Plane({
      name: 'Piper Arrow',
      model: 'PA-28R',
      available: true,
    });

    const cesna182 = new Plane({
      name: 'Cessna 182',
      model: 'C182',
      available: true,
    });

    await cesna172.save();
    await piperCherokee.save();
    await cesna152.save();
    await piperArrow.save();
    await cesna182.save();


    // Insertion des utilisateurs
    const johnDoe = new User({
      first_name: 'John',
      last_name: 'Doe',
      age: 30,
      mail: 'john.doe@example.com',
      phone: '1234567890',
      address: '123 Main St',
      complementary: 'Apt 4',
      postal_code: '12345',
      password: await hashPassword('aaa'), // Hachage du mot de passe
      role: 'student',
      city:'NewYork',
    });

    const janeSmith = new User({
      first_name: 'Jane',
      last_name: 'Smith',
      age: 25,
      mail: 'jane.smith@example.com',
      phone: '0987654321',
      address: '456 Elm St',
      complementary: 'Suite 1',
      postal_code: '54321',
      password: await hashPassword('aaa'), // Hachage du mot de passe
      role: 'professor',
      city:'Marseille',
    });

    const adminUser = new User({
      first_name: 'Admin',
      last_name: 'User',
      age: 30,
      mail: 'admin@example.com',
      phone: '1234567890',
      address: '123 Admin St',
      complementary: 'Apt 1',
      postal_code: '12345',
      password: await hashPassword('aaa'), // Hachage du mot de passe
      role: 'admin',
      city:'Tokyo',
    });

    await johnDoe.save();
    await janeSmith.save();
    await adminUser.save();

    // Insertion des événements
    const mathCourse = new Event({
      title: 'Math Course',
      type: 'course',
      student: johnDoe._id,
      professor: janeSmith._id,
      day: '2023-01-15',
      hour: '10:00',
      duration: 2,
      plane: cesna152._id,
    });

    const artClass = new Event({
      title: 'Art Class',
      type: 'leisure',
      student: johnDoe._id,
      professor: janeSmith._id,
      day: '2023-02-20',
      hour: '14:00',
      duration: 1.5,
      plane: piperArrow._id,
    });

    await mathCourse.save();
    await artClass.save();

    // Insertion des factures
    await Bill.insertMany([
      { updated_from: new Date('2023-01-01'), updated_to: new Date('2023-01-31'), price: 1000 },
      { updated_from: new Date('2023-02-01'), updated_to: new Date('2023-02-28'), price: 1500 },
    ]);

    // Insertion des vols
    await Flight.insertMany([
      { type: 'training', date: new Date('2023-01-15'), duration: 60 },
      { type: 'recreational', date: new Date('2023-02-20'), duration: 90 },
    ]);

    // Insertion des paiements
    await Payment.insertMany([
      { title: 'Credit Card' },
      { title: 'PayPal' },
    ]);



    console.log('Users, events, and other collections have been inserted successfully.');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    mongoose.connection.close();
  }
};

insertData();
