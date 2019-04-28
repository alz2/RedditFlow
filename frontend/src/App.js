import React, { Component } from 'react';
import TimeSeriesPie from './TimeSeriesPie.js';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            commentStream: new EventSource("http://localhost:8080/commentStream"),
            streaming: false,
        };
        this.state.commentStream.onmessage = this.onCommentRecieved.bind(this);
    }

    onCommentRecieved(comment) {
        this.setState({comments: this.state.comments.concat([comment.data])});
    }

    componentWillUnmount() {
        this.state.commentStream.close();
    }

    render() {
        let submission1 = {
            postId: 1,
            postDate: new Date(2019, 3, 27, 10, 10),
            upvotes: 100,
        }
        let submission2 = {
            postId: 2,
            postDate: new Date(2019, 3, 27, 10, 13, 30),
            upvotes: 1000,
        }
        let submission3 = {
            postId: 3,
            postDate: new Date(2019, 3, 27, 10, 14),
            upvotes: 5000,
        }
        let submission4 = {
            postId: 4,
            postDate: new Date(2019, 3, 27, 10, 17),
            upvotes: 10000,
        }
        let initialSubmissions = [submission1, submission2, submission3, submission4];
        return (
            <>
            <h1> Testing Streaming Comments </h1>
            <TimeSeriesPie submissions={initialSubmissions}/>
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
