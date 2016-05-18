(function() {

  var express = require('express');
  var io = require('socket.io');
  var app = express();
  var http = require('http');
  var server = http.createServer(app);
  var path = require('path')
  var io = io.listen(server);
  var port = 3335

  app.set('view engine', 'pug');
  app.set('public', path.join(__dirname, 'public'));
  app.get('/style.css', function(req, res){
    res.sendFile(__dirname + '/public/stylesheets/style.css');
  });
  app.get('/', function(req, res) {
    res.render('index', {});
  });

  server.listen(port); console.log("listening on " +port);

  m_players = [];

  i = 0;

  io.sockets.on('connection', function(socket) {
    console.log("New connection: " + socket);
    socket.on('client_connected', function(data) {
      data.id = socket.id;
      m_players[i] = data;
      i++;
      return io.sockets.emit("send_data", m_players);
    });
    socket.on('update_coords', function(pos) {
      var x, _ref;
      try {
        for (x = 0, _ref = m_players.length; 0 <= _ref ? x <= _ref : x >= _ref; 0 <= _ref ? x++ : x--) {
          if (m_players[x].id === socket.id) {
            m_players[x].x = pos.x;
            m_players[x].y = pos.y;
            console.log("Client: " + socket.id);
            console.log("X: " + pos.x + ",  Y: " + pos.y);
            break;
          }
        }
      } catch (err) {
        console.log(err);
      }
      return io.sockets.emit("send_data", m_players);
    });
    return socket.on('disconnect', function() {
      var j, n, tmp;
      j = 0;
      n = 0;
      tmp = [];
      while (n < m_players.length) {
        if (m_players[j].id === socket.id) {
          n++;
          break;
        }
        if (n < m_players.length) {
          tmp[j] = m_players[n];
          j++;
          n++;
          break;
        }
      }
      m_players = tmp;
      i = j;
      return io.sockets.emit('send_data', m_players);
    });
  });

}).call(this);
