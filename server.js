const dotenv = require('dotenv');
const {Pool} = require('pg');
const express = require('express');
const { JSDOM } = require('jsdom');
const { generateKey } = require('crypto');
const app = express();
dotenv.config();
console.log(process.env.DATABASE_URL);
const port = process.env.PORT || 3000;
const pg = new Pool({connectionString: process.env.DATABASE_URL});
pg.connect();

app.use(express.json());
app.use(require('body-parser').urlencoded( {extended: false}))
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.json({
        'hello': 'world'
    });
});

app.get('/api/anime',(req,res)=>{
    fetch('https://myanimelist.net/anime/season/2023/spring')
    .then(response=>response.text())
    .then(data=>{
        const dom = new JSDOM(data);
        const document = dom.window.document;
        const newContent = document.querySelector('.seasonal-anime-list');
        //this is the card content
        const parentElements = newContent.querySelectorAll('.js-anime-category-producer');
        
        parentElements.forEach(parentElement=>{
            const titleElement = parentElement.querySelector('.title-text > .h2_anime_title > a');
            const title = titleElement?titleElement.textContent.trim(): null;
            const synopsisElement = parentElement.querySelector('.synopsis > p.preline');
            const synopsis = synopsisElement?synopsisElement.textContent.trim(): null;
            const imageElement = parentElement.querySelector('.image > a > img');
            const imageSrc = imageElement.getAttribute('src');
            const genresElement = parentElement.querySelector('.genres-inner');
            const genres = Array.from(genresElement.querySelectorAll('.genre > a')).map(genreElement => genreElement.textContent);
            const studioElement = parentElement.querySelector('.properties > .property:nth-child(1) > .item > a');
            const studio = studioElement?studioElement.textContent.trim(): null;
            const sourceElement = parentElement.querySelector('.properties > .property:nth-child(2) > .item');
            const source = sourceElement?sourceElement.textContent.trim(): null;
            const themeElement = parentElement.querySelector('.properties > .property:nth-child(3) > .item > a');
            const theme = themeElement?themeElement.textContent.trim() : null;
            const scoreElement = parentElement.querySelector('.scormem-item.score');
            const score = scoreElement?scoreElement.textContent.trim(): null;
            const memberElement = parentElement.querySelector('.scormem-item.member');
            const member = memberElement?memberElement.textContent.trim(): null;
            console.log('Title:', title);
            console.log('Synopsis:', synopsis);
            console.log('Image Source:', imageSrc);
            console.log('Genres:', genres);
            console.log('Studio:', studio);
            console.log('Source:', source);
            console.log('Theme:', theme);
            console.log('Score:', score);
            console.log('Member Count:', member);
            const values = [title,synopsis,imageSrc,studio,source,theme,score];
            pg.query(`INSERT INTO anime(title,synosis,image,studio,source,theme,score) VALUES($1,$2,$3,$4,$5,$6,$7)`,values)
        });
        res.send('good');
    })
})
app.get('/api/animeList',(req,res)=>{
    pg.query(`SELECT * FROM anime ORDER BY id ASC`).then(response=>{
        res.send(response);
    })
})

app.patch('/api/animeList/:id',(req,res)=>{
    let 
})

app.listen(port,()=>{
    console.log(`Listening to port ${port}`)
})