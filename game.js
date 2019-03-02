var canvas; //handle on the info of the dimentions of the display area
var canvasContext; //the underlying graphics such as adding shapes and images

var ballX = 50;  //x horizontal position of ball
var ballSpeedX = 10;
var ballY = 50;  //y vertical position of ball
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 5;

var showWinScore = false;

var leftPaddleY = 250; 
var rightPaddleY = 250; 
const PADDLE_HEIGHT = 100; //length of paddle
const PADDLE_THICKNESS = 10;

function calculateMousePos(event) { //function fires when there's a event where the mouse moves. The event holds the coordinate data.
	var rect = canvas.getBoundingClientRect(); //this is the canvas
	var root = document.documentElement;
	var mouseX = event.clientX - rect.left - root.scrollLeft; //accounts for where on the page the canvas is, how far the browser is scrolled, we subract these values to get the x value within the payable area. has nothing to do with our position on the canvas. 
	var mouseY = event.clientY - rect.top - root.scrollTop; //accounts for where on the page the canvas is, how far the browser is scrolled, we subract these values to get the y value within the payable area. has nothing to do with our position on the canvas. 
		return { 
		x: mouseX,
		y: mouseY
	}; 
} //if we only get the x and y values from the event, the event doesn't care for where on the page the canvas is or when the page is scrolled. The values will always be the same.

window.onload = function() {
			canvas = document.getElementById('gameCanvas'); //fill the canvas with gameCanvas
			canvasContext = canvas.getContext('2d');
			canvasContext.font = '20px serif';
			var framesPerSecond = 30;
			setInterval(function () {
				drawEverything();
				moveEverything();
			}, 1000/framesPerSecond);
			
			canvas.addEventListener('mousemove', 
				function(event) {
					var mousePos = calculateMousePos(event);
					leftPaddleY = mousePos.y - (PADDLE_HEIGHT/2);
				});
			canvas.addEventListener('mousedown', handleMouseClick);
} //as soon as window finishes loading, then run the function 
//order matters, the later it is, it will overlap the earlier ones 

function handleMouseClick(event) {
	if(showWinScore) {
		drawEverything();
		moveEverything();
		moveEverything();
		player1Score = 0;
		player2Score = 0;
		showWinScore = false;
	}
}

function ballReset() {
	if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
		showWinScore = true;
}
		ballSpeedX = -ballSpeedX;
		ballX = canvas.width/2;
		ballY = canvas.height/2;

	}

function colorRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor; 
	canvasContext.fillRect(leftX, topY, width, height); //first two values are how far from the left and the top and they set the values of the top-left corner of the box, the last two are the size of the coordinates
}

function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor; 
	canvasContext.beginPath(); 
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true) // creates the circle, first to arguements are measurements from the center of the circle, third arg is the radius, third and fourth has to do with radians, last arg is the opposite values
	canvasContext.fill(); //fills the circle

}

function drawNet() {
	for(var i = 0; i < canvas.height; i += 40) {
		colorRect(canvas.width/2-1, i, 2, 20, 'white'); //left paddle
	}
}
function drawEverything() {
	colorRect(0, 0, canvas.width, canvas.height, 'green'); //canvas
	colorRect(5, leftPaddleY, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white'); //left paddle
	colorRect(canvas.width-PADDLE_THICKNESS - 5, rightPaddleY, PADDLE_THICKNESS, PADDLE_HEIGHT , 'white'); //right paddle
	colorCircle(ballX, ballY, 7, 'white'); //ball, third variable is radius 
	if(showWinScore) {
		if(player1Score >= WINNING_SCORE) {
			canvasContext.fillText("Player 1 Won!", 357, 230);
		} else if(player2Score >= WINNING_SCORE){
			canvasContext.fillText("Player 2 Won!", 357, 230);
		}
		canvasContext.fillText("Click To Continue", 340, 260);
		return;
	}
	drawNet();
	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width-150, 100);
}

function computerMovement() {
	var rightPaddleCenter = rightPaddleY + (PADDLE_HEIGHT/2)
	if(rightPaddleCenter < ballY - 35) {
		rightPaddleY += 6;
	} else if(rightPaddleCenter > ballY + 35)  {
		rightPaddleY -= 6;
	}
}

function moveEverything() {
	if(showWinScore) {
		return;
	} // stops game
	computerMovement();

	ballX += ballSpeedX; //not hardcoding it maintains the speed
	ballY += ballSpeedY;
	
	if(ballX > canvas.width - PADDLE_THICKNESS - 10) {
		if(ballY > rightPaddleY && 
			ballY < rightPaddleY + PADDLE_HEIGHT) {
				ballSpeedX = -ballSpeedX;
				var deltaY = ballY - (rightPaddleY + PADDLE_HEIGHT/2);
					ballSpeedY = deltaY * 0.35;
				} else {
					player1Score++;
					ballReset();
					}
	} 
	else if(ballX < PADDLE_THICKNESS + 15) {
		if(ballY > leftPaddleY && 
			ballY < leftPaddleY + PADDLE_HEIGHT) {
				ballSpeedX = -ballSpeedX;
				var deltaY = ballY - (leftPaddleY + PADDLE_HEIGHT/2);
					ballSpeedY = deltaY * 0.35;
			} else {
					player2Score++;
					ballReset();
					}

	} else if(ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	} else if(ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
}


