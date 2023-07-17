const express = require('express')
const {engine} = require('express-handlebars')
const app = express()
const port = 3000
const restaurant = require('./public/jsons/restaurant.json').results

app.engine('.hbs', engine({extname : '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect('/restaurant')
})

app.get('/restaurant', (req, res) => {
    const keyword = req.query.keyword?.trim()
    const matchRestaurant = keyword ? restaurant.filter((r) => 
    Object.values(r).some((candidate) =>{
        if (typeof candidate === 'string'){
            return candidate.toLowerCase().includes(keyword.toLowerCase())
        }
        return false
    }) ): restaurant
    res.render('index',{ restaurant: matchRestaurant, keyword: keyword })
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