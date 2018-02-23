import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './ScoreBoard.less';

export class ScoreBoard extends PureComponent {
  static propTypes = {
    scores: PropTypes.arrayOf(PropTypes.number)
  }

  formatScore(score = 0) {
    const str = score.toString();
    return str.length >= 2 ? str : `0${str}`;
  }

  render() {
    const {scores = []} = this.props;
    return (
      <div className="score-board">
        {scores.map((score, index) => (
          <div key={`scores-${index}`} className={`player-scores player-${index + 1}`}>
            <div className="score-count">{this.formatScore(score)}</div>
            <div className="player-name">player {index + 1}</div>
          </div>
        ))}
      </div>
    )
  }
}