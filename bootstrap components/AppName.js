import React, { Component } from 'react';
import dimple from 'dimple-js/dist/dimple.latest.js';
import * as d3 from 'd3';
import { startOfDay } from 'date-fns';
import './App.css';

import TimeSeriesPie from './TimeSeriesPie.js';

class AppName extends React.Component {
  render() {
    return (
       <header>
    <nav>
      <h1>
        <a href="/">Reddit-Flow</a>
      </h1>
    </nav>
  </header>
    );
  }
}

export default AppName;
