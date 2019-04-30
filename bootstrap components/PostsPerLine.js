import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import dimple from 'dimple-js/dist/dimple.latest.js';
import * as d3 from 'd3';
import { startOfDay } from 'date-fns';
import './App.css';

import TimeSeriesPie from './TimeSeriesPie.js';

class PostsPerLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '10'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('You want to sort posts by: ' + this.state.value + ' Per Line');
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Select # of Posts per line : 
          <ul>
        
          <label>
            <input
              type="radio"
              value="20"
              checked={this.state.value === "20"}
              onChange={this.handleChange}
            />
            20
          </label>
  

  <div >
  <input type="radio" value="15" checked={this.state.value === "15"} onChange={this.handleChange} />
  <span class="wrappable">one radio per row version, up to you</span>
  </div>
        
          <label>
            <input
              type="radio"
              value="10"
              checked={this.state.value === "10"}
              onChange={this.handleChange}
            />
            10    
          </label>
       

       
          <label>
            <input
              type="radio"
              value="5"
              checked={this.state.value === "5"}
              onChange={this.handleChange}
            />
            5
          </label>
       
      </ul>
        </label>
        <Button variant="warning" onClick={this.handleSubmit}>Make your choice</Button>
      </form>
    );
  }
}

export default PostsPerLine;
