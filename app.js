(function() {

  var express = require('express');
  var io = require('socket.io');
  var app = express();
  var http = require('http');
  var server = http.createServer(app);
  var path = require('path')
  var io = io.listen(server);

  app.set('view engine', 'pug');
  app.set('public', path.join(__dirname, 'public'))
  app.get('/style.css', function(req, res){
    res.sendFile(__dirname + '/public/stylesheets/style.css');
  });
  app.get('/', function(req, res) {
    res.render('index', {});
  });

  server.listen(3335);

  m_players = [];

  i = 0;

io.sockets.on('connection', function(socket) {
  console.log("New connection: " + socket);

  socket.on('client_connected', function(data){
    data.id = socket.id;
    m_players[i] = data;
    i++;
    io.sockets.emit("send_data", m_players)
   });

   socket.on('update_coords', function(pos){

     for(var x=0; x < m_players.length; x++)
     {
       if (m_players[x].id == socket.id)
       {
         m_players[x].x = pos.x;
         m_players[x].y = pos.y;

         console.log("Client: " + socket.id);
         console.log("X: " + pos.x + ",  Y: " + pos.y );
         break;
       }
     }

     io.sockets.emit("send_data", m_players);
   });

   socket.on('disconnect', function()
   {
     var j = 0;
     var n = 0;
     var tmp = [];

     while (n < m_players.length)
     {
       if (m_players[j].id == socket.id)
         n++;

       if (n < m_players.length)
       {
         tmp[j] = m_players[n];
         j++;
         n++;
        }
      }

      m_players = tmp;
      i = j;
       io.sockets.emit('send_data', m_players);
   });
  });

}).call(this);
