var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var sizeInput = document.getElementById("size");
var changeSize = document.getElementById("change-size");
var scoreLabel = document.getElementById("score");
var startNewGame = document.getElementById("start");
var bestScoreLabel = document.getElementById("best-score");

var bestScore = [];
var score = 0;
var size = 4;
var width = canvas.width / size - 6;

var cells = [];
var fontSize;
var loss = false;

startNewGame.onclick = function(){
	startGame();
	startNewGame.style.visibility = 'hidden';
	canvas.style.opacity = "1";
	loss = false;
	score = 0;
}

function canvasClear(){
	ctx.clearRect(0 ,0 , 550, 550);
};

startGame();

function startGame(){
	createCells();
	drawAllCells();
	pasteNewCell();
	pasteNewCell();
};

function cell(row, coll){
	this.value = 0;
	this.x = coll * width + 5 * (coll + 1);
	this.y = row * width + 5 * (row + 1);
};

function createCells(){
	for(var i = 0; i < size; i++){
		cells[i] = [];
		for(var j = 0; j <= size; j++){
			cells[i][j] = new cell(i, j);
		}
	}
};

function drawCell(cell) {
	ctx.beginPath();
	ctx.rect(cell.x, cell.y, width, width);

	switch (cell.value){
		case 0 : ctx.fillStyle = "#DF99FB"; break;
		case 2 : ctx.fillStyle = "#FA46EC"; break;
		case 4 : ctx.fillStyle = "#D446FA"; break;
		case 8 : ctx.fillStyle = "#A346FA"; break;
		case 16 : ctx.fillStyle = "#6A46FA"; break;
		case 32 : ctx.fillStyle = "#46B2FA"; break;
		case 64 : ctx.fillStyle = "#46FAF0"; break;
		case 128 : ctx.fillStyle = "#46FA79"; break;
		case 256 : ctx.fillStyle = "#BCFA46"; break;
		case 512 : ctx.fillStyle = "#FAF146"; break;
		case 1024 : ctx.fillStyle = "#FAC346"; break;
		case 2048 : ctx.fillStyle = "#FA8D46"; break;
		case 4096 : ctx.fillStyle = "#FA5946"; break;
		default : ctx.fillStyle = "#FFFFFF";
	} 
	ctx.fill();
	if (cell.value){
		fontSize = width / 2;
		ctx.font = fontSize + "px Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText(cell.value, cell.x + width / 2, cell.y + width / 2);
	}
};

function drawAllCells(){
	for(var i = 0; i < size; i++){
		for(var j = 0; j < size; j++){
			drawCell(cells[i][j]);
		}
	}
};

function pasteNewCell(){
	var countFree = 0;
	for(var i = 0; i < size; i++){
		for(var j = 0; j < size; j++){
			if(!cells[i][j].value){
				countFree++;
			}
		}
	}
	if(!countFree){
		finishGame();
		return;
	}
	while (true){
		var row = Math.floor(Math.random() * size);
		var coll = Math.floor(Math.random() * size);
		if (!cells[row][coll].value){
			cells[row][coll].value = 2 * Math.ceil(Math.random() * 2);
			drawAllCells();
			return;
		}
	}
};

document.onkeydown = function (event){
	if(!loss){
		if(event.keyCode == 38 || event.keyCode == 87) moveUp();
		else if(event.keyCode == 39 || event.keyCode == 68) moveRight();
		else if(event.keyCode == 40 || event.keyCode == 83) moveDown();
		else if(event.keyCode == 37 || event.keyCode == 65) moveLeft();
		scoreLabel.innerHTML = "Score : " + score;
		if(bestScore < score){
			bestScoreLabel.innerHTML = "Best Score : " + score;
		}
	}
};

function moveUp(){
	for(var j = 0; j < size; j++){
		for(var i = 1; i < size; i++){
			if(cells[i][j].value){
				var row = i;
				while (row > 0){
					if(!cells[row - 1][j].value){
						cells[row - 1][j].value = cells[row][j].value;
						cells[row][j].value = 0;
						row--;
					}
					else if(cells[row - 1][j].value == cells[row][j].value){
						cells[row - 1][j].value *= 2;
						score += cells[row - 1][j].value;
						cells[row][j].value = 0;
						break;
					}
					else break;
				}
			}
		}
	}
	pasteNewCell();
};

function moveDown(){
	for(var j = 0; j < size; j++){
		for(var i = size - 2; i >= 0; i--){
			if(cells[i][j].value){
				var row = i;
				while (row + 1 < size){
					if(!cells[row + 1][j].value){
						cells[row + 1][j].value = cells[row][j].value;
						cells[row][j].value = 0;
						row++;
					}
					else if(cells[row + 1][j].value == cells[row][j].value){
						cells[row + 1][j].value *= 2;
						score += cells[row + 1][j].value;
						cells[row][j].value = 0;
						break;
					}
					else break;
				}
			}
		}
	}
	pasteNewCell();
};

function moveRight(){
	for(var i = 0; i < size; i++){
		for(var j = size - 2; j >= 0; j--){
			if(cells[i][j].value){
				var coll = j;
				while (coll + 1 < size){
					if(!cells[i][coll + 1].value){
						cells[i][coll + 1].value = cells[i][coll].value;
						cells[i][coll].value = 0;
						coll++;
					}
					else if(cells[i][coll].value == cells[i][coll + 1].value){
						cells[i][coll + 1].value *= 2;
						score += cells[i][coll + 1].value;
						cells[i][coll].value = 0;
						break;
					}
					else break;
				}
			}
		}
	}
	pasteNewCell();
};

function moveLeft(){
	for(var i = 0; i < size; i++){
		for(var j = 1; j < size; j++){
			if(cells[i][j].value){
				var coll = j;
				while (coll - 1 >= 0){
					if(!cells[i][coll - 1].value){
						cells[i][coll - 1].value = cells[i][coll].value;
						cells[i][coll].value = 0;
						coll--;
					}
					else if(cells[i][coll].value == cells[i][coll - 1].value){
						cells[i][coll - 1].value *= 2;
						score += cells[i][coll - 1].value;
						cells[i][coll].value = 0;
						break;
					}
					else break;
				}
			}
		}
	}
	pasteNewCell();
};

function finishGame(){
	canvas.style.opacity = "0.5";
	loss = true;
	startNewGame.style.visibility = 'visible';
};














