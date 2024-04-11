const express = require('express');
const bodyParser = require('body-parser');
const supabase = require('@supabase/supabase-js');
const md5 = require('md5')
const jwt = require('jsonwebtoken');
const e = require('express');
const cors = require('cors');
const supabaseUrl = 'https://papreleoermenrdcqdvl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhcHJlbGVvZXJtZW5yZGNxZHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2NTcxMzQsImV4cCI6MjAyODIzMzEzNH0.X2LDuVgb3nNlrd2wTOnVdqeaW7BUrEvBFbSDNZEvFSM'
const app = express();
app.use(bodyParser.json());
app.use(cors())
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

app.post('/register', async (req, res) => {


    const { username, password, last_name, first_name, email } = req.body;

    const check = await supabaseClient.from('users').select('*').eq('username', username);

    if (check.data != '') {
        if (username === check.data[0].username) {
            res.status(422)
            res.send('login used')
            return
        }
    }

    const hashedPassword = md5(password);

    const token = jwt.sign({ email: email }, 'SECRET_KEY', { expiresIn: '1h' });


    const { data, error } = await supabaseClient
        .from('users')
        .insert([{ username, password: hashedPassword, last_name, first_name, email, token }]);


    if (error) {
        res.status(500).json({ error: error.message });
    }

    res.json({ data, error });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!req.body.username || !req.body.password) {
        res.status(500)
        res.send('Не указаны данные')
        return
    }

    const { data, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', md5(password))
        .single();

    if (error) {
        return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const token = jwt.sign({ email: data.email }, 'SECRET_KEY', { expiresIn: '1h' });

    await supabaseClient
        .from('users')
        .update({ token: token })
        .eq('username', username);

    res.json({ token });
});

app.get('/users/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const { data, error } = await supabaseClient.from('users').select('*').eq('username', username);
        if (error) {
            throw error;
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/search', async (req, res) => {
    const { query } = req.query;
  
    try {
      const { data, error } = await supabaseClient
        .from('users')
        .select('*')
        .or( `username.ilike.%${query}%`, `first_name.ilike.%${query}%` , `last_name.ilike.%${query}%`);
  
      if (error) {
        throw error;
      }
  
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.post('/register', async (req, res) => {


    const { user_id, message , checkMessage} = req.body;



    const { data, error } = await supabaseClient
        .from('notifications')
        .insert([{ user_id , message , checkMessage }]);


    if (error) {
        res.status(500).json({ error: error.message });
    }

    res.json({ data, error });
});

