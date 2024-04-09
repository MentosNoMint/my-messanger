const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require("cors");
const md5 = require('md5')
var jwt = require('jsonwebtoken');


app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(cors())
const jsonParser = express.json()


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'messanger'
});


connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database as ID ' + connection.threadId);
});


app.listen(8000, function () {
    console.log('запуск на 8000 порту');
});



// Define a GET route
app.get('/api/users/:id', (req, res) => {
    const id = req.params.id
    // Fetch users from the database
    connection.query('SELECT * FROM users where user_id = ?', id, (error, results) => {
        if (error) {
            console.error('Error fetching users from the database: ' + error.stack);
            return res.status(500).json({ error: 'Failed to fetch users' });
        }

        // Send the fetched data as a response
        res.json(results);
    });
});



app.post('/register', (req, res) => {
    const { username, password, first_name, last_name } = req.body;

    const hashedPassword = md5(password);

    const apiToken = jwt.sign({ username, password }, 'secretKey');


    const query = `INSERT INTO users (username, password, token, first_name, last_name) VALUES (?, ?, ?, ?, ?)`;
    const values = [username, hashedPassword, apiToken, first_name, last_name];

    try {
        connection.query(query, values);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to register user' });
    }
});