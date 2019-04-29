class App extends React.Component {
  render() {
    return (
       <div>
        <AppName />
        <SortBy />
        <PostsPerLine />
        </div>
      
    );
  }
}

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
        <input type="submit" value="Submit" />
      </form>
    );
  }
}


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
        <input type="submit" value="Make your choice" />
      </form>
    );
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
