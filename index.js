const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');

// Top 10 movies data
const topMovies = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Dark Knight', year: 2008 },
    { title: 'Pulp Fiction', year: 1994 },
    { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    { title: 'Fight Club', year: 1999 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Goodfellas', year: 1990 }
];

// Middleware for logging
app.use(morgan('common'));

// Serve static files
app.use(express.static('public'));

// GET route for /movies
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// GET route for /
app.get('/', (req, res) => {
    res.send('Welcome to my movie API!');
});

// Serve documentation.html
app.get('/documentation.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
