import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button 
            className={props.comboGagnant?'winning-case square':'square'}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );    
}
  
class Board extends React.Component {
    renderSquare(i) {
        return <Square
            key={i}
            value={this.props.squares[i]}
            comboGagnant={this.props.comboGagnant.includes(i)}
            onClick={() => { this.props.onClick(i) }}
        />;
    }
  
    render() {
        const row = [0,3,6];
        const col = [0,1,2];
        return (
            <div>
                {row.map((r) => (
                    <div key={r} className="board-row">
                        {col.map((c) => (
                            this.renderSquare(c+r)
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                position: "",
                player: "",
                haveWinner: false,
            }],
            xIsNext: true,
            stepNumber: 0,
            order: "ASC",
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares).gagnant || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext?"X":"O";
        this.setState({
            history: history.concat([{
                squares: squares,
                position: squareToPosition(i),
                player: this.state.xIsNext?"X":"O",
                haveWinner: false,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            
        })
    }

    jumpTo (step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step%2) === 0,
        });
    }

    newGame () {
        this.setState({
            history: [{
                squares: Array(9).fill(null),
                position: "",
                player: "",
                haveWinner: false,
            }],
            xIsNext: true,
            stepNumber: 0,
            order: "ASC",

        });

         return null;
    }

    reversed () {
        this.setState({
            order: this.state.order==="ASC"?"DESC":"ASC"
        })
    }


    render() {
        const history = this.state.history.slice();
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? 
            'Joueur '+ step.player +' à jouer en '+ step.position +'' :
            'Revenir au début de la partie';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} className={move === this.state.stepNumber?"button button-active mr-5":step.haveWinner?"button button-gold mr-5":"button button-primary mr-5"}>Voir</button>{desc}
                </li>
            )
        });
        let status;
        if(winner.gagnant) {
            status = winner.gagnant + ' à gagné la partie !';
            current.haveWinner = true;
        } else {
            if (current.squares.includes(null)) {
                status = 'Prochain joueur : ' + (this.state.xIsNext?"X":"O");
            } else {
                status = 'Match NUL !';
            }

        }

        return (
            <div>
                <div className="game">
                    <div className="game-buttons">
                        <button className={"button button-primary"} onClick={() => this.reversed()}>Ordre chronologique : {this.state.order==="ASC"?"Décroissant":"Croissant"}</button>
                        <button className={"button button-active ml-5"} onClick={() => this.newGame()}>Redémarrer la partie</button>
                    </div>
                </div>
                <div className="game">
                    <div className="game-board">
                        <Board 
                            squares={current.squares}
                            onClick={(i) => this.handleClick(i)}
                            comboGagnant={winner.comboGagnant}
                        />
                    </div>
                    <div className="game-info">
                        <div>
                            {status}
                        </div>
                        <ol reversed={this.state.order!=="ASC"}>
                            {this.state.order!=="ASC"?moves.reverse():moves}
                        </ol>
                    </div>
                </div>
            </div>
        );
    }
}
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {'gagnant': squares[a], 'comboGagnant': lines[i]};
      }
    }
    return {'gagnant': null, 'comboGagnant': []};
  }

function squareToPosition(i) {
    const position = [
        "(Col: 1, Ligne: 1)",
        "(Col: 1, Ligne: 2)",
        "(Col: 1, Ligne: 3)",
        "(Col: 2, Ligne: 1)",
        "(Col: 2, Ligne: 2)",
        "(Col: 2, Ligne: 3)",
        "(Col: 3, Ligne: 1)",
        "(Col: 3, Ligne: 2)",
        "(Col: 3, Ligne: 3)",
    ]

    return position[i];
}