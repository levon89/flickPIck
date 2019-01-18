// Require expressjs ramework
const express = require('express')
// Assign to constant expressJS function
const app = express()
// Port constant to choose listening port
const port = 3000

// Path for response file when user request to blank relative path  
app.get('/', (req, res) => res.send('Hello World!'))

// Listen port function
app.listen(port, () => console.log(`Example app listening on port ${port}!`))