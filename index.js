const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');

app.use(express.json()); // Middleware to parse JSON bodies

// Top 10 movies data
const topMovies = [
    { title: 'The Shawshank Redemption', year: 1994, genre: 'Drama', director: 'Frank Darabont', imageURL: 'shawshank.jpg', featured: true },
    { title: 'The Godfather', year: 1972, genre: 'Crime', director: 'Francis Ford Coppola', imageURL: 'godfather.jpg', featured: true },
    { title: 'The Dark Knight', year: 2008, genre: 'Action', director: 'Christopher Nolan', imageURL: 'dark_knight.jpg', featured: true },
    { title: 'Pulp Fiction', year: 1994, genre: 'Crime', director: 'Quentin Tarantino', imageURL: 'pulp_fiction.jpg', featured: true },
    { title: 'The Lord of the Rings: The Return of the King', year: 2003, genre: 'Fantasy', director: 'Peter Jackson', imageURL: 'lotr_return.jpg', featured: true },
    { title: 'Forrest Gump', year: 1994, genre: 'Drama', director: 'Robert Zemeckis', imageURL: 'forrest_gump.jpg', featured: true },
    { title: 'Inception', year: 2010, genre: 'Sci-Fi', director: 'Christopher Nolan', imageURL: 'inception.jpg', featured: true },
    { title: 'Fight Club', year: 1999, genre: 'Drama', director: 'David Fincher', imageURL: 'fight_club.jpg', featured: true },
    { title: 'The Matrix', year: 1999, genre: 'Sci-Fi', director: 'Lana Wachowski, Lilly Wachowski', imageURL: 'matrix.jpg', featured: true },
    { title: 'Goodfellas', year: 1990, genre: 'Crime', director: 'Martin Scorsese', imageURL: 'goodfellas.jpg', featured: true }
];

// Genres data
const genres = [
    { name: 'Drama', description: 'Drama films are serious presentations or stories with settings or life situations that portray realistic characters in conflict.' },
    { name: 'Crime', description: 'Crime films are developed around the sinister actions of criminals or mobsters, particularly bankrobbers, underworld figures, or ruthless hoodlums who operate outside the law.' },
    { name: 'Action', description: 'Action films are characterized by a resourceful hero struggling against incredible odds, which include life-threatening situations, a villain, or a pursuit which usually concludes in victory for the hero.' },
    { name: 'Fantasy', description: 'Fantasy films involve magical or other supernatural elements.' },
    { name: 'Sci-Fi', description: 'Science fiction films are set in the future, in space, on other worlds, or in different dimensions.' }
];

// Directors data
const directors = [
    { name: 'Frank Darabont', bio: 'Frank Darabont is a Hungarian-American film director, screenwriter and producer.', birthYear: 1959 },
    { name: 'Francis Ford Coppola', bio: 'Francis Ford Coppola is an American film director, producer, and screenwriter.', birthYear: 1939 },
    { name: 'Christopher Nolan', bio: 'Christopher Edward Nolan is a British-American film director, producer, and screenwriter.', birthYear: 1970 },
    { name: 'Quentin Tarantino', bio: 'Quentin Jerome Tarantino is an American film director, screenwriter, producer, and actor.', birthYear: 1963 },
    { name: 'Peter Jackson', bio: 'Sir Peter Robert Jackson is a New Zealand film director, screenwriter, and film producer.', birthYear: 1961 },
    { name: 'Robert Zemeckis', bio: 'Robert Lee Zemeckis is an American film director, screenwriter, and producer.', birthYear: 1952 },
    { name: 'David Fincher', bio: 'David Andrew Leo Fincher is an American film director.', birthYear: 1962 },
    { name: 'Lana Wachowski', bio: 'Lana Wachowski is an American film and television director, writer and producer.', birthYear: 1965 },
    { name: 'Lilly Wachowski', bio: 'Lilly Wachowski is an American film and television director, writer and producer.', birthYear: 1967 },
    { name: 'Martin Scorsese', bio: 'Martin Charles Scorsese is an American film director, producer, screenwriter, and actor.', birthYear: 1942 }
];

// Users data
const users = [];

// Middleware for logging
app.use(morgan('common'));

// Serve static files
app.use(express.static('public'));

// GET route for /movies
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// GET route for /movies/:title
app.get('/movies/:title', (req, res) => {
    const movie = topMovies.find(m => m.title === req.params.title);
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).send('Movie not found');
    }
});

// GET route for /genres/:name
app.get('/genres/:name', (req, res) => {
    const genre = genres.find(g => g.name === req.params.name);
    if (genre) {
        res.json(genre);
    } else {
        res.status(404).send('Genre not found');
    }
});

// GET route for /directors/:name
app.get('/directors/:name', (req, res) => {
    const director = directors.find(d => d.name === req.params.name);
    if (director) {
        res.json(director);
    } else {
        res.status(404).send('Director not found');
    }
});

// POST route for /users
app.post('/users', (req, res) => {
    const newUser = req.body;
    users.push(newUser);
    res.status(201).send('User registered');
});

// PUT route for /users/:username
app.put('/users/:username', (req, res) => {
    const user = users.find(u => u.username === req.params.username);
    if (user) {
        Object.assign(user, req.body);
        res.send('User updated');
    } else {
        res.status(404).send('User not found');
    }
});

// POST route for /users/:username/movies/:movieID
app.post('/users/:username/movies/:movieID', (req, res) => {
    const user = users.find(u => u.username === req.params.username);
    if (user) {
        user.favoriteMovies = user.favoriteMovies || [];
        user.favoriteMovies.push(req.params.movieID);
        res.send('Movie added to favorites');
    } else {
        res.status(404).send('User not found');
    }
});

// DELETE route for /users/:username/movies/:movieID
app.delete('/users/:username/movies/:movieID', (req, res) => {
    const user = users.find(u => u.username === req.params.username);
    if (user) {
        user.favoriteMovies = user.favoriteMovies || [];
        user.favoriteMovies = user.favoriteMovies.filter(m => m !== req.params.movieID);
        res.send('Movie removed from favorites');
    } else {
        res.status(404).send('User not found');
    }
});

// DELETE route for /users/:username
app.delete('/users/:username', (req, res) => {
    const userIndex = users.findIndex(u => u.username === req.params.username);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.send('User deregistered');
    } else {
        res.status(404).send('User not found');
    }
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
