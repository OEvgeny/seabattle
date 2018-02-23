import React, { Component } from 'react';
import { DashBoard } from './components/DashBoard';
import './App.less';


class App extends Component {
  render() {
    return (
      <div className="App">
        <DashBoard />
      </div>
    );
  }
}

export default App;
