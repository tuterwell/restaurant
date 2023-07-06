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
    Object.values(r).some((v) =>{
        if (typeof v === 'string'){
            return v.toLowerCase().includes(keyword.toLowerCase())
        }
        return false
    }) ): restaurant
    res.render('index',{ restaurant: matchRestaurant, keyword: keyword })
})

app.get('/restaurant/:id', (req, res) => {
    const id = req.params.id
    const restaurants = restaurant.find((r) => r.id.toString() === id)
    res.render('details',{ restaurants: restaurants})
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})