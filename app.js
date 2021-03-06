//is the entrypoint to the app.
//pretty much all the javascript is going to be written into this one file
//sett up the API
//Express is a routing library - not a framework like Laravel


//getting the package to the app. Now saved in variable.
let express = require('express');
let knex = require('knex');

//In node you have to create a server in code.
let app = express();


//LAB CONTENT
app.get('/api/artists', function(request, response){
  let filter = request.query.filter;
  console.log(request.query.filter);

  let connection = knex({
    client: 'sqlite3',
    connection: {
      filename: 'chinook.db'
    }
  });

  if (filter){
    connection
      .select()
      .from('artists')
      .where('Name', 'like', `%${filter}%`)
      .then((artists) => {
      var mArtists = artists.map(artist =>{
        var rObj = {};
        rObj["id"] = artist.ArtistId;
        rObj["name"] = artist.Name;
        return rObj;
      });
      response.json(mArtists);
    });
  }else{
    connection
      .select()
      .from('artists')
      .then((artists) => {
      var mArtists = artists.map(artist =>{
        var rObj = {};
        rObj["id"] = artist.ArtistId;
        rObj["name"] = artist.Name;
        return rObj;
      });
      response.json(mArtists);
    });
  }


});

//create endpoints/routes
app.get('/api/genres', function(request, response){

  let connection = knex({
    client: 'sqlite3',
    connection: {
      filename: 'chinook.db'
    }
  });
  connection.select().from('genres').then((genres) => {
    response.json(genres);
  });

});


app.get('/api/genres/:id', function(request, response){
  let id = request.params.id;

  let connection = knex({
    client: 'sqlite3',
    connection: {
      filename: 'chinook.db'
    }
  });

  connection
    .select()
    .from('genres')
    .where('GenreId', id)
    .first()
    .then((genre) => {
      if (genre){
        response.json(genre);
      }else{
        response.status(404).json({
          error: `Genre ${id} not found`
        });
      }
  });

});

app.listen(process.env.PORT || 8000);
