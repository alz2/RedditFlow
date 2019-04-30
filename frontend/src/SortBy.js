import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import dimple from 'dimple-js/dist/dimple.latest.js';
import * as d3 from 'd3';
import { startOfDay } from 'date-fns';
import './App.css';

import TimeSeriesPie from './TimeSeriesPie.js';

class SortBy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'Popularity'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }
 
  handleSubmit(event) {
    alert('You want to sort posts by: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Sort the post by : 
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="Popularity">Popularity</option>
            <option value="Date Posted">Date Posted</option>
            <option value="Latest Commented">Latest Commented</option>
            <option value="Time">Time</option>
          </select>
        </label>
        <Button variant="info" onClick={this.handleSubmit}>Submit</Button>
      </form>
    );
  }
}

export default SortBy;
