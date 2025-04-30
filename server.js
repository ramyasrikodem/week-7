// Required modules
const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Port for the server
const mongoose = require('mongoose');
const http = require('http').createServer(app); // Create HTTP server from app
const io = require('socket.io')(http); // Attach socket.io to the HTTP server

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/myprojectDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('a user connected'); // When a user connects

  socket.on('disconnect', () => {
    console.log('user disconnected'); // When a user disconnects
  });

  // Emit random numbers every second
  setInterval(() => {
    socket.emit('number', parseInt(Math.random() * 10));
  }, 1000);
});

// Middleware
app.use(express.static(__dirname + '/public')); // Serve static files from the 'public' folder
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const routes = require('./routes/routes'); // Custom routes (you might add your own)
app.use("/", routes);

// Calculator routes (simple APIs for demonstration)
app.get('/add', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).send("Invalid input");
  }
  const sum = a + b;
  res.send(`The sum of ${a} and ${b} is: ${sum}`);
});

app.get('/subtract', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).send("Invalid input");
  }
  const difference = a - b;
  res.send(`The difference of ${a} and ${b} is: ${difference}`);
});

app.get('/multiply', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).send("Invalid input");
  }
  const product = a * b;
  res.send(`The product of ${a} and ${b} is: ${product}`);
});

app.get('/divide', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).send("Invalid input");
  }
  if (b === 0) {
    return res.status(400).send("Cannot divide by zero");
  }
  const quotient = a / b;
  res.send(`The quotient of ${a} and ${b} is: ${quotient}`);
});

// Start the server
http.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
