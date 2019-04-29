import React, { Component } from 'react';
import d3 from 'd3';
import TimeSeriesPie from './TimeSeriesPie.js';
import RedditDayFlow from './RedditDayFlow.js';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            commentStream: new EventSource("http://localhost:8080/commentStream"),
            streaming: false,
            submissionData: null,
            commentData: null
        };
        this.state.commentStream.onmessage = this.onCommentRecieved.bind(this);
        this.loadHistoricalData();
    }

    onCommentRecieved(comment) {
        this.setState({comments: this.state.comments.concat([comment.data])});
    }

    componentWillUnmount() {
        this.state.commentStream.close();
    }

    loadHistoricalData() {
        let submissionFile = "/sample_link_UIUC.csv";
        let commentFile = "/sample_comm_UIUC.csv";
        let determineLabel = (comment) => {
            let posScore = comment.posScore;
            let negScore = comment.negScore;
            let neuScore = comment.neuScore;
            if (posScore > negScore && posScore > neuScore)  {
                return "positive";
            } else if (neuScore > posScore && neuScore > negScore) {
                return "neutral";
            } else {
                return "positive";
            }
        };
        d3.csv(submissionFile, submissionData => {
            d3.csv(commentFile, commentData => {
                submissionData.map(s => s.postDate *= 1000) ; // convert to millis
                commentData.map(c => c.sentimentType = determineLabel(c));
                this.setState({
                    commentData: commentData,
                    submissionData: submissionData
                });
            });
        });
    }

    render() {
        return (
            <>
            <h1> Testing Streaming Comments </h1>
            <div>
            {this.state.commentData && this.state.submissionData ? 
                    <RedditDayFlow
                        submissions={this.state.submissionData}
                        comments={this.state.commentData}
                        nRows={4}
                        date={new Date(2019, 3, 27)}
                        />
                    :
                    <p> Loading... </p>
            }
            </div>
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

//let submission1 = {
//    postId: 1,
//    postDate: new Date(2019, 3, 27, 10, 10),
//    upvotes: 100,
//}
//let submission2 = {
//    postId: 2,
//    postDate: new Date(2019, 3, 27, 10, 13, 30),
//    upvotes: 1000,
//}
//let submission3 = {
//    postId: 3,
//    postDate: new Date(2019, 3, 27, 10, 14),
//    upvotes: 5000,
//}
//let submission4 = {
//    postId: 4,
//    postDate: new Date(2019, 3, 27, 11, 17),
//    upvotes: 10000,
//}
//let initialSubmissions = [submission1, submission2, submission3, submission4];
