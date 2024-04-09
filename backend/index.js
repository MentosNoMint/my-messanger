const express = require('express');
const bodyParser = require('body-parser');
const supabase = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const md5 = require('md5')
const jwt = require('jwt-simple');
const supabaseUrl = 'https://papreleoermenrdcqdvl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhcHJlbGVvZXJtZW5yZGNxZHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2NTcxMzQsImV4cCI6MjAyODIzMzEzNH0.X2LDuVgb3nNlrd2wTOnVdqeaW7BUrEvBFbSDNZEvFSM'
const app = express();
app.use(bodyParser.json());


const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

app.post('/register', async (req, res) => {
  try {
    const { username, password, last_name, first_name, email } = req.body;

    const hashedPassword = md5(password);
    
    // Генерируем токен для пользователя
    const token = jwt.encode({ username, email }, 'secretkey');
    
    // Добавляем нового пользователя в таблицу users с помощью Supabase
    const { data, error } = await supabaseClient
      .from('users')
      .insert([{ username, password: hashedPassword, last_name, first_name, email, token }]);
    
    res.json({ data , error});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

