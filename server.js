//var express = require('express');
//var socket = require('socket.io');
//var io = socket.listen(app.listen(port));
var path = require('path');
var bodyParser = require('body-parser');
var options = {secret: 'ludo'};
var app = require('sockpress').init(options);
var port = (process.env.PORT) ? process.env.PORT : 80;
var rootDir = __dirname + '/client';

var conf = {
    timer: 10
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(app.express.static(rootDir));
app.listen(port);
console.log('Server running on port ' + port);

//app.get('/', function (req, res) {
//    res.json({test: 'TEST!'});
//    res.end();
//});


var players = [
    {
        id: 1,
        name: 'Player 1',
        avatar: '/images/avatar1.jpg'
    },
    {
        id: 2,
        name: 'Player 2',
        avatar: '/images/avatar2.jpg'
    },
    {
        id: 3,
        name: 'Player 3',
        avatar: '/images/avatar3.jpg'
    },
    {
        id: 4,
        name: 'Player 4',
        avatar: '/images/avatar4.jpg'
    }
];
var games = {};


function createGame(name) {
    var game = {
        isReady: false,
        isStarted: false,
        players: [],
        dice: 0,
        turn: -1,
        //teams: [],
        //setSocket: function (i, socket) {
        //      this.players[i].socket = socket;
        //},
        nextTurn: function () {
            clearTimeout(this.timer);
            this.dice = 0;
            this.turn = this.turn === (this.players.length - 1) ? 0 : this.turn + 1;
            app.io.in(name).emit('next turn', this.turn);
            this._timerStart = Date.now();
            this.timer = setTimeout(function () {
                game.nextTurn();
            }, conf.timer * 1000);
        },
        rollDice: function () {
            this.dice = Math.floor(Math.random() * 6) + 1;
            this.dice = 6;
            app.io.in(name).emit('dice', {
                turn: this.turn,
                dice: this.dice
            });
        },
        moveToken: function (seat, id) {
            if (seat - 1 !== this.turn) return;
            if (!this.dice) return;
            var tokens = this.players[seat - 1].tokens;
            if (tokens[id] === -1 && this.dice !== 6) return;
            if (tokens[id] === -1) {
                tokens[id] = 0;
            }
            else {
                var mod = 1;
                for (var i = 1; i <= this.dice; i++) {
                    if (tokens[id] >= 56) mod = -1;
                    tokens[id] += mod;
                }
            }
            var extra = false;
            var collision = game.checkCell(tokens[id], seat);
            for (var s in collision) {
                var ids = collision[s];
                if (ids.length === 0) continue;
                if (ids.length > 1) {
                    tokens[id] = -1;
                    extra = {seat: seat, id: id, p: tokens[id]};
                    break;
                }
                else if (ids.length === 1) {
                    game.players[Number(s) - 1].tokens[ids[0]] = -1;
                    extra = {seat: s, id: ids[0], p: -1, dice: this.dice};
                }
            }
            app.io.in(name).emit('token moved', {seat: seat, id: id, p: tokens[id], dice: this.dice, extra: extra});
            var timeLeft = (game._timerStart + conf.timer * 1000) - Date.now();
            var animationTime = tokens[id] === 0 ? 500 : 500 * this.dice;
            if (timeLeft > animationTime) {
                setTimeout(function () {
                    game.nextTurn();
                }, animationTime);
            }
            else {
                game.nextTurn();
            }
        }
    };
    game.checkCell = function (n, seat) {
        var index = seat - 1;
        var cell = {
            1: [],
            2: [],
            3: [],
            4: []
        };
        for (var i = 0; i < 3; i++) {
            index = index === 3 ? 0 : index + 1;
            if (!game.players[index]) continue;
            game.players[index].tokens.forEach(function (token, id) {
                if ((token + 13 * (i + 1)) % 50 === n) {
                    cell[index + 1].push(id);
                }
            });
        }
        return cell;
    };
    games[name] = game;
}
function joinGame(name, user, seat, tokens) {
    var teams = ['red', 'green', 'yellow', 'blue'];
    user.tokens = [-1, -1, -1, -1];
    //user.tokens = tokens;
    user.seat = seat;
    user.team = teams[seat - 1];
    games[name].players[seat - 1] = user;
}
function startGame(name) {
    var game = games[name];
    game.turn = Math.floor(Math.random() * game.players.length);
    game.isStarted = true;

    game.nextTurn()
}
function stopGame(name) {
    var game = games[name];
    game.isStarted = false;
    clearTimeout(game.timer);
}

app.get('/api', function (req, res) {
    //console.log(req.query);
    res.json({test: 'hello world'});
});

app.get('/api/show_game/', function (req, res) {
    var q = req.query;

    if (q.game_id) {
        if (!games[q.game_id]) {
            createGame(q.game_id);
            joinGame(q.game_id, players[0], 1, [18, 19, 20, 21]);
            joinGame(q.game_id, players[1], 2, [12,13,14,15]);
            //joinGame(q.game_id, players[2], 3);
            //joinGame(q.game_id, players[3], 4);
        }
        if (!games[q.game_id].isStarted) {
            startGame(q.game_id);
        }
    }

    if (!q.game_id) {
        res.status(400).json({error: 'Game ID is not provided'});
        return;
    }
    else if (!games[q.game_id]) {
        res.status(400).json({error: 'Game \'' + q.game_id + '\' does not exist'});
        return;
    }
    if (!q.seat) {
        res.status(400).json({error: 'Seat number is not provided'});
        return;
    }
    if (Number(q.seat) < 1 || Number(q.seat > 4)) {
        res.status(400).json({error: 'Seat number is wrong'});
        return;
    }
    req.session.connected = true;
    req.session.game_id = q.game_id;
    req.session.seat = q.seat;
    res.sendFile(path.join(rootDir + '/ludo.html'));
});


app.io.on('connection', function (socket) {
    var session = socket.session;
    if (session.connected) {
        var game = games[session.game_id];
        console.log('connected');
        socket.join(session.game_id);
        socket.on('get game data', function () {
            socket.emit('game data', {
                players: game.players,
                seat: session.seat,
                turn: game.turn,
                dice: game.dice,
                timer: conf.timer,
                timeLeft: (game._timerStart + conf.timer * 1000) - Date.now()
            });
        });
        socket.on('move token', function (id) {
            game.moveToken(session.seat, id);
        });
        socket.on('roll dice', function () {
            if (session.seat - 1 === game.turn && game.dice === 0)
                game.rollDice();
        });
    }

    socket.on('disconnect', function () {
        console.log('disconnected');
    });

});
