const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Connect to SQLite database
const DB_PATH = 'database.db';
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database:', DB_PATH);
    }
});

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT NOT NULL
)`);

// Endpoint to handle account creation
app.post('/create-account', (req, res) => {
    const { email2, password2 } = req.body;
    const sql = 'INSERT INTO users (email2, password2) VALUES (?, ?)';
    db.run(sql, [email2, password2], function(err) {
        if (err) {
            console.error('Error creating account:', err.message);
            res.status(500).send('Error creating account');
        } else {
            console.log('Account created successfully:', this.lastID);
            res.send('Account created successfully');
        }
    });
});

// Define endpoint to handle user authentication
app.post('/login', (req, res) => {
    const { email1, password1 } = req.body;

    // Check if user credentials exist in the database
    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email1, password1], (err, row) => {
        if (err) {
            console.error('Error during login:', err.message);
            res.status(500).send('Internal server error');
            return;
        }

        if (row) {
            // User authenticated successfully
            res.redirect('/checkCode.html');
        } else {
            // User not found or invalid credentials
            res.status(401).send('Invalid email or password');
        }
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});