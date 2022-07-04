const express = require('express')
const app = express()
const port = 3000
let bodyParser = require('body-parser')

const fs = require('fs');

app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/list', (req, res) => {
    try {
        let users = JSON.parse(fs.readFileSync("./database.json", "utf8"))
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000').send(users)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

app.post('/submit', async (req, res) => {
    console.log('A requisição chegou')
    console.log(req.body)
    let users = JSON.parse(fs.readFileSync("./database.json", "utf8"))

    try {
        const resistered = users.forEach((user, index) => {
            if(req.body.email == user.email) {
                return index
            } else return
        })
        // console.log(resistered)

        if( !resistered ) {
            users.push({
                email: req.body.email,
                name: req.body.name
            })
            fs.writeFileSync( "./database.json", JSON.stringify(users))
            console.log(users)
            res.status(200).setHeader('Access-Control-Allow-Origin', 'http://localhost:5000').send({ message: 'Done!'})
        } else res.status(200).setHeader('Access-Control-Allow-Origin', 'http://localhost:5000').send({ message: 'Already registered!'})
    } catch (error) {
        console.log(error)
        res.send(error)
    }
});

app.post('/delete', async (req, res) => {
    let users = JSON.parse(fs.readFileSync("./database.json", "utf8"))

    try {
        const resistered = function findUser() {
            users.map( (user, index) => {
                if(req.body.email === user.email) {
                    return index
                }
            })
        }

        if(resistered) {
            users.splice(resistered, 1)

            fs.writeFileSync( "./database.json", JSON.stringify(users))
            res.status(200).setHeader('Access-Control-Allow-Origin', 'http://localhost:5000').send({ message: 'Done!'})
        }
    } catch (error) {
        console.log(error)
        res.status(401).setHeader('Access-Control-Allow-Origin', 'http://localhost:5000').send({ message: 'Could not be completed'})
    }
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`)
})