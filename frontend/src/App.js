import React, { Component } from 'react';
import Stream from 'stream';
import d3 from 'd3';
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

                // create streams from arrays
                const submissionStream = new Stream.Readable({objectMode: true});
                submissionStream._read = () => {};
                submissionData.forEach(item => submissionStream.push(item));
                submissionStream.push(null);

                const commentStream = new Stream.Readable({objectMode: true});
                commentStream._read = () => {};
                commentData.forEach(item => commentStream.push(item));
                commentStream.push(null);

                this.setState({
                    commentData: commentData,
                    submissionData: submissionData,
                    submissionStream: submissionStream,
                    commentStream: commentStream
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
                            submissions={this.state.submissionStream}
                            comments={this.state.commentStream}
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
