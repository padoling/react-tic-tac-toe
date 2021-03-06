import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// render square buttons
function Square(props) {
  const className = 'square' + (props.winnerSquare ? ' winner-square' : '');
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// render 9 squares
class Board extends React.Component {
  renderSquare(i) {
    const winnerLine = this.props.winnerLine;
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winnerSquare={winnerLine && winnerLine.includes(i)}
      />
    );
  }

  createBoard() {
    let board = [];
    for(let i=0; i<3; i++) {
      let row = [];
      for(let j=0; j<3; j++) {
        row.push(this.renderSquare(i*3 + j));
      }
      board.push(<div key={i} className="board-row">{row}</div>);
    }
    return board;
  }

  render() {
    return (
      <div>{this.createBoard()}</div>
    );
  }
}

// render entire game board
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        currentSquare: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  // handle event when one of the square is clicked
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        currentSquare: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  // jump to steps in history
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerStat = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const num = step.currentSquare;
      const desc = move ? 
      'Go to move #' + move + ' location (' + (parseInt(num/3) + 1) + ',' + (num%3 + 1) + ')' :
      'Go to game start';
      return (
        <li key={move}>
          <button className={move === this.state.stepNumber ? 'current-move' : ''} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    let winnerLine;
    if(winnerStat) {
      status = 'Winner: ' + winnerStat.winner;
      winnerLine = winnerStat.winnerLine;
    } else if(this.state.stepNumber === 9) {
      status = 'Draw!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winnerLine={winnerLine}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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
      return {
        winner: squares[a],
        winnerLine: lines[i],
      }
    }
  }
  return null;
}