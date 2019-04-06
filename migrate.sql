
DROP TABLE IF EXISTS memes;
CREATE TABLE memes (
    ID SERIAL PRIMARY KEY,
    image VARCHAR
);

INSERT INTO memes (image)
  VALUES ('https://static.boredpanda.com/blog/wp-content/uploads/2015/10/funny-game-of-thrones-memes-fb__700.jpg');

INSERT INTO memes (image)
  VALUES ('https://www.todaysparent.com/wp-content/uploads/2017/06/when-your-kid-becomes-a-meme-1024x576-1497986561.jpg');
