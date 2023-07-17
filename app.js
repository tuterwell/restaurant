const express = require('express')
const {engine} = require('express-handlebars')
const methodOverride = require('method-override')

const app = express()
const port = 3000

const db = require('./models')
const Restaurant = db.restaurant

app.engine('.hbs', engine({extname : '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.redirect('/restaurant')
})

app.get('/restaurant', (req, res) => {
    return Restaurant.findAll({attributes: ['id', 'name','name_en','category',
'image', 'location', 'phone', 'google_map', 'rating', 'description'], raw: true})
         .then((restaurants) => {
            const keyword = req.query.keyword?.trim()
            const matchRestaurant = keyword ? restaurants.filter((r) => 
            Object.values(r).some((candidate) =>{
                if (typeof candidate === 'string'){
                    return candidate.toLowerCase().includes(keyword.toLowerCase())
                }
                return false
            }) ): restaurants
            res.render('index',{ restaurant: matchRestaurant, keyword: keyword })
        })
        .catch((err) => {
            console.log(err)
        })
}) // get all restaurants

app.get('/restaurant/new', (req, res) => {
    res.render('new')
}) // create todo

app.post('/restaurant', (req, res) => {
    const name = req.body.name
    const name_en = req.body.name_en,
    category = req.body.category,
    image = req.body.image,
    location = req.body.location,
    phone = req.body.phone,
    google_map = req.body.google_map_link,
    rating = req.body.rating,
    description = req.body.description
    return Restaurant.create({
        name : name,
        name_en : name_en,
        category : category,
        image : image,
        location : location,
        phone : phone,
        google_map : google_map,
        rating : rating,
        description : description
    }, {fields : ['name', 'name_en', 'category', 'image', 
    'location', 'phone', 'google_map', 'rating', 'description']})
		.then(() => res.redirect('/restaurant'))
		.catch((err) => console.log(err))
}) // add todo

app.get('/restaurant/:id', (req, res) => {
    return Restaurant.findAll({attributes: ['id', 'name','name_en','category',
'image', 'location', 'phone', 'google_map', 'rating', 'description'], raw: true})
         .then((restaurants) => {
            const id = req.params.id
            const restaurant = restaurants.find((r) => r.id.toString() === id)
            res.render('details',{ restaurants: restaurant})
         })
}) // get single restaurant

app.get('/restaurant/:id/edit', (req, res) => {
    const id = req.params.id
    return Restaurant.findByPk(id,{
        attributes: ['id', 'name','name_en','category','image', 
        'location', 'phone', 'google_map', 'rating', 'description'],
        raw: true
    })
        .then((restaurant) => {
            res.render('edit',{ restaurant: restaurant })
        })
}) // edit restaurant

app.put('/restaurant/:id', (req, res) => {
    const id = req.params.id
    const name = req.body.name
    const name_en = req.body.name_en,
    category = req.body.category,
    image = req.body.image,
    location = req.body.location,
    phone = req.body.phone,
    google_map = req.body.google_map_link,
    rating = req.body.rating,
    description = req.body.description
    return Restaurant.update({
        name : name,
        name_en : name_en,
        category : category,
        image : image,
        location : location,
        phone : phone,
        google_map : google_map,
        rating : rating,
        description : description
    },{
        where: { id: id }
    }
    ).then(() => res.redirect('/restaurant'))
}) // modify restaurant

app.delete('/restaurant/:id', (req, res) => {
    res.send('delete')
}) // delete restaurant

app.listen(port, () => {
    console.log(` Server is listening on port ${port}`)
})