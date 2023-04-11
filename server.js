const dotenv = require('dotenv');
const {Pool} = require('pg');
const express = require('express');
const { JSDOM } = require('jsdom');
const fetch = require('isomorphic-fetch');
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

// app.get('/api/anime',(req,res)=>{
//     console.log('hi');
//     fetch('https://myanimelist.net/anime/season/2023/spring')
//     .then(response=>response.text())
//     .then(data=>{
//         const dom = new JSDOM(data);
//         const document = dom.window.document;
//         const newContent = document.querySelector('.seasonal-anime-list');
//         //this is the card content
//         const parentElements = newContent.querySelectorAll('.js-anime-category-producer');
//         parentElements.forEach(parentElement=>{
//             const titleElement = parentElement.querySelector('.title-text > .h2_anime_title > a');
//             const title = titleElement?titleElement.textContent.trim(): null;
//             // const synopsisElement = parentElement.querySelector('.synopsis > p.preline');
//             // const synopsis = synopsisElement?synopsisElement.textContent.trim(): null;
//             // const imageElement = parentElement.querySelector('.image > a > img');
//             // const imageSrc = imageElement.getAttribute('src');
//             const genresElement = parentElement.querySelector('.genres-inner');
//             const genres = Array.from(genresElement.querySelectorAll('.genre > a')).map(genreElement => genreElement.textContent);

//                 pg.query(`SELECT id FROM anime WHERE title = $1`,[title]).then(result=>{
//                     for (let j = 0; j< genres.length;j++)
//                     {
//                         pg.query(`INSERT INTO animeGenre(name,genre,anime_id) VALUES($1,$2,$3) RETURNING *`,[title,genres[j],result.rows[0].id]).then(res=>{
//                             console.log(res.rows);
//                         })
//                     }
//                 })
            
//             // const studioElement = parentElement.querySelector('.properties > .property:nth-child(1) > .item > a');
//             // const studio = studioElement?studioElement.textContent.trim(): null;
//             // const sourceElement = parentElement.querySelector('.properties > .property:nth-child(2) > .item');
//             // const source = sourceElement?sourceElement.textContent.trim(): null;
//             // const themeElement = parentElement.querySelector('.properties > .property:nth-child(3) > .item > a');
//             // const theme = themeElement?themeElement.textContent.trim() : null;
//             // const scoreElement = parentElement.querySelector('.scormem-item.score');
//             // const score = scoreElement.textContent.trim() == 'N/A' ?null: scoreElement.textContent.trim();
//             // const memberElement = parentElement.querySelector('.scormem-item.member');
//             // const member = memberElement?memberElement.textContent.trim(): null;
//             // console.log('Title:', title);
//             // console.log('Synopsis:', synopsis);
//             // console.log('Image Source:', imageSrc);
//             // console.log('Genres:', genres);
//             // console.log('Studio:', studio);
//             // console.log('Source:', source);
//             // console.log('Theme:', theme);
//             // console.log('Score:', score);
//             // console.log('Member Count:', member);
//             //const values = [title,synopsis,imageSrc,studio,source,theme,score];
//             //pg.query(`INSERT INTO anime(title,synosis,image,studio,source,theme,score) VALUES($1,$2,$3,$4,$5,$6,$7)`,values)
//         });
//         res.send('good');
//     })
// })
app.get('/animeList',(req,res)=>{
    pg.query(`SELECT id, title, image FROM anime ORDER BY id ASC`).then(response=>{
        res.send(response.rows);
    })
})
app.get('/animeList/:id',(req,res,next)=>{
    let id = req.params.id;
    if (isNaN(id))  next(404);
    console.log('hi');
    pg.query(`SELECT * FROM anime WHERE id = $1`,[id]).then(response=>{
        if (response.rows.length === 0) return next(400);
        else {
            pg.query(`SELECT genre FROM animeGenre WHERE anime_id = $1`,[id]).then(genres=>{
                let animeDetails = response.rows[0];
                let temp = [];
                for (let i = 0; i < genres.rows.length;i ++)
                {
                    temp.push(genres.rows[i].genre);
                }
                animeDetails.genre = temp;
                res.send(animeDetails);
            })
        }
    })
})
app.patch('/api/animeList/:id',(req,res,next)=>{
    let id = req.params.id;
    let key = Object.keys(req.body)[0];
    let value = Object.values(req.body)[0];
    if (isNaN(id))  return next(404);
    else {
        pg.query(`UPDATE anime SET ${key}=$1 WHERE id = $2 RETURNING *`,[value,id])
        .then(response=>{
            res.status(202).send(response.rows[0]);
        })
        .catch(e=>next(400))
    }
})
app.use((error,req,res)=>{
    if (error === 404)
    res.status(404).send('Not found');
    else if (error === 400)
    res.status(400).send('Bad request');
})
app.use((req,res)=>{
    res.status(500).send('Internal Server Error');
})
app.listen(port,()=>{
    console.log(`Listening to port ${port}`)
})