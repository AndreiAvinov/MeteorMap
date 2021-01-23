const dotenv = require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const meteoRoutes = require('./routes/meteo')
const path = require('path')

const PORT = process.env.PORT || 3000
const db_uri = process.env.MONGODB_URI

const app = express()
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'  
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(meteoRoutes)

app.use(express.static(path.join(__dirname, 'public')))

async function start(){
    try{
        await mongoose.connect
        (db_uri, 
         {
             useNewUrlParser: true,
             useFindAndModify: false,
			 useUnifiedTopology: true 
         })
        app.listen(PORT, () => {
            console.log('Server has been started...')
        })
    } catch(e){
        console.log(e)
    }
}

start()