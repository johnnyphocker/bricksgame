var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var ballX = canvas.width/2;
var ballY = canvas.height/2;
var ballSpeedX = 5;
var ballSpeedY = 8;

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 60;
var paddleX = 400;

const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_COLS = 10;
const BRICK_ROWS = 14;
const BRICK_GAP = 2;

var brickGrid = new Array(BRICK_COLS);
var bricksLeft = 0;

var mouseX;
var mouseY;

var framesPerSecond = 30;
setInterval(updateAll, 1000/framesPerSecond);

canvas.addEventListener('mousemove', updateMousePos);
brickReset();
ballReset();

function brickReset() {
	bricksLeft = 0;

	for(var i = 0; i < 3 * BRICK_COLS; i ++) {
		brickGrid[i] = false;
	}

	for(var i = 3 * BRICK_COLS; i < BRICK_COLS * BRICK_ROWS; i ++) {
		brickGrid[i] = true;
		bricksLeft++;
	}
}

function updateMousePos(e) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = e.clientX - rect.left - root.scrollLeft;
	mouseY = e.clientY - rect.top - root.scrollTop;
	paddleX = mouseX - PADDLE_WIDTH / 2;
}

function ballBrickHandling() {
	var ballBrickCol = Math.floor(ballX / BRICK_W);
	var ballBrickRow = Math.floor(ballY / BRICK_H);
	var brickIndexUnderball = rowColToArrayIndex(ballBrickCol, ballBrickRow);
	if(ballBrickCol >= 0 && ballBrickCol < BRICK_COLS && ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {
			if(brickGrid[brickIndexUnderball]) {
				brickGrid[brickIndexUnderball] = false;
				bricksLeft--;
				var prevballX = ballX - ballSpeedX;
				var prevballY = ballY - ballSpeedY;
				var prevBrickCol = Math.floor(prevballX / BRICK_W);
				var prevBrickRow = Math.floor(prevballY / BRICK_H);
				var bothTestsFailed = true;
				if(prevBrickCol != ballBrickCol) {
					var adjBrickSide = rowColToArrayIndex(prevBrickCol,ballBrickRow);
					if(brickGrid[adjBrickSide] == false) {
						ballSpeedX *= -1;
						bothTestsFailed = false;
					}
				}

				if(prevBrickRow != ballBrickRow) {
					var adjBrickTopBot = rowColToArrayIndex(ballBrickCol,prevBrickRow);
					if(brickGrid[adjBrickTopBot] == false) {
						ballSpeedY *= -1;
						bothTestsFailed = false;
					}
				}

				if(bothTestsFailed) {
					ballSpeedX *= -1;
					ballSpeedY *= -1;
				}
			}
	}
}

function ballPaddleHandling() {
	var paddleTopEdgeY = canvas.height-PADDLE_DIST_FROM_EDGE;
	var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
	var paddleLeftEdgeX = paddleX;
	var paddleRightEdgeX = paddleX + PADDLE_WIDTH;

	if(ballY > paddleTopEdgeY && ballY < paddleBottomEdgeY && ballX > paddleLeftEdgeX && ballX < paddleRightEdgeX) {
		ballSpeedY *= -1;

		var centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
		var ballDistFromPaddleCenterX = ballX - centerOfPaddleX; 
		ballSpeedX = ballDistFromPaddleCenterX * 0.35;

		if(bricksLeft == 0) {
			brickReset();
		}
	}
}

function moveAll() {

	ballMove();
	ballBrickHandling();
	ballPaddleHandling()

}

function drawBricks() {
	for(var row = 0; row < BRICK_ROWS; row++) {
		for(var col = 0; col < BRICK_COLS; col++) {
			var arrayIndex =  rowColToArrayIndex(col, row);
			if(brickGrid[arrayIndex]) {
				colorRect(BRICK_W*col,BRICK_H*row,BRICK_W-BRICK_GAP,BRICK_H-BRICK_GAP,'blue');
			}
		}
	}
}

function rowColToArrayIndex(col, row) {
	return BRICK_COLS * row + col;
}

function drawAll() {

	colorRect(0,0,canvas.width,canvas.height,'black');
	colorRect(paddleX,canvas.height-PADDLE_DIST_FROM_EDGE,PADDLE_WIDTH,PADDLE_THICKNESS,'white');
	colorCircle(ballX,ballY,10,'white');
	drawBricks();

}

function ballReset() {
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

function ballMove() {
	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if(ballX > canvas.width) {
		ballSpeedX *= -1;
	}

	if(ballX < 0) {
		ballSpeedX *= -1;
	}

	if(ballY > canvas.height) {
		ballReset();
		brickReset();
	}

	if(ballY < 0) {
		ballSpeedY *= -1;
	}
}

function colorRect(x,y,width,height,color) {
	ctx.fillStyle = color;
	ctx.fillRect(x,y,width,height);
}

function colorCircle(x,y,r,color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x,y,r,0,Math.PI*2,true);
	ctx.fill();
}

function colorText(str,x,y,color) {
	ctx.fillStyle = color;
	ctx.fillText(str,x,y)
}

function updateAll() {
	moveAll();
	drawAll();
}


