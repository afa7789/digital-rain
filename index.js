
const currency = '¹²³£¢$¤¥֏₠₡₢₣₤₥₦₩₫€₭₱₲₳₴₵₶₷₸₹₺₽₾₿';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nums = '0123456789';

const alphabet = currency + latin + nums;
const fontSize = 16;

const ColorTable = {
    0: "#FFFFFF",
    1: "#CCFFCC",
    2: "#99FF99",
    3: "#66CC66",
    4: "#339933",
}

//////// Classes

class RainColumn {

    columnLength = 0; // number of characters in column, can't be more than the height of the screen

    startingIteration = 0; // iteration
    arrayRainColumn = []; // array of charactersMatrix
    columnY = 0; // y position of the column
    columnX = 0; // x position of the column

    constructor(length, currentIter, x, y) {
        this.columnLength = length;
        this.startingIteration = currentIter;
        this.columnX = x;
        this.columnY = y;
    }

    isAlive(iteration) {
        return (this.columnLength * 2 ) + this.startingIteration > iteration;
    }

    addNewCharacter(iteration) {
        let newCharacter = new CharactersMatrix(
            document.createElement('p'),
            iteration - this.startingIteration,
            this.columnX,
            this.columnY
        );
        this.arrayRainColumn.push(newCharacter);
        document.body.appendChild(newCharacter.element);
    }

    next(iteration) {
        if (this.isAlive(iteration))
            this.arrayRainColumn.forEach((character, index) => {
                if (!character.next((this.startingIteration) + index, this.columnLength)) {
                    character.kill();
                    this.arrayRainColumn.splice(index, 1);
                }
            });
        this.addNewCharacter(iteration)
    }

    kill() {
        this.arrayRainColumn.forEach(character => {
            character.kill();
        });
    }
}

class CharactersMatrix {
    currentCharacter = ''; // current character
    currentColor = ''; // current color

    currentOpacity = 1;
    iteration = 0;
    decayTime = 0; // decay time of the character in miliseconds

    characterY = 0; // y position of the character
    characterX = 0; // x position of the character
    element = null; // HTML element

    constructor(element, currentIteration, columnX, columnY) {
        element.style.position = 'absolute';
        this.element = element;

        this.currentCharacter = getRandomCharacter();
        this.characterX = columnX + (randomNormal() - 0.5);
        this.characterY = columnY + (currentIteration * 10);
        this.currentColor = ColorTable[this.iteration]

        this.updateElement();
    }

    next(currentIteration, columnLength) {
        this.iteration++;

        this.characterX = this.characterX + (((randomNormal() * 2) - 1) * 0.1);


        if (this.iteration > 5) {

            let citer = currentIteration > columnLength ? columnLength : currentIteration;

            let calculation = ( ( citer / columnLength ) )

            this.currentOpacity = (calculation > 0) ? calculation : 0;
            if (this.currentOpacity == 0) {
                this.updateElement();
                return false;
            }
        } else {
            this.currentColor = ColorTable[this.iteration];
        }

        if (randomNormal() > 0.6) {
            this.currentCharacter = getRandomCharacter();
        }

        this.updateElement();
        return true;
    }

    kill() {
        this.element.remove();
    }

    // Method to update the element's position, color, and character
    updateElement() {
        this.element.style.left = this.characterX + 'px';
        this.element.style.top = this.characterY + 'px';
        this.element.style.color = this.currentColor;
        this.element.style.opacity = this.currentOpacity;
        this.element.innerHTML = this.currentCharacter;
    }
}

/////// HELPER functions
// function get random character from alphabet 
function getRandomCharacter() {
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}

// gaussian random number distribution from 0 to 1
// Box-Muller transform.
function randomNormal() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// starting point
window.onload = function () {
    console.log( "ready")

    let iteration = 0;
    let rainColumns = [];

    let width = window.innerWidth;
    let height = window.innerHeight;
    let originalHeight = window.innerHeight;
    let numberOfCharactersColumns = Math.ceil(width / fontSize);
    console.log ( "width ", width)


    // event to change width/ height in resize event
    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        numberOfCharactersColumns = Math.ceil(width / fontSize);
    });

    console.log( "number",numberOfCharactersColumns)


    for (let i = 0; i < numberOfCharactersColumns; i++) {
        rainColumns.push(null)
    }

    // main loop
    setInterval(() => {
        // create rain columns
        for (let i = 0; i < numberOfCharactersColumns; i++) {
            if (rainColumns[i] == null) {
                let newRainColumn = new RainColumn(
                    Math.ceil((height / fontSize) * randomNormal()),
                    iteration,
                    i * fontSize,
                    randomNormal() * randomNormal() * originalHeight
                );
                rainColumns[i]=newRainColumn;
            }

            if (rainColumns[i] != null) {
                if (rainColumns[i]?.isAlive(iteration)) {
                    rainColumns[i].next(iteration);
                } else {
                    rainColumns[i].kill();
                    rainColumns[i] = null;
                }
            }

        }
        iteration++;
    }, 10000 / 60);
}