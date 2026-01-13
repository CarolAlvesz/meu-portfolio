require ('dotenv').config({
    path: require ('path').resolve (__dirname, '../.env')
});
const express = require ('express');
const jwt = require ('jsonwebtoken');   

const app = express ();
app.use (express.json());

const users = [{id: 1, username: "linalvez", password: "4321"}];

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
    const { username, password } = req.body;
    const user = users.find (u => u.username === username && u.password === password);

    if (!user) {
        return res.status (401).json ({ message: 'Invalid credentials' });
    }
   
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.json ({ auth: true, token });
    
});

app.get ('/protected', authToken, (req, res) => {
    res.json ({ message: 'this is a protected route' });
});


app.listen (3000, () => {
    console.log ('Server is running on port 3000');
});
