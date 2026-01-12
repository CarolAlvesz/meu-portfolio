require ('dotenv').config();
const express = require ('express');
const jwt = require ('jsonwebtoken');   

const app = express ();
app.use (express.json());

const users = [{id: 1, email: "lina@gmail.com", password: "4321"}];

function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user
        next()
    });
}

app.post ('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find (u => u.email === email && u.password === password);

    if (!user) {
        return res.status (401).json ({ message: 'Invalid credentials' });
    }
   
    const token = jwt.sign ({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json ({ token });
    
});

app.get ('/protected', authToken, (req, res) => {
    res.json ({ message: 'this is a protected route' });
});


app.listen (3000, () => {
    console.log ('Server is running on port 3000');
});
