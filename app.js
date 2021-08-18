const express = require('express')
const nunjucks = require('nunjucks')
const fetch = require('node-fetch');
const app = express()
const port = 3000

async function getData(url) {
    const response = await fetch(url);
    return response.json();
}

nunjucks.configure('views', {
    autoescape: true,
    express: app,
})

app.use(express.urlencoded({
    extended: true
}))

app.use(express.static('public'))

app.get('/', function(req, res) {
    res.render('pages/index.njk');
})

app.post('/search', async (req, res) => {
    const parameter = req.body.parameter
    const query = req.body.query

    const data = await getData("https://swapi.dev/api/" + parameter + "/?search=" + query)

    console.log(parameter, query, data)

    res.render('pages/search.njk', {query: query, data: data});
})


app.listen(port)