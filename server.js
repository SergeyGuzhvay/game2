var conf = require('./config');
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');
var options = {secret: 'ludo'};
var app = require('sockpress').init(options);
var port = (process.env.PORT) ? process.env.PORT : 80;
var rootDir = __dirname + '/client';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(app.express.static(rootDir));
app.listen(port);
console.log('Server running on port ' + port);

var testPlayers = [
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


function createGame(gameId) {
    var game = {
        isReady: false,
        isStarted: false,
        players: [],
        dice: 0,
        turn: -1,
        extraRoll: 2,
        tokenMoved: false,
        lastActiveTime: Date.now(),
        automatedTurn: function () {
            if (this.checkWinner()) {
                //clearTimeout(this.timer);
                return;
            }
            if (Date.now() - this.lastActiveTime > 1000 * 60 * 5) {
                destroyGame(gameId);
                return;
            }
            //clearTimeout(this.timer);
            if (this.extraRoll && this.dice === 6) {
                this.extraRoll--;
            }
            else {
                this.extraRoll = 2;
                for (var i = 0; i < 4; i++) {
                    this.turn = this.turn === (this.players.length - 1) ? 0 : this.turn + 1;
                    if (this.players[this.turn]) break;
                }
            }
            this.tokenMoved = false;
            this.dice = Math.floor(Math.random() * 6) + 1;
            function shuffle(o){
                for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                return o;
            }
            var tokenIds = shuffle([0, 1, 2, 3]);
            var tokenId;
            for (var i = 0; i < 4; i++) {
                if (!this.players[this.turn]) continue;
                var token = this.players[this.turn].tokens[tokenIds[i]];
                if (token !== 56) {
                    tokenId = tokenIds[i];
                    break;
                }
            }
            this.moveToken(this.turn + 1, tokenId);
            app.io.in(gameId).emit('next turn', this.turn);
            this._timerStart = Date.now();
            this.timer = setTimeout(function () {
                game.automatedTurn();
            }, conf.timer * 1000);
        },
        checkWinner: function () {
            var winner = false;
            this.players.forEach(function (player) {
                var finishedTokens = 0;
                player.tokens.forEach(function (token) {
                    if (token === 56) {
                        finishedTokens++;
                    }
                });
                if (finishedTokens === 4) {
                    winner = player;
                }
            });
            if (winner) {
                request.post(
                    {
                        uri: conf.winUri,
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            game_id: gameId,
                            winner_id: winner.id
                        })
                    },
                    function (error, response, body) {
                        if (error) {}
                    }
                );
            }
            return winner;
        },
        nextTurn: function () {
            if (this.checkWinner()) {
                destroyGame(gameId);
                return;
            }
            if (Date.now() - this.lastActiveTime > 1000 * 60 * 5) {
                destroyGame(gameId);
                return;
            }
            clearTimeout(this.timer);
            //if (!this.extraRoll && this.dice === 6) {
            //    this.nextTurn();
            //    return;
            //}
            if (this.extraRoll && this.dice === 6) {
                this.extraRoll--;
            }
            else {
                this.extraRoll = 2;
                this.turn = this.turn === (this.players.length - 1) ? 0 : this.turn + 1;
            }
            this.tokenMoved = false;
            this.dice = 0;
            app.io.in(gameId).emit('next turn', this.turn);
            this._timerStart = Date.now();
            this.timer = setTimeout(function () {
                game.nextTurn();
            }, conf.timer * 1000);
        },
        rollDice: function () {
            this.dice = Math.floor(Math.random() * 6) + 1;
            if (conf.dev) {
                //this.dice = 6;
            }
            var activeTokens = false;
            this.players[this.turn].tokens.forEach(function (token) {
                if (token !== -1 && token !== 56) activeTokens = true;
            });
            if (this.dice === 6 && !this.extraRoll) {
                var game = this;
                setTimeout(function () {
                    game.nextTurn();
                }, 3500);
            }
            else if (!activeTokens && this.dice !== 6) {
                var game = this;
                var timeLeft = (game._timerStart + conf.timer * 1000) - Date.now();
                if (timeLeft + 300 > 3000) {
                    setTimeout(function () {
                        game.nextTurn();
                    }, 3000);
                }
            }
            app.io.in(gameId).emit('dice', {
                turn: this.turn,
                dice: this.dice
            });
        },
        moveToken: function (seat, id) {
            this.lastActiveTime = Date.now();
            if (seat - 1 !== this.turn) return;
            if (!this.dice || this.tokenMoved) return;
            if (this.dice === 6 && !this.extraRoll) return;
            var tokens = this.players[seat - 1].tokens;
            if (!conf.dev) {
                if (tokens[id] === -1 && this.dice !== 6) return;
            }
            if (tokens[id] === 56) return;
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
            app.io.in(gameId).emit('token moved', {seat: seat, id: id, p: tokens[id], dice: this.dice, extra: extra});
            this.tokenMoved = true;
            var timeLeft = (game._timerStart + conf.timer * 1000) - Date.now();
            var animationTime = tokens[id] === 0 ? 500 : 500 * this.dice + 500;
            if (timeLeft > animationTime) {
                setTimeout(function () {
                    game.nextTurn();
                }, animationTime);
            }
            //else {
            //    game.nextTurn();
            //}
        }
    };
    game.checkCell = function (token, seat) {
        var convert = function (token, index) {return (token + 13 * (index)) % 52};
        //var token = convert(n, seat - 1);
        var cell = {
            1: [],
            2: [],
            3: [],
            4: []
        };
        game.players.forEach(function (player, index) {
            if (index === seat -1) return;
            player.tokens.forEach(function (token2, id) {
                if (token2 === -1) return;
                if (token > 50 || token2 > 50) return;
                if (convert(token, seat - 1) === convert(token2, index)) {
                    cell[index + 1].push([id]);
                }
            });
        });
        return cell;
    };
    games[gameId] = game;
}
function joinGame(name, user, seat, tokens) {
    var teams = ['red', 'green', 'yellow', 'blue'];
    if (conf.dev) {
        user.tokens = tokens;
        user.seat = seat;
    }
    else {
        user.tokens = [-1, -1, -1, -1];
        user.seat = games[name].players.length + 1;
    }
    user.team = teams[user.seat - 1];
    games[name].players[user.seat - 1] = user;
    if (user.seat > 1) games[name].isReady = true;
    return user.seat;
}
function startGame(name, auto) {
    var game = games[name];
    game.turn = Math.floor(Math.random() * game.players.length);
    game.isStarted = true;
    if (auto) {
        game.automatedTurn();
    }
    else {
        game.nextTurn()
    }
}
function destroyGame(name) {
    var game = games[name];
    //game.isStarted = false;
    clearTimeout(game.timer);
    delete games[name];
}

