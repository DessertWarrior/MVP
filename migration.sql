DROP TABLE IF EXISTS anime CASCADE;
DROP TABLE IF EXISTS animeGenre CASCADE;
CREATE TABLE anime(
    id serial PRIMARY KEY,
    title text,
    synosis text,
    image text,
    studio varchar,
    source varchar,
    theme varchar,
    score NUMERIC,
    opening text
);
CREATE TABLE animeGenre(
    id serial PRIMARY KEY,
    name text,
    genre varchar(15),
    anime_id INT references anime(id) ON DELETE CASCADE
)