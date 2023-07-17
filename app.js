const express = require('express')
const {engine} = require('express-handlebars')
const app = express()
const port = 3000

const db = require('./models')
const Restaurant = db.restaurant

app.engine('.hbs', engine({extname : '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))

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
    res.redirect('/restaurant')
}) // add todo

app.get('/restaurant/:id', (req, res) => {
    const id = req.params.id
    const restaurants = restaurant.find((r) => r.id.toString() === id)
    res.render('details',{ restaurants: restaurants})
}) // get single restaurant

app.get('/restaurant/:id/edit', (req, res) => {
    res.send('edit')
}) // edit restaurant

app.put('/restaurant/:id', (req, res) => {
    res.send('update')
}) // modify restaurant

app.delete('/restaurant/:id', (req, res) => {
    res.send('delete')
}) // delete restaurant

app.listen(port, () => {
    console.log(` Server is listening on port ${port}`)
})