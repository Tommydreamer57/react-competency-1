const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
require('dotenv').config()

let users = [
    {
        name: 'Tommy',
        id: 1
    },
    {
        name: 'Michael',
        id: 2
    },
    {
        name: 'Collin',
        id: 3
    },
    {
        name: 'Carson',
        id: 4
    },
]

id = 5

const PORT = 3000

const app = express()

app.use(bodyParser.json())
app.use(session({
    secret: 'asdmvfinebuwgjioemkdfnjhivjeofwk,lcdkfn',
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new Auth0Strategy({
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    allowedConnections: ['github', 'facebook', 'google-oauth2']
}, function(accessToken, refreshToken, extraParams, profile, done) {
    users.push({
        name: profile.nickname,
        id: id++
    })
    console.log(users)
    let user = users.filter(u => u.name === profile.name.givenName)
    done(null, user.id)
}))

app.get(`/auth`, passport.authenticate('auth0'))
app.get(`/auth/callback`, passport.authenticate(`auth0`, {
    successredirect: process.env.SUCCESS_REDIRECT,
    failureRedirect: process.env.FAILURE_REDIRECT
}))
app.get(`/auth/me`, (req, res) => res.status(200).send(req.user))

app.get(`/users`, (req, res) => res.status(200).send(users))
app.post(`/users`, (req, res) => {
    users.push({ name: req.body.name, id: id++ })
    res.status(200).send(users)
})
app.put(`/users/:id`, (req, res) => res.status(200).send(users.map(user => user.id == req.params.id ? Object.assign({}, user, { name: req.body.name }) : user )))
app.delete(`/users/:id`, (req, res) => {
    users = users.filter(user => user.id != req.params.id)
    res.status(200).send(users)
})

passport.serializeUser(function (id, done) {
    done(null, id)
})
passport.deserializeUser(function (id, done) {
    let user = users.filter(u => u.id === id)
    done(null, user)
})

app.listen(PORT, () => console.log(`assessment listening on port ${PORT}`))
