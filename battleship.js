

var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [{ locations: ["", "", ""], hits: ["", "", ""] },
             { locations: ["", "", ""], hits: ["", "", ""] },
             { locations: ["", "", ""], hits: ["", "", ""] }],
    misses: [],
    hits: [],

    fire: function(guess) {
        for (i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            console.log(guess);
            var index = ship.locations.indexOf(guess);
            // repeated hit
            if (ship.hits[index] === "hit") {
                this.hits.push(guess);
                view.displayMessage("Already hit there.");
                return true;
            // repeat miss
            } else if (this.misses.indexOf(guess) >= 0) {
                this.misses.push(guess);
                view.displayMessage
                view.displayMessage("Already missed there.");
                return false;
            // hit
            } else if (index >= 0) {
                ship.hits[index] = "hit";
                this.hits.push(guess);
                view.displayHit(guess);
                view.displayMessage("HIT!");
                if (this.isSunk(ship)) {
                    view.displayMessage("You sunk a ship!");
                    this.shipsSunk++
                }
                return true;
            }
        }
        // missed
        this.misses.push(guess);
        view.displayMiss(guess);
        view.displayMessage("Missed.");
        return false;
    },
    
    isSunk: function(targetShip) {
        for (i = 0; i < this.shipLength; i++) {
            if (targetShip.hits[i] != "hit") {
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function() {
        var i = 0;
        while (i < this.numShips) {
            var newShip = this.generateShip();
                if (this.collison(newShip) === false) {
                    this.ships[i].locations = newShip;
                    i++;
                }
        }
        view.displayMessage("Enemy fleet detected! Enter target grid.");
    },

    generateShip: function() {
        var locations = [];
        
        var direction = Math.floor(Math.random()*2);
        if(direction === 0) { // horizontal
            var row = Math.floor(Math.random()*(this.boardSize));
            var column = Math.floor(Math.random()*(this.boardSize - this.shipLength + 1));
            for (i = 0; i < this.shipLength; i++) {
                locations.push(row + "" + (column + i));
            }
            
        } else { // vertical
            var column = Math.floor(Math.random()*(this.boardSize));
            var row = Math.floor(Math.random()*(this.boardSize - this.shipLength + 1));
            for (i = 0; i < this.shipLength; i++) {
                locations.push((row + i) + "" + column);
            }
        }
        return locations;
    },

    collison: function(newShip) {
        for (i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            for (j = 0; j < this.shipLength; j++) {
                if(ship.locations.indexOf(newShip[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }

};


var view = {

    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function(location) {
        locationStr = String(location);
        var cell = document.getElementById(locationStr);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function(location) {
        locationStr = String(location);
        var cell = document.getElementById(locationStr);
        cell.setAttribute("class", "miss");
    }
};


var controller = {
    guesses:  0,

    processGuess: function(guess) {
        var target = parseGuess(guess);
        if (target) {
            this.guesses++;
            var hit = model.fire(target);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("Congrats, you sunk the fleet in " + this.guesses + " shots!")
            } 
        }
    }







};


// PARSE GUESS function

function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"]; // !!! must be correct for board size!!!
    var numbers = ["0", "1", "2", "3", "4", "5", "6"]; // !!! must be correct for board size!!!
    
    var row = guess.charAt(0).toUpperCase();
    var column = guess.charAt(1);

    if (((alphabet.indexOf(row)) === -1) || (numbers.indexOf(column) === -1)) {
        view.displayMessage("*** Oops. Guess must be a letter plus number on the board ***");
        return null;
    } else {
        return (String((alphabet.indexOf(row)) + column)); // recombine to sting
    }
}


// event handlers

function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
	controller.processGuess(guess);

    guessInput.value = "";
    guessInput.focus();
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");

	// in IE9 and earlier, the event object doesn't get passed
	// to the event handler correctly, so we use window.event instead.
	e = e || window.event;

	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

function handleResetButton() {
    var confirm = prompt("are you sure - type YES to reset");
    if (confirm.toUpperCase != null) {
        location.reload();
        return false;
    }
    
}




// init - called when the page has completed loading

window.onload = init;

function init() {
	// Fire! button onclick handler
	var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    
    // focus cursor in text field
    var guessInput = document.getElementById("guessInput");
    guessInput.focus();

	// handle "return" key press
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	// place the ships on the game board
    model.generateShipLocations();
    console.log(model.ships);

    //reset button
    var resetButton = document.getElementById("resetButton");
    resetButton.onclick = handleResetButton;

}
