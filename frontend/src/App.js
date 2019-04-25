import React, { Component } from 'react'
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            commentStream: new EventSource("http://localhost:8080/commentStream")
        };
        this.state.commentStream.onmessage = this.onCommentRecieved.bind(this);
    }

    onCommentRecieved(comment) {
        console.log(comment);
        console.log(this);
        console.log(this.state);
        this.setState({comments: this.state.comments.concat([comment.data])});
    }

    componentWillUnmount() {
        this.state.commentStream.close();
    }

    render() {
        return (
            <>
            <h1> Testing Streaming Comments </h1>
            <div>
                {this.state.comments.map(c => (
                    <p>{c}</p>
                ))}
            </div>
            </>
        )
    }

}

export default App;
