
//! Requiring modules  --  START
var Grass = require("./modules/Grass.js");
var Xotaker = require("./modules/Xotaker.js");
var Gishatich = require("./modules/Gishatich.js");
var Game = require("./modules/Game_over.js");
var Angel = require("./modules/Angel.js");
let random = require('./modules/random');
//! Requiring modules  --  END


//! Setting global arrays  --  START
grassArr = [];
xotakerArr = [];
gishatichArr = [];
gameArr = [];
angelArr = [];
matrix = [];
grassHashiv = 0;
xotakerHashiv = 0;
gishatichHashiv = 0;
gameHashiv = 0;
angelHashiv = 0;
//! Setting global arrays  -- END




//! Creating MATRIX -- START
function matrixGenerator(matrixSize, grass, xotaker, gishatich, game, angel) {
    for (let i = 0; i < matrixSize; i++) {
        matrix[i] = [];
        for (let o = 0; o < matrixSize; o++) {
            matrix[i][o] = 0;
        }
    }
    for (let i = 0; i < grass; i++) {
        let customX = Math.floor(random(matrixSize)); 
        let customY = Math.floor(random(matrixSize)); // 4
        matrix[customY][customX] = 1;
    }
    for (let i = 0; i < xotaker; i++) {
        let customX = Math.floor(random(matrixSize));
        let customY = Math.floor(random(matrixSize));
        matrix[customY][customX] = 2;
    }
    for (let i = 0; i < gishatich; i++) {
        let customX = Math.floor(random(matrixSize));
        let customY = Math.floor(random(matrixSize));
        matrix[customY][customX] = 3;
    }
    for (let i = 0; i < game; i++) {
        let customX = Math.floor(random(matrixSize));
        let customY = Math.floor(random(matrixSize));
        matrix[customY][customX] = 4;
    }
    for (let i = 0; i < angel; i++) {
        let customX = Math.floor(random(matrixSize));
        let customY = Math.floor(random(matrixSize));
        matrix[customY][customX] = 5;
    }
}
matrixGenerator(20, 25, 25 , 25 , 25 , 25);
//! Creating MATRIX -- END



//! SERVER STUFF  --  START
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static("."));
app.get('/', function (req, res) {
    res.redirect('index.html');
});

server.listen(3000);
//! SERVER STUFF END  --  END



function creatingObjects() {
    for (var y = 0; y < matrix.length; y++) {
        for (var x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] == 5) {
                var angel = new Angel(x, y);
                angelArr.push(angel);
                angelHashiv++;
            }
            if (matrix[y][x] == 4) {
                var game = new Game(x, y);
                gameArr.push(game);
                gameHashiv++;
            }
            if (matrix[y][x] == 3) {
                var gishatich = new Gishatich(x, y);
                gishatichArr.push(gishatich);
                gishatichHashiv++;
            }
            if (matrix[y][x] == 2) {
                var xotaker = new Xotaker(x, y);
                xotakerArr.push(xotaker);
                xotakerHashiv++;

            } else if (matrix[y][x] == 1) {
                var grass = new Grass(x, y);
                grassArr.push(grass);
                grassHashiv++;
            }
        }
    }
}
creatingObjects();

function game() {
    if (grassArr[0] !== undefined) {
        for (var i in grassArr) {
            grassArr[i].mult();
        }
    }
    if (xotakerArr[0] !== undefined) {
        for (var i in xotakerArr) {
            xotakerArr[i].eat();
        }
    }
    if (gishatichArr[0] !== undefined) {
        for (var i in gishatichArr) {
            gishatichArr[i].eat();
        }
    }
    if (gameArr[0] !== undefined) {
        for (var i in gameArr) {
            gameArr[i].eat();
        }
    }
    if (angelArr[0] !== undefined) {
        for (var i in angelArr) {
            angelArr[i].eat();
        }
    }



    //! Object to send
    let sendData = {
        matrix: matrix,
        grassCounter: grassHashiv,
        xotakerCounter: xotakerHashiv,
        gishatichCounter: gishatichHashiv,
        gameCounter: gameHashiv,
        angelCounter: angelHashiv,
    }

    //! Send data over the socket to clients who listens "data"
    io.sockets.emit("data", sendData);

}



setInterval(game, 500)