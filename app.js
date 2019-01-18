// Require expressjs ramework
const express = require('express');
// Require node-sass-middleware
const sassMiddleware = require('node-sass-middleware');
// Require path
const path = require('path');
// Assign to constant expressJS function
const app = express();
// Port constant to choose listening port
const port = 3000

// Config server to prevent sever data leak
app.set('x-powered-by', false);

// MIddleware to congfigure sass
app.use(sassMiddleware({
    src: path.join(__dirname, 'public/scss/'),
    dest: path.join(__dirname, 'public/style/'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/style'
}));

// Jquery middleware
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'))


// MIddleware to serve folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));



  

// Path for response file when user request to blank relative path  
app.get('/', (req, res) => res.render('index'))

// Listen port function
app.listen(port, () => console.log(`Example app listening on port ${port}!`))