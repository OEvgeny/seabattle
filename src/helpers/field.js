
/**
 * Generate random value in interval [min, max)
 * @param {number} max - top limit (unreachable)
 * @param {number} min - bottom limit
 * @returns {number}
 */
function random (max, min = 0) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Shuffle array with Fisher-Yates Shuffle algorithm
 * @param {Array} array - array to shuffle
 * @returns {Array}
 */
function shuffle(array) {
  let counter = array.length;

  while (counter > 0) {
      let index = random(counter);

      counter--;

      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
  }

  return array;
}

export const CELL_STATE = {
  MISS: 'miss',
  HIT: 'hit',
  SHIP: 'ship',
  EMPTY: 'empty'
}

const ORIENTATION = {
  HORIZONTAL: 0,
  VERTICAL: 1
}
/**
 * Check if there is any ship on field in up/down/left/right of (x, y)
 * @param {Array<Array>} field - field to look on
 * @param {number} x - x lookup coordinate
 * @param {number} y - y lookup coordinate
 * @returns {boolean} 
 */
function isShipAround(field, x, y) {
  const minX = Math.max(x - 1, 0);
  const minY = Math.max(y - 1, 0);
  const maxX = Math.min(x + 1, field.length - 1);
  const maxY = Math.min(y + 1, field[0].length - 1);
  return field[x][y].ship !== -1 || field[minX][y].ship !== -1 || field[x][minY].ship !== -1
    || field[maxX][y].ship !== -1 || field[x][maxY].ship !== -1;
}

/**
 * Get all places for a ship of size in the field
 * @param {Array<Array>} field - field to search in
 * @param {number} size - ship size
 * @returns {Array}
 */
function getPlaces(field, size) {
  const places = [];
  for (let x = 0; x < field.length; x++) {
    for (let y = 0; y < field[x].length; y++) {
      // For X axis
      if (x + size < field.length) {
        let i = x;
        for (; i < x + size; i++) {
          if (isShipAround(field, i, y)) {
            break;
          }
          if (i === x + size - 1) {
            places.push([x, y, ORIENTATION.HORIZONTAL]);
          }
        }
      }

      // For Y axis
      if (y + size < field[x].length) {
        let j = y;
        for (; j < y + size; j++) {
          if (isShipAround(field, x, j)) {
            break;
          }
          if (j === y + size - 1) {
            places.push([x, y, ORIENTATION.VERTICAL])
          }
        }
      }
    }
  }

  return places;
}

/**
 * Places a ship to the given field
 * @param {*} field - field to place a ship
 * @param {*} ship - ship to place
 * @param {Array<Number>} - coordinates and orientation
 * @returns {void}
 */
function placeTo(field, ship, [x, y, orientation]) {
  if (orientation === ORIENTATION.HORIZONTAL) {
    for (let i = x; i < x + ship.size; i++) {
      field[i][y].ship = ship.index;
      field[i][y].state = CELL_STATE.SHIP; 
    }
  }
  if (orientation === ORIENTATION.VERTICAL) {
    for (let j = y; j < y + ship.size; j++) {
      field[x][j].ship = ship.index;
      field[x][j].state = CELL_STATE.SHIP;
    }
  }
}

/**
 * Create an empty cell
 * @param {any} - cell params to set
 * @returns {Object}
 */
function createCell({ x, y, state = CELL_STATE.EMPTY, ship = -1 } = {}) {
  return { state, x, y, ship }
}

/**
 * Create an empty field of given size
 * @param {number} size - size of field 
 * @param {Object} data - data to add to every cell on the field
 * @returns {Array<Array<Object>>} 
 */
function createField(size, data) {
  const field = new Array(size);
  for (let i = 0; i < size; i++) {
    field[i] = new Array(size);
    for (let j = 0; j < size; j++) {
      field[i][j] = createCell({ x: i, y: j, ...data});
    }
  }

  return field;
}

/**
 * Fill field with randomly placed ships
 * @param {Array<Array<Object>>} field - field to fill
 * @param {Array<Object>} shipsToCreate - ships to add
 * @returns {Object}
 */
function fillRandom(field, shipsToCreate) {
  let ships = []
  for (const ship of shipsToCreate) {
    const index = ships.length;
    const places = getPlaces(field, ship.size);
    if (places.length) {
      const placeIndex = random(places.length);
      const newShip = {
        index: index,
        life: ship.size,
        ...ship
      };
      placeTo(field, newShip, shuffle(places)[placeIndex])
      ships.push(newShip);
    } else {
      console.warn('Can not find any place for ship', ship, 'no much space!');
    }
  }
  return { ships, field };
}

/**
 * Generates a randow field for game of given size
 * @param {number} size - size of the field to generate
 * @param {Array<Object>} ships - ships defieiniton
 * @returns {Object} 
 */
export function genRandomField(size, ships) {
  return fillRandom(createField(size), ships);
}
