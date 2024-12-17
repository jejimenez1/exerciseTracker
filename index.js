require('dotenv').config()
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
/* const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose') */

const app = express()

const { Schema } = mongoose;

MONGO_URI='mongodb+srv://jesujimenezochoa:8fZgYpiFRu1N9OZW@cluster0.tymqd.mongodb.net/user?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(MONGO_URI);

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
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
  
});

try {
  const user = await userObject.save()
  res.json(user)
} catch (err) {
  console.log('Error guardando el usuario', err)
  res.status(500).send('Error guardando nuevo usuario')
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
