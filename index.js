import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';  // Importar fileURLToPath
import path from 'path';  // Importar path

/* const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose') */

const app = express()

const { Schema } = mongoose;

const MONGO_URI='mongodb+srv://jesujimenezochoa:8fZgYpiFRu1N9OZW@cluster0.tymqd.mongodb.net/exerciseTracker?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

/*  app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});  */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));  // Usar `path.join` para construir la ruta correctamente
});

const UserSchema = new Schema({
  username: String
});
const User = mongoose.model('User', UserSchema);

const ExerciseSchema = new Schema({
  userID: {type: String, required: true},
  description: String,
  duration: Number,
  date: Date
});
const Exercise = mongoose.model('Exercise', ExerciseSchema);

//Post user
app.post('/api/users', async (req, res) => {
  const userObject = new User({
    username: req.body.username
  })

  try {
    const user = await userObject.save()
    res.json(user)
  } catch (err) {
    console.log('Error guardando el usuario', err)
    res.status(500).send('Error guardando nuevo usuario')
  }
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  const id = req.params._id;
  const { description, duration, date } = req.body;

  try {
    const user = await User.findById(id)
    if (!user) {
      res.send("Could not find user")
    } else {
      const exerciseObj = new Exercise({
        userID: user._id,
        description,
        duration,
        date: date ? new Date(date) : new Date()
      })
      const exercise = await exerciseObj.save()
      res.json({
        _id: user._id,
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: new Date(exercise.date).toDateString()
      })
    }
  } catch (err) {
    res.send('Error saving exercise')
    res.status(500).send('Error guardando ejercicio')
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