app.get('/', function (req, res) {
    //res.set('Content-Type', 'text/html');
    //res.send('<h2 style="text-align: center; margin-top: 100px"><a href="http://feidos.xyz/miskio_ludo/">API description here</a></h2>');
    res.end();
});
app.get('/api', function (req, res) {
    //console.log(req.query);
    res.status(400).json({error: 'No request'});
});

app.post('/api/create_game', function (req, res) {
    var gameId = req.body.game_id;
    if (!gameId) {
        res.status(400).json({
            error: 'Game Id is not provided'
        })
    }
    else if (games[gameId]) {
        res.status(403).json({
            error: 'Game with this ID already created'
        })
    }
    else {
        createGame(gameId);
        res.json({
            message: 'Game was successfully created'
        })
    }
});
app.get('/api/game_info/:game_id', function (req, res) {
    var gameId = req.params.game_id;
    if (!gameId) {
        res.status(400).json({
            error: 'Game Id is not provided'
        })
    }
    else if (!games[gameId]) {
        res.status(403).json({
            error: 'Game with this ID does\'t exist'
        })
    }
    else {
        var game = games[gameId];
        res.json({
            players:  game.players.length,
            isReady: game.isReady,
            isStarted: game.isStarted
        });
    }
});
app.post('/api/join_game', function (req, res) {
    var gameId = req.body.game_id;
    var userId = Number(req.body.user_id);
    var userName = String(req.body.user_name);
    var userAvatar = String(req.body.user_avatar);
    if (!gameId) {
        res.status(400).json({
            error: 'Game Id is not provided'
        })
    }
    else if (!games[gameId]) {
        res.status(403).json({
            error: 'Game with this ID does\'t exist'
        })
    }
    else {
        var game = games[gameId];
        if (userId && userName && userAvatar) {
            var user = {
                id: userId,
                name: userName,
                avatar: userAvatar
            };
            for (var p in game.players) {
                var player = game.players[p];
                if (player.id === userId) {
                    res.status(403).json({
                        error: 'User with this ID already joined'
                    });
                    return;
                }
            }
            if (game.players.length >= 4) {
                res.status(403).json({
                    error: 'Game is full'
                });
                return;
            }
            var seat = joinGame(gameId, user);
            res.json({
                seat: seat
            });
        }
        else {
            res.status(403).json({
                error: 'Bad user data provided'
            })
        }

    }
});
app.post('/api/start_game', function (req, res) {
    var gameId = req.body.game_id;
    if (!gameId) {
        res.status(400).json({
            error: 'Game Id is not provided'
        });
        return;
    }
    if (!games[gameId]) {
        res.status(404).json({
            error: 'Game with this ID does\'t exist'
        });
        return;
    }
    var game = games[gameId];
    if (!game.isReady) {
        res.status(403).json({
            error: 'Game is not ready'
        });
        return;
    }
    if (game.isStarted) {
        res.status(403).json({
            error: 'Game already started'
        });
        return;
    }
    startGame(gameId);
    res.json({
        message: 'Game started successfully'
    })
});
app.get('/api/show_game/:game_id/:seat', function (req, res) {
    var gameId = req.params.game_id;
    var seat = req.params.seat;

    if (conf.dev) {
        var gameId = 'test';
        if (!games[gameId]) {
            createGame(gameId);
            joinGame(gameId, testPlayers[0], 1, [56, -1, -1, -1]);
            joinGame(gameId, testPlayers[1], 2, [-1, -1, -1, -1]);
            //joinGame(gameId, testPlayers[2], 3, [-1, -1, -1, -1]);
            //joinGame(gameId, testPlayers[3], 4, [-1, -1, -1, -1]);
        }
        if (!games[gameId].isStarted) {
            startGame(gameId);
        }
    }

    if (!gameId) {
        res.status(400).json({
            error: 'Game Id is not provided'
        });
        return;
    }
    else if (!games[gameId]) {
        res.status(404).json({
            error: 'Game with this ID does\'t exist'
        });
        return;
    }

    if (!gameId) {
        res.status(400).json({error: 'Game ID is not provided'});
        return;
    }
    else if (!games[gameId]) {
        res.status(404).json({error: 'Game \'' + gameId + '\' does not exist'});
        return;
    }
    if (!seat) {
        res.status(400).json({error: 'Seat number is not provided'});
        return;
    }
    if (Number(seat) < 1 || Number(seat > 4)) {
        res.status(400).json({error: 'Seat number is wrong'});
        return;
    }
    req.session.connected = true;
    req.session.game_id = gameId;
    req.session.seat = seat;
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
