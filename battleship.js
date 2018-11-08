// okreslenie wiadomosc i lokalizacji
var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};

// okreslenie modelu gry, pozycji statkow, pozycji trafionej lub zatopionej
var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	ships: [{locations: ["", "", ""], hits: ["", "", ""]},
			{locations: ["", "", ""], hits: ["", "", ""]},
			{locations: ["", "", ""], hits: ["", "", ""]}],

	fire: function(guess) {
		for (var i = 0; i <this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("TRAFIONY!");
				if (this.isSunk(ship)) {
					view.displayMessage("Zatopiłeś mój okręt!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("Spudłowałeś :(");
		return false;
	},
	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
			return true;
		}
	},
	//generowanie wspolprzednych okretow
	generateShipLocations: function() {
		var locations;
		for (var i = 0; i <this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},
	//generowanie kierunku polozenia okretu - poziomo, pionowo
	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;
		if(direction === 1) {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} else {
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},
	collision: function(locations) {
		for (var i = 0; i <this.numShips; i++) {
			var ship = model.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if(ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
	return false;
	}
};

//walidacja pól
function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	if (guess === null || guess.length !== 2) {
		alert("Ups, proszę wpisać literę i cyfrę!");
	} else {
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);

		if (isNaN(row) || isNaN(column)) {
			alert("Ups! To nie są prawidłowe współrzędne!");
		} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
			alert("Ups! Pole poza planszą!");
		} else {
			return row + column;
		}
	}
	return null;
}

//sprawdzanie czy zostaly zatopione okrety
var controller = {
	guesses: 0,

	processGuess: function(guess) {
		var location = parseGuess(guess);
		if(location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("Zatopiłeś wszystkie moje okręty, w " + this.guesses + " próbach.");
			}
		}
	}
};


function init() {
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();
}

function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess);
	guessInput.value = "";
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

window.onload = init;