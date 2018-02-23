import React, { PureComponent } from 'react';
import { Field, Cell } from './Field';
import { ScoreBoard } from './ScoreBoard';
import { genRandomField, CELL_STATE } from '../helpers/field'

import './DashBoard.less';

// images for cells
import hitImg from '../assets/hit.png';
import missImg from '../assets/miss.png';

// images for ships
import aircraftImg from '../assets/aircraft-shape.png';
import battleshipImg from '../assets/battleship-shape.png';
import cruiserImg from '../assets/cruiser-shape.png';
import submarineImg from '../assets/submarine-shape.png';
import carrierImg from '../assets/carrier-shape.png';
import { ShipBoard } from './ShipBoard';

const cellAttrs = {
  [CELL_STATE.MISS]: { tag: 'image', xlinkHref: missImg },
  [CELL_STATE.HIT]: { tag: 'image', xlinkHref: hitImg }
};

const shipsLayout = [
  { size: 5, image: aircraftImg },
  { size: 4, image: battleshipImg },
  { size: 3, image: cruiserImg },
  { size: 3, image: submarineImg },
  { size: 2, image: carrierImg }
];

const GAME_MODE = {
  PLAYER_1: 'player-1',
  OVER: 'over'
};

const FIELD_SIZE = 10;

export class DashBoard extends PureComponent {

  state = {
    size: FIELD_SIZE,
    mode: GAME_MODE.PLAYER_1,
    [GAME_MODE.PLAYER_1]: {
      ...genRandomField(FIELD_SIZE, shipsLayout)
    }
  }

  /**
   * Update cell on a given field
   * @param {Array<Array<Object>>} field - field to update
   * @param {number} x - x coordinate of cell to update
   * @param {number} y - y coordinate of cell to update
   * @param {any} data - data to update
   * @returns {Array<Array<Object>>}
   */
  updateCell(field, x, y, data = {}) {
    if (!field || !field[x] || !field[x][y]) {
      return field;
    }
    const newField = field.slice();
    newField[x] = newField[x].map((c, i) => i === y ? { ...c, ...data }: c);
    return newField;
  }

  /**
   * Update ship and return fresh ships array
   * @param {Array<Object>} ships - ships to update
   * @param {number} index - ship to update
   * @param {any} data - data to change
   * @returns {Array<Object>}
   */
  updateShip(ships, index, data = {}) {
    if (!ships || !ships[index]) {
      return ships;
    }
    const newShips = ships.slice();
    newShips[index] = {
      ...newShips[index],
      ...data
    }
    return newShips;
  }

  /**
   * Perform player stroke and return a new player state
   * @param {Object} state - previous player state
   * @param {Object} cell - cell to update
   * @returns {Object} new player state or nothing if nothing to update
   */
  ply({ field, ships }, cell) {
    if (cell.state === CELL_STATE.EMPTY || cell.state === CELL_STATE.SHIP) {
      const newField = this.updateCell(field, cell.x, cell.y, { state: cell.state === CELL_STATE.SHIP ? CELL_STATE.HIT : CELL_STATE.MISS });
      const newShips = cell.ship !== -1 ? this.updateShip(ships, cell.ship, { life: ships[cell.ship].life - 1 }) : ships;
      return {
        mode: newShips.every(ship => ship.life === 0) ? GAME_MODE.OVER : GAME_MODE.PLAYER_1,
        player: {
          field: newField,
          ships: newShips
        }
      }
    }
  }

  /**
   * Reset game state
   * @returns {Object} fresh game state
   */
  reset() {
    return {
      mode: GAME_MODE.PLAYER_1,
      [GAME_MODE.PLAYER_1]: genRandomField(FIELD_SIZE, shipsLayout)
    }
  }

  /**
   * Handle game actions
   * @param {any} data - action data
   */
  handleAction = (data) => {
    this.setState(state => {
      switch (state.mode) {
        case GAME_MODE.OVER:
          return this.reset();
        case GAME_MODE.PLAYER_1:
          const {x, y} = data;
          const playerState = state[state.mode]
          const cell = playerState.field[x][y];
          const result = this.ply(playerState, cell);
          return result && {
            mode: result.mode,
            [state.mode]: result.player
          };
        default:
          return;
      }
    })
  }

  getCells(field) {
    return [].concat(...field).filter(cell => cell.state === CELL_STATE.MISS || cell.state === CELL_STATE.HIT)
  }

  getScroes(state) {
    const player = this.state[GAME_MODE.PLAYER_1].ships.reduce((acc, ship) => acc + (ship.size - ship.life), 0);
    return [player, 0];
  }

  renderCell = (cell) => {
    const { x, y } = cell;
    return <Cell key={`cell-${x}-${y}`} x={x} y={y} {...(cellAttrs[cell.state] || {})} />
  }

  render() {
    const { mode } = this.state;
    const isGameOver =  mode === GAME_MODE.OVER;
    const playerName = isGameOver ? GAME_MODE.PLAYER_1 : mode;
    const cells = this.getCells(this.state[playerName].field);
    return (
      <div className="dashboard" {...this.props}>
        <div className="main-board">
          <ScoreBoard scores={this.getScroes(this.state)} />
          <ShipBoard className="main-shipboard" ships={this.state[playerName].ships} />
        </div>
        <div className="play-field player-1">
          <Field onCellClick={this.handleAction} renderCell={this.renderCell} cells={cells} />
          {isGameOver ? (
            <div className="game-over">
              Game over <br/>
              <button type="button" className="reset-button" onClick={this.handleAction}>Restart</button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
