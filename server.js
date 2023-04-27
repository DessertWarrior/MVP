const dotenv = require("dotenv");
const { Pool } = require("pg");
const express = require("express");
const basicAuth = require('express-basic-auth')

const app = express();
dotenv.config();
console.log(process.env.DATABASE_URL);
const port = process.env.PORT || 3000;
const pg = new Pool({ connectionString: process.env.DATABASE_URL });
pg.connect();

const auth = basicAuth({
  users: { admin: "password" },
  challenge: true,
  realm: "Required",
});

app.use(express.json());
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(auth);

app.get("/", (req, res,next) => {
  res.json({
    hello: "world",
  });
});

app.get("/api/animeList", (req, res,next) => {
  pg.query(
    `SELECT anime.id,anime.title,anime.image,animeGenre.genre FROM anime INNER JOIN animeGenre ON anime.id = animeGenre.anime_id ORDER BY id ASC`
  ).then((response) => res.send(response.rows));
});
app.get("/api/animeList/:id", auth,(req, res, next) => {
  let id = req.params.id;
  if (isNaN(id)) next(404);
  pg.query(`SELECT * FROM anime WHERE id = $1`, [id]).then((response) => {
    if (response.rows.length === 0) return next(404);
    else {
      pg.query(`SELECT genre FROM animeGenre WHERE anime_id = $1`, [id]).then(
        (genres) => {
          let animeDetails = response.rows[0];
          let temp = [];
          for (let i = 0; i < genres.rows.length; i++) {
            temp.push(genres.rows[i].genre);
          }
          animeDetails.genre = temp;
          res.send(animeDetails);
        }
      );
    }
  });
});
app.get('/api/animeLists/:id',(req,res)=>{
    let id = req.params.id;
    pg.query(`SELECT * FROM anime WHERE id = $1`, [id]).then(
        (result) => {
            let animeDetails = [];
            let obj = result.rows[0]
            for (let i in obj)
            {
                animeDetails.push(obj[i])
            }
          res.send(animeDetails);
        });
})
app.post("/api/animeList", (req, res, next) => {
  let data = req.body;
  let genres = data.genre.trim()== '' ? ['others']: data.genre.split(','); //get from req.body and set to an array
  let result;
  const values = [
    data.title,
    data.synopsis,
    data.image,
    data.studio,
    data.source,
    data.theme,
    data.score,
    data.opening
  ];
  pg.query(
    `INSERT INTO anime(title,synosis,image,studio,source,theme,score,opening) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    values
  ).then((response) => {
    result = response.rows[0];
    let promises = [];
      genres.forEach(genre => {
        let promise = pg.query(`INSERT INTO animeGenre(name,genre,anime_id) VALUES ($1,$2,$3) RETURNING *`,[data.title, genre, response.rows[0].id]
        ).then((data)=>{
          return data.rows[0].genre;
        });
        promises.push(promise); //add to the array of promises
      });
      return Promise.all(promises);
    })
    .then((genres)=>{
      result.genre = genres;
      res.send(result);
    })
    .catch((e) => next(400));
});
app.patch("/api/animeList/:id", (req, res, next) => {
  let id = req.params.id;
  let data = req.body;
  let genres = data.genre.split(','); //get from req.body and set to an array

  let query = `UPDATE anime SET title=COALESCE($1,title), synosis=COALESCE($2,synosis),
  image=COALESCE($3,image),studio=COALESCE($4,studio),source=COALESCE($5,source),
  theme=COALESCE($6,theme),score=COALESCE($7,score),opening=COALESCE($8,opening) WHERE id = $9 RETURNING *`
  let values = [
    data.title || null,
    data.synosis || null,
    data.image || null,
    data.studio|| null,
    data.source|| null,
    data.theme|| null,
    data.score|| null,
    data.opening|| null,
    id
]
  pg.query(query,values)
  .then(response=>{
    //check for genre
    pg.query(`DELETE FROM animeGenre WHERE anime_id = $1`,[id]).then(()=>{
      genres.forEach(genre => {
        pg.query(`INSERT INTO animeGenre(name,genre,anime_id) VALUES ($1,$2,$3) RETURNING genre`,[data.title,genre,id])
      }); //end of foreach loop

      
    }).then(()=>{
          response.rows[0].genre = genres;
          res.status(202).send(response.rows[0])

    })
    
  })
  .catch(e=>next(400));
});
app.delete("/api/animeList/:id", (req, res, next) => {
  let id = req.params.id;
  if (isNaN(id)) return next(404);
  else {
    pg.query(`DELETE FROM anime WHERE id = $1 RETURNING *`, [id]).then(
      (response) => {
        if (response.rows.length === 0) return next(404);
        else {
          res.status(202).send(response.rows[0]);
        }
      }
    );
  }
});
app.use((error, req, res, next) => {
  if (error === 404) res.status(404).send("Not found");
  else if (error === 400) res.status(400).send("Bad request");
  else res.status(500).send("Internal Server Error");
});
app.use((req, res) => {
    res.status(404).send("Not found");
});
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
