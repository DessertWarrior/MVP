DROP TABLE IF EXISTS anime;
DROP TABLE IF EXISTS animeGenre;
CREATE TABLE anime(
    id serial PRIMARY KEY,
    name text,
    decription text,
    date_released varchar(15),
    total_episode INT,
    rating varchar(15),
    image text
);
CREATE TABLE animeGenre(
    id serial PRIMARY KEY,
    name text,
    genre varchar(15),
    anime_id INT references anime(id) ON DELETE CASCADE
)