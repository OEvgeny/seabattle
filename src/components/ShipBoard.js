import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './ShipBoard.less';

export class ShipBoard extends PureComponent {
  static propTypes = {
    ships: PropTypes.arrayOf(PropTypes.shape({
      image: PropTypes.string,
      life: PropTypes.number,
      size: PropTypes.number
    }))
  }

  renderHits(ship) {
    const hits = [];
    for (let i = 0; i < ship.size; i++) {
      hits.push(<div key={`ship-hit-${i}`} className={`ship-hitpoint ${ship.size - i > ship.life ? 'hit' : 'ok'}`}></div>);
    }
    return hits;
  }

  render() {
    const {ships = [], className = ''} = this.props;
    return (
      <div className={`ship-board ${className}`}>
        {ships.map((ship, index) => (
          <div key={`ship-${index}`} className='ship'>
            <div className="ship-image"><img src={ship.image} alt={`Ship of size ${ships.size}`} /></div>
            <div className="ship-hits">{this.renderHits(ship)}</div>
          </div>
        ))}
      </div>
    )
  }
}
