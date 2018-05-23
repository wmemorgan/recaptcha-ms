require('dotenv').load();

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const port = process.env.PORT || 3000


const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/contact', (req, res) => {
  if (
    req.body.captcha === undefined ||
    req.body.captcha === '' ||
    req.body.captcha === null
  ) {
    return res.json({ "success": false, "msg": "Please select captcha" })
  }
  // Secret Key
  const secretKey = process.env.SECRET

  // Verify URL
  const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=
  ${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`

  // Make request to verify URL
  request(verifyURL, (err, response, body) => {
    body = JSON.parse(body)
    console.log(body)

    // If not successful
    if (body.success != undefined && !body.success) {
      return res.json({ "success": false, "msg": "Failed captcha verification" })
    }
    // If successful
    return res.json({ "success": true, "msg": "Captcha passed" })
  })
})

app.listen(port, () => {
  console.log('Server started on port: ', port)
})