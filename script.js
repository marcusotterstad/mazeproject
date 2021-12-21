const hat = '^';
const hole = 'O';
const fieldCharacter = '-';
const pathCharacter = '*';

class Field {
    constructor(field, boxSize) {
        this.field = field;
        this.boxSize = boxSize;

    }

    // creates a random field
    static createField(width, height, percentageHoles) {
        
        let totalTiles = width*height;
        let totalHoles = Math.floor(totalTiles * percentageHoles);
        let randomWidth = Math.floor(Math.random() * width + 1);
        let randomHeight = Math.floor(Math.random() * height + 1);


        let returnField = [];
        for (let i = 0; i < height; i++) {
            let row = [];
            for (let j = 0; j < width; j++) {
                row.push("-");     
            }
            returnField.push(row);
        }

        function replaceRandomElement(iterationCount, symbol) {
            for (let i = 0; i < iterationCount; i++) {
                let randomWidth = Math.floor(Math.random() * width);
                let randomHeight = Math.floor(Math.random() * height);  
                returnField[randomHeight][randomWidth] = symbol;
            }
        }

        replaceRandomElement(totalHoles, hole);
        replaceRandomElement(1, pathCharacter);
        replaceRandomElement(1, hat);

        return returnField;
    }

    printField() {
        // declaring width, height and box size of html grid
        const fieldWidth = this.field[0].length * (this.boxSize + 2);
        const fieldHeight = this.field.length * (this.boxSize + 2);

        const game = document.getElementById("game");
        game.style.width = `${fieldWidth}px`;
        game.style.height = `${fieldHeight}px`;
        game.style.gridTemplateColumns = "auto ".repeat(this.field[0].length);

        let boxList = [];

        class Box extends React.Component {
            render() {
                const myStyle = {
                    width:  this.boxSize + "px",
                    height: this.boxSize + "px"
                };

                switch (this.props.character) {
                    case pathCharacter:
                        myStyle.backgroundColor = "blue";
                        break;
                    case hole:
                        myStyle.backgroundColor = "brown";
                        break;
                    case hat:
                        myStyle.backgroundColor = "gold";
                        break;
                }

                return <div id={this.props.unique} key={this.props.unique} style={myStyle}></div>;
            }
        }

        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[i].length; j++) {
                switch (this.field[i][j]) {
                    case pathCharacter:
                        boxList.push(<Box unique={`${i}-${j}`} character={pathCharacter} />);
                        break;
                    case hole:
                        boxList.push(<Box unique={`${i}-${j}`} character={hole} />);
                        break;
                    case hat:
                        boxList.push(<Box unique={`${i}-${j}`} character={hat} />);
                        break;
                    default:
                        boxList.push(<Box unique={`${i}-${j}`} />);
                        break;
                }
            }
        }
        ReactDOM.render(boxList, game);

    }

    findStartingLocation () {
        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[i].length; j++) {
                if(this.field[i][j] === pathCharacter) {
                    return [i,j];
                }
            }
        }
    }

    // checks the character symbols to see if you win, lose or continue the game 
    checkCharacter (char) {

        switch(char) {
            case (hat):
                alert("You found the hat!");
                break;
            case (hole):
                alert("You stepped in a hole and lost.");
                break;
            case (fieldCharacter):
                break;
            case (pathCharacter):
                break;
            default:
                alert("You ran out of bounds!");
                break;
        }
    }
    
    play() {
        // finds the starting y and x values by using findStartingLocation()
        let currentY = this.findStartingLocation()[0];
        let currentX = this.findStartingLocation()[1];
        
        window.requestAnimationFrame(gameLoop);

        var _this = this;
        function gameLoop() {
            _this.printField();

            document.onkeydown = function (e) {
                e = e || window.event;
                switch (e.which || e.keyCode) {
                    case 87 : 
                        currentY -= 1;
                          break;
                    case 83:
                        currentY += 1;
                        break;
                    case 65:
                        currentX -= 1;
                        break;
                    case 68:
                        currentX += 1;
                        break;
                }
            }

            _this.checkCharacter(_this.field[currentY][currentX]);
            _this.field[currentY][currentX] = "*";

            window.requestAnimationFrame(gameLoop);
        }        
    
    }

}


function createCustomField() {

    const boxSizeInput = document.getElementById("boxSize").value;
    const difficultyInput = document.getElementById("difficulty").value;
    const inputWidth = parseInt(document.getElementById("inputWidth").value);
    const inputHeight = parseInt(document.getElementById("inputHeight").value);

    let boxSize;
    let difficulty;

    switch(boxSizeInput) {
        case "small":
            boxSize = 30;
            break;
        case "medium":
            boxSize = 50;
        case "large":
            boxSize = 100;
    }
    switch (difficultyInput) {
        case "easy":
            difficulty = 0.1;
            break;
        case "medium":
            difficulty = 0.2;
            break;
        case "hard": 
            difficulty = 0.6;
            break;
    }

    const yourField = new Field(Field.createField(inputWidth, inputHeight, difficulty), boxSize);
    yourField.play();
}