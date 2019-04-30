import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import dimple from 'dimple-js/dist/dimple.latest.js';
import * as d3 from 'd3';
import { startOfDay } from 'date-fns';
import './App.css';

import TimeSeriesPie from './TimeSeriesPie.js';

class SortBy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'Dynamic'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }
 
  handleSubmit(event) {
    alert('You want to switch to: ' + this.state.value + ' mode');
    event.preventDefault();
  }

  handleSubmit(event) {
    alert('You want to switch to: ' + this.state.value + ' mode');
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <ButtonToolbar aria-label="Toolbar with button groups">
        <ButtonGroup size="lg" className="mr-2" aria-label="First group">
        <Button variant="success" onClick={this.handleSubmit}>Static</Button>
        <Button variant="danger" onClick={this.handleSubmit}>Dynamic</Button>
        </ButtonGroup>
        </ButtonToolbar>
        
      </form>
    );
  }
}

export default SortBy;
