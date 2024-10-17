const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'organ_donation_db'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Endpoint to handle donor form submission
app.post('/submit-donor', (req, res) => {
    const { name, age, bloodType, organ } = req.body;
    const query = 'INSERT INTO donors (name, age, blood_type, organ) VALUES (?, ?, ?, ?)';
    db.query(query, [name, age, bloodType, organ], (err, result) => {
        if (err) {
            console.error('Error inserting donor:', err);
            res.status(500).send('Server error');
            return;
        }
        res.send('Donor registration successful');
    });
});

// Endpoint to handle recipient form submission
app.post('/submit-recipient', (req, res) => {
    const { name, age, bloodType, organNeeded } = req.body;
    const query = 'INSERT INTO recipients (name, age, blood_type, organ_needed) VALUES (?, ?, ?, ?)';
    db.query(query, [name, age, bloodType, organNeeded], (err, result) => {
        if (err) {
            console.error('Error inserting recipient:', err);
            res.status(500).send('Server error');
            return;
        }
        res.send('Recipient registration successful');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
