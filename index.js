// EXPRESS AND OTHER SETUP
const express = require('express');
const MongoUtil = require('./MongoUtil.js')
const hbs = require('hbs')
const wax = require('wax-on')

// load in environment variables
require('dotenv').config();

// create the app
const app = express();
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))

// setup template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

// handlebar helpers
 var helpers = require("handlebars-helpers")({
    handlebars: hbs.handlebars
  });

// Database constants
const dbName = "recipes_tracker";

const COLLECTIONS = {
    RECIPES: 'recipes',
    INGREDIENTS: 'ingredients'
}
  

async function main() {
    const MONGO_URL=process.env.MONGO_URL;
    await MongoUtil.connect(MONGO_URL, dbName);
    let db = MongoUtil.getDB();

    // ingredients
    app.get('/ingredients/create', (req,res)=>{
        res.render('ingredients/create')
    })

    app.post('/ingredients/create', async (req,res)=>{
        let ingredientName = req.body.ingredientName;
        await db.collection(COLLECTIONS.RECIPES).insertOne({
            ingredientName
        })
        res.send("New ingredient has been added!");
    })

    app.get('/recipes/create', async (req,res)=>{
        const ingredients = await db.collection(COLLECTIONS.INGREDIENTS).find();
        return res.render('recipes/create', {
            ingredients
        })
    })

 
}

main();

// LISTEN
app.listen(3000, ()=>{
    console.log("Express is running")
    
})