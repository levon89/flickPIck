// Require expressjs ramework
const express = require('express')
// Assign to constant expressJS function
const app = express()
// Port constant to choose listening port
const port = 3000

// Config server to prevent sever data leak
app.set('x-powered-by', false);

// MIddleware to serve folder
app.use(express.static('public'))
app.use(express.static('views'))


  

// Path for response file when user request to blank relative path  
app.get('/', (req, res) => res.render('index'))

// Listen port function
app.listen(port, () => console.log(`Example app listening on port ${port}!`))