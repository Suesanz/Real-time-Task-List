var express = require('express');
var http = require('http');
var ent = require('ent');

var application = express();
var server = http.createServer(application);

var socketio = require('socket.io').listen(server);

var todolist = [];
var index;


application.use(express.static('public'))


    .get('/todolist', function (request, response) {
        response.sendFile(__dirname + '/views/index.html');
    })


    .use(function (request, response, next) {
        response.redirect('/todolist');
    });


socketio.sockets.on('connection', function (socket) {


    socket.emit('updateTask', todolist);


    socket.on('addTask', function (task) {
        task = ent.encode(task); // Protect from injection
        todolist.push(task); // Add task to server todolist array


        index = todolist.length - 1;

        socket.broadcast.emit('addTask', {task: task, index: index});

    });


    socket.on('deleteTask', function (index) {

        todolist.splice(index, 1);


        socketio.sockets.emit('updateTask', todolist);
    });
});

server.listen(8080);
