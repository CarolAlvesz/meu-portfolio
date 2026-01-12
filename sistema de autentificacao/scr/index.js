require ('dotenv').config();
const express = require ('express');
const jwt = require ('jsonwebtoken');   

const app = express ();
app.use (express.json());

const users = [{id: 1, email: "lina@gmail.com", password: "4321"}];

app.post ('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find (u => u.email === email && u.password === password);

    if (!user) {
        return res.status (401).json ({ message: 'Invalid credentials' });
    }
   
    const token = jwt.sign ({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json ({ token });
    
});

app.listen (3000, () => {
    console.log ('Server is running on port 3000');
});
