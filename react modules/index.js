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
        <li>
          <label>
            <input
              type="radio"
              value="20"
              checked={this.state.size === "20"}
              onChange={this.handleChange}
            />
            20
          </label>
        </li>
        
        <li>
          <label>
            <input
              type="radio"
              value="10"
              checked={this.state.size === "10"}
              onChange={this.handleChange}
            />
            10
          </label>
        </li>

        <li>
          <label>
            <input
              type="radio"
              value="5"
              checked={this.state.size === "5"}
              onChange={this.handleChange}
            />
            5
          </label>
        </li>
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
