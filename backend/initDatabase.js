use skyexplorer;

// Supprimer les collections existantes si elles existent
db.bill.drop();
db.flight.drop();
db.payment.drop();
db.plane.drop();
db.user.drop();

// Créer et peupler la collection "bill"
db.createCollection("bill");
db.bill.insertMany([
  { updated_from: new Date("2023-01-01"), updated_to: new Date("2023-01-31"), price: 1000 },
  { updated_from: new Date("2023-02-01"), updated_to: new Date("2023-02-28"), price: 1500 }
]);

// Créer et peupler la collection "flight"
db.createCollection("flight");
db.flight.insertMany([
  { type: "training", date: new Date("2023-01-15"), duration: 60 },
  { type: "recreational", date: new Date("2023-02-20"), duration: 90 }
]);

// Créer et peupler la collection "payment"
db.createCollection("payment");
db.payment.insertMany([
  { title: "Credit Card" },
  { title: "PayPal" }
]);

// Créer et peupler la collection "plane"
db.createCollection("plane");
db.plane.insertMany([
  { plane_id: 1 },
  { plane_id: 2 }
]);

// Créer et peupler la collection "user" avec le rôle défini directement
db.createCollection("user");
db.user.insertMany([
  {
    first_name: "John",
    last_name: "Doe",
    age: 30,
    mail: "john.doe@example.com",
    phone: "1234567890",
    address: "123 Main St",
    complementary: "Apt 4",
    postal_code: "12345",
    password: "$2a$10$EIX/6G/.OFSzKuv1f7FOU.eFvOi1FJfl1MErFBB8Z5PRH9/Eb0zIe",
    role: "student"
  },
  {
    first_name: "Jane",
    last_name: "Smith",
    age: 25,
    mail: "jane.smith@example.com",
    phone: "0987654321",
    address: "456 Elm St",
    complementary: "Suite 1",
    postal_code: "54321",
    password: "$2a$10$DIX/6G/.OFSzKuv1f7FOU.eFvOi1FJfl1MErFBB8Z5PRH9/Eb0zIe",
    role: "instructor"
  },
  {
    first_name: "Admin",
    last_name: "User",
    age: 30,
    mail: "admin@example.com",
    phone: "1234567890",
    address: "123 Admin St",
    complementary: "Apt 1",
    postal_code: "12345",
    password: "aaa",
    role: "admin"
  }
]);