const express = require('express')
const nunjucks = require('nunjucks')
const fetch = require('node-fetch')
const path = require('path')
const app = express()
const port = 3000

async function getData(url) {
    const response = await fetch(url)
    return response.json()
}

async function getNestedData(source, key) {
    const nestedData = []

    for (let i = 0; i < source[key].length; i++) {
        const film = await getData(source[key][i])
        nestedData.push(film)
    }

    return nestedData
}

const env = nunjucks.configure('views', {
    autoescape: true,
    express: app,
})

env.addFilter('shorten', function(str, start) {
    return str.slice(start)
})

app.use(express.urlencoded({
    extended: true
}))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
    res.render('pages/index.njk');
})

app.post('/search', async (req, res) => {
    const parameter = req.body.parameter
    const query = req.body.query

    const data = await getData("https://swapi.dev/api/" + parameter + "/?search=" + query)

    res.render('pages/search.njk', {query: query, data: data});
})

app.get('/:parameter/:id', async (req, res) => {
    const parameter = req.params.parameter
    const id = req.params.id

    const data = await getData("https://swapi.dev/api/" + parameter + "/" + id)

    switch (parameter) {
        case 'people':{
            const filmData = await getNestedData(data,"films")

            res.render('pages/people.njk', {data: data, filmData: filmData})
            break
        }
        case 'films':{
            const charactersData = await getNestedData(data, "characters")
            res.render('pages/films.njk', {data: data, charactersData: charactersData})
            break
        }
        case 'starships':{
            const filmData = await getNestedData(data,"films")

            res.render('pages/starships.njk', {data: data, filmData: filmData})
            break
        }
        case 'vehicles':{
            const filmData = await getNestedData(data, "films")

            res.render('pages/vehicles.njk', {data: data, filmData: filmData})
            break
        }
        case 'species':{
            const filmData = await getNestedData(data,"films")

            res.render('pages/species.njk', {data: data, filmData: filmData})
            break
        }
        case 'planets':{
            const filmData = await getNestedData(data,"films")

            res.render('pages/planets.njk', {data: data, filmData: filmData})
            break
        }
    }
})

app.listen(port)