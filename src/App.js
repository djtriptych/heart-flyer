import React, { Component } from 'react';
import heart from './heart.png'
import './App.css';

import pixels from './pixels.json';

const INTERVAL = 1000;
const BUFFER_SIZE = 25;
const SIZE = 25;
const DEFAULT = [255, 255, 255, 0];

const bufferStyle = {
  width: `${SIZE * BUFFER_SIZE}px`,
  height: `${SIZE * BUFFER_SIZE}px`,
};

const matrix = size =>
  Array(size).fill().map(()=>Array(size).fill(DEFAULT));

matrix.I = (x, y, color) => color;

const mmap = (matrix, f) =>
  matrix.map((row, r) =>
    row.map((col, c) => f(r, c, matrix[r][c], matrix)));

const cmap = (matrix, color1, color2) => {
  const [a1, b1, c1, d1] = color1;
  const mapper = (x, y, color) => {
    const [a2, b2, c2, d2] = color;
    if (a1 === a2 &&
        b1 === b2 &&
        c1 === c2 &&
        d1 === d2) {
      return color2;
    }
    return color;
  }
  return mmap(matrix, mapper);
};

const print = (buffer, bitmap, sx, sy) => {
  bitmap.map((row, y) =>
    row.map((_, x) => {
      const px = sx + x;
      const py = sy + y;
      if (px < buffer.length && py < buffer.length) {
        buffer[px][py] = bitmap[x][y];
      }
    }));
};

const scramble = matrix => {
  const f = (x, y, color, M) => {
    const [r, g, b, a] = color;
    if (r && g < 255) {
      return [r - Math.random() * 5, g, b, 1];
    } else {
      return color;
    }

  };
  return mmap(matrix, f);
};

const pixelStyle = (x, y, pixelSize, color, tick=1) => {
  const [r, g, b, a] = color;
  return {
    cursor: 'pointer',
    //boxShadow: '0 0 1px rgba(0, 0, 0, 0.5)',
    //transition: `all 500ms`,
    transition: `all ${x * 50}ms`,
    transform: `scale(1.5)`,
    width: pixelSize,
    height: pixelSize,
    left: x * pixelSize,
    top: y * pixelSize,
    //borderTopLeftRadius: `${Math.random() * 50}%`,
    //borderBottomRightRadius: `${Math.random() * 50}%`,
    borderRadius: `${Math.random() * 50}%`,
    backgroundColor: `rgba(${r},${g},${b},${a})`,
    position: 'absolute',
  };
};

class Pixel extends Component {
  render() {
    const {x, y, color, tick} = this.props;
    const style = pixelStyle(x, y, SIZE, color, tick);
    const id = `p-${x}-${y}`;
    return (
      <div id={id} className='pixel' style={style} />
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.canvas = React.createRef();
    this.state = {
      bx: 5,
      by: 3,
      tick: 0,
    };
  }

  componentDidMount() {
    window.setInterval(() => {
      const { bx, by, tick } = this.state;
      this.setState({
        bx,
        by,
        tick: tick + 1,
      })
    }, INTERVAL)
  }

  render() {
    const buffer = matrix(BUFFER_SIZE);
    const heart = scramble(cmap(pixels, [0, 0, 0, 0], [255, 255, 255, 0]));
    //const heart = cmap(pixels, [0, 0, 0, 0], [255, 255, 255, 0]);
    print(buffer, heart, this.state.bx, this.state.by);
    return (
      <div className="App">
        <div style={bufferStyle} className='buffer'>
          {
            buffer.map((row, y) =>
              row.map((_, x) =>
                <Pixel color={buffer[x][y]} x={x} y={y} tick={this.state.tick} />
              )
            )
          }

          <div class='info'>
            valentine's day <br />
            kenan \ donwill <br />
            bed vyne cocktail <br />
            9p - late <br />
          </div>

        </div>
      </div>
    );
  }
}

export default App;
