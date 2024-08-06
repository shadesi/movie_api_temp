const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const Models = require("./models");
const cors = require("cors");

const app = express();
const Movie = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/movieDB");

app.use(bodyParser.json());
app.use(morgan("common"));
app.use(cors());


// Example route to check if server is running
app.get("/", (req, res) => {
    res.send("Welcome to MyFlix!");
});

app.get("/movies", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(201).json(movies);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
    }
});

// Get a user by username
app.get("/users/:Username", (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).send("User not found");
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

app.get("/users", async (req, res) => {
    try {
        const users = await Users.find();
        res.status(201).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
    }
});

app.get("/movies/:Title", async (req, res) => {
    try {
        const movie = await Movie.findOne({ Title: req.params.Title });
        res.json(movie);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
    }
});

app.get("/genre/:Name", async (req, res) => {
    try {
        const genre = await Movie.findOne({ "Genre.Name": req.params.Name }, "Genre.Description");
        res.json(genre.Genre.Description);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
    }
});

app.get("/director/:Name", async (req, res) => {
    try {
        const director = await Movie.findOne({ "Director.Name": req.params.Name }, "Director");
        res.json(director.Director);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
    }
});

app.post("/users", async (req, res) => {
    try {
        const existingUser = await Users.findOne({ Username: req.body.Username });
        if (existingUser) {
            return res.status(400).send(req.body.Username + " already exists");
        }
        const newUser = await Users.create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
        });
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
    }
});

app.put("/users/:Username", async (req, res) => {
    try {
        const updatedUser = await Users.findOneAndUpdate(
            { Username: req.params.Username },
            {
                $set: {
                    Username: req.body.Username,
                    Password: req.body.Password,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday,
                },
            },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).send("User not found");
        }
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
    }
});


// Delete a user by username
app.delete("/users/:Username", (req, res) => {
    Users.findOneAndDelete({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(404).send(req.params.Username + " was not found");
            } else {
                res.status(200).send(req.params.Username + " was deleted.");
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});


app.post("/users/:Username/Movies/:MovieID", async (req, res) => {
    try {
        const updatedUser = await Users.findOneAndUpdate(
            { Username: req.params.Username },
            { $push: { FavoriteMovies: req.params.MovieID } },
            { new: true }
        );
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
    }
});

app.delete("/users/:Username/Movies/:MovieID", async (req, res) => {
    try {
        const updatedUser = await Users.findOneAndUpdate(
            { Username: req.params.Username },
            { $pull: { FavoriteMovies: req.params.MovieID } },
            { new: true }
        );
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
    }
});

app.use("/documentation", express.static("public"));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Error");
});

app.listen(8080, () => console.log("Your app is listening on port 8080."));
