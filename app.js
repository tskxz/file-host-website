const express = require('express')
const exphbs = require('express-handlebars')
const fileUpload = require('express-fileupload')
const { v4: uuidv4 } = require('uuid');
var path = require('path')
const flash = require('express-flash');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 5000;

// Default option
app.use(fileUpload());
app.use('/upload', express.static('upload'));
app.use(flash());
app.use(session({
	secret: "uwu",
	resave: false,
	saveUninitialized: false
}))


// Templating engine
const handlebars = exphbs.create({extname: '.hbs'})

app.engine('hbs', handlebars.engine)
app.set('view engine', 'hbs')

app.use((req, res, next) => {
    res.locals.message = req.flash();
    next();
  });
  
app.get('/', (req,res) => {
    res.render('index')
})


app.post('/', (req,res) => {
   let sampleFile;
   let uploadPath;

   if(!req.files || Object.keys(req.files).length === 0){
    return res.status(400).send('No files were uploaded.')
   }

   // Name of the input is sampleFile
   sampleFile = req.files.sampleFile
   let gen = uuidv4().substring(0, 6);
   let ext = path.extname(sampleFile.name)
   sampleFile.name = gen + ext;
   
   
   uploadPath = __dirname + '/upload/' + sampleFile.name
   
   console.log(sampleFile);
   
   let nome_imagem = sampleFile.name
   // Use mv() to place file on the server
   sampleFile.mv(uploadPath, function(err){
    if(err) return res.status(500).send(err);
    let link = "http://localhost:5000/upload/" + nome_imagem
    req.flash('success', `${link}`);
    res.redirect('/');
   })
})

app.listen(port, () => console.log(`Listening on port ${port}`));