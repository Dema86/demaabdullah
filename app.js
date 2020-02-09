// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
	this.x = x;
	this.y = y;
	this.speed = 70 + Math.random() * 51; //70 to 120
	
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	
	this.x = Math.floor(this.x + dt * this.speed);
	
	if (this.x > 505 - 101){ //canvas width + image width
		this.x = 0;
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Enemies our player must avoid
class Player {
	
	//constructor
	constructor(x, y) {
		this.initialX = x;
		this.initialY = y;
		this.x = x;
		this.y = y;
		this.xSpeed = 101;
		this.ySpeed = 83;
		this.sprite = 'images/char-boy.png';
		this.score = 0;
	}
	//render player (draw image)
	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}
	
	/*
	* helper to check if two rectangles overlap
	* left1: Top Left coordinate of first rectangle
	* right1: Bottom Right coordinate of first rectangle
	* left2: Top Left coordinate of second rectangle
	* right2: Bottom Right coordinate of second rectangle
	*/
	isOverlap(left1, right1, left2, right2){
				
		var offset = 10;//accept small overlap
		
		// check horizontal
        if (left1[0] > right2[0] - offset || left2[0] > right1[0] - offset) { 
            return false; 
        } 
  
        // check vertical
        if (left1[1] > right2[1] - offset || left2[1] > right1[1] - offset) { 
            return false; 
        } 
  
        return true; 
	}
	
	//check collision, won/lost
	update() {
		
		if (!isRunning()){
			return;
		}
		//check if win
		if (this.y == 0){
			
			this.score += 1;
			var score = this.score;
			pause();
			
			setTimeout(function(){ 
				alert("You won! Your current score is " + score);		
				resetGame(); //reset game, this function also set running to true	
			}, 100);			
					
			return;
		}
		
		/* Loop through all of the objects within the allEnemies array and 
		 * check collision
         */
		for (var i = 0; i < allEnemies.length; i++) {
			
			var enemy = allEnemies[i];
				
			//collision happens if 2 rectanges contains
			if (this.isOverlap([enemy.x, enemy.y], [enemy.x + 101, enemy.y + 83],
				[this.x, this.y], [this.x + 101, this.y + 83])){					
				this.score = 0;							
				pause();
				
				//use setTimeout to render the game
				setTimeout(function(){ 
					alert("You lost! Collision!");	
					resetGame(); //reset game, this function also set running to true	
				}, 100);
				
				return;
			}
		}
		
		/*check getting gem*/
		for (var i = 0; i < gems.length; i++) {
			
			var gem = gems[i];
			
			//collision happens if 2 rectanges contains
			if (gem.isAvailable() &&
					this.isOverlap([gem.x, gem.y], [gem.x + 101, gem.y + 83],
				[this.x, this.y], [this.x + 101, this.y + 83])){
				
				this.score += gem.getScore();		
				//console.log("got " + gem.getScore());
				gem.setAvailable(false);
			}			
		}
		
	}
	
	//direction is left, up, right or down
	handleInput(direction) {
		
		switch (direction){
			case 'left':
				if (this.x - this.xSpeed >= 0){
					this.x -= this.xSpeed;
				}
				break;
			case 'right':
				if (this.x + this.xSpeed <= 404){
					this.x += this.xSpeed;
				}
				
				break;
			case 'up':				
				if (this.y - this.ySpeed >= 0){
					this.y -= this.ySpeed;
				}
				break;
			case 'down':
				if (this.y + this.ySpeed <= 415){
					this.y += this.ySpeed;
				}
				break;
		}
	}
	
	//choose character
	selectCharacter(img){
		this.sprite = 'images/' + img;
	}
	
	reset(){
		this.x = this.initialX;
		this.y = this.initialY;
	}
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

function createAllEnemies(){
	allEnemies = [new Enemy(Math.floor(Math.random() * 450), 62), 
                  new Enemy(0, 150), 
				  new Enemy(100 + Math.floor(Math.random() * 350), 142), 
				  new Enemy(Math.floor(Math.random() * 450), 230)];
}
				  
var player = new Player(202, 415);

//all images to choose
var allImages = ["char-boy.png", "char-cat-girl.png", "char-horn-girl.png", "char-pink-girl.png", "char-princess-girl.png"];

//create class Gem for player to collect to get score
class Gem{
	
	//constructor
	constructor(x, y, spire, score) {
		this.x = x;
		this.y = y;
		this.sprite = spire;
		this.score = score;
		this.available = true; //available to collect
	}
	//render Gem (draw image)
	render() {
		if (this.available){
			ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
		}
	}
	
	//get score of this gem
	getScore(){
		return this.score;
	}
	
	//mutator of available
	setAvailable(avail){
		this.available = avail;
	}
	
	//get available
	isAvailable(){
		return this.available;
	}
};

//gems to collect
var gems = [];

//create gems at random
function createGems(){
	gems = [new Gem(Math.floor(Math.random() * 250), 62, 'images/Gem Blue.png', 5),
			new Gem(Math.floor(Math.random() * 200), 142, 'images/Gem Orange.png', 7),
			new Gem(200 + Math.floor(Math.random() * 250), 142, 'images/Heart.png', 8),
			new Gem(Math.floor(Math.random() * 300), 62, 'images/Key.png', 9),
			new Gem(200 + Math.floor(Math.random() * 250), 230, 'images/Selector.png', 10),
			new Gem(Math.floor(Math.random() * 320), 230, 'images/Star.png', 11),
		];
}


//prompt to choose image
var message = "Please select the image for the player character\n";
message += "1. Boy\n2. Cat Girl\n3. Horn Girl\n4. Pink Girl\n5. Princess Girl\n";
var personImgIndex = parseInt(prompt(message, "1"));
if (personImgIndex >= 1 && personImgIndex <= 5){
	player.selectCharacter(allImages[personImgIndex - 1]);
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
