import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './Field.less';

export class Field extends PureComponent {
  static propTypes = {
    size: PropTypes.number,
    cells: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    })),
    renderCell: PropTypes.func.isRequired,
    onCellClick: PropTypes.func.isRequired
  };
  static defaultProps = {
    size: 10,
    renderCell: (state) => <Cell {...state}/>,
    onCellClick: () => {}
  };

  handleCellClick = (event) => {
    const { size } = this.props;
    const { width, height } = event.currentTarget.getBoundingClientRect();
    const { offsetX, offsetY } = event.nativeEvent;
    const x = Math.floor(offsetX / (width / size));
    const y = Math.floor(offsetY / (height / size));
    this.props.onCellClick({x, y});
  }

  renderCells(list) {
    const cells = [];
    for (const cell of list) {
      cells.push(this.props.renderCell(cell));
    }
    return cells;
  }

  render () {
    const { size, cells, renderCell, onCellClick, className = '', ...passthrough } = this.props
    const fieldSize = size;
    return (
      <svg 
        viewBox={`0 0 ${fieldSize} ${fieldSize}`} 
        className={`field ${className}`}
        onClick={this.handleCellClick}
        {...passthrough}
      >
        <g>
          {this.renderCells(cells)}
        </g>
      </svg>
    )
  }
}

export class Cell extends PureComponent {
  render () {
    const { tag: Tag = 'rect', width = 1, height = 1, ...passthrough } = this.props;
    return <Tag width={width} height={height} {...passthrough}/>
  }
}
