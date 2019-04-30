import React, { Component } from 'react';
import Stream from 'stream';
import d3 from 'd3';
import RedditDayFlow from './RedditDayFlow.js';
import logo from './logo.svg';
import './App.css';
import { ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

let key = 0; // global key for react updates :(

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backendUrl: "http://localhost:8080/",
            comments: [],
            commentStream: null,
            submissionStream: null,
            streaming: false,
        };
        this.toggleLive = this.toggleLive.bind(this);
        this.loadHistoricalData();
    }

    onCommentRecieved(comment) {
        this.setState({comments: this.state.comments.concat([comment.data])});
    }

    componentWillUnmount() {
        this.cleanupStreams();
    }

    determineLabel(comment) {
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

    loadHistoricalData() {
        let submissionFile = "/sample_link_UIUC.csv";
        let commentFile = "/sample_comm_UIUC.csv";
        d3.csv(submissionFile, submissionData => {
            d3.csv(commentFile, commentData => {
                submissionData.map(s => s.postDate *= 1000) ; // convert to millis
                commentData.map(c => c.sentimentType = this.determineLabel(c));

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
                    submissionStream: submissionStream,
                    commentStream: commentStream
                });
            });
        });
    }

    initCommentStream(subredditName) {
        let es = new EventSource(this.state.backendUrl + "commentStream?r="+subredditName);
        const commentStream = new Stream.Readable({objectMode: true});
        commentStream._read = () => {};
        es.onmessage = item => {
            let json = JSON.parse(item.data);
            json.sentimentType = this.determineLabel(json);
            commentStream.push(json);
        };
        this.setState({
            commentStream: commentStream,
            commentEventSource: es
        });
    }

    initSubmissionStream(subredditName) {
        let es = new EventSource(this.state.backendUrl + "submissionStream?r="+subredditName);
        const submissionStream = new Stream.Readable({objectMode: true});
        submissionStream._read = () => {};
        es.onmessage = item => submissionStream.push(JSON.parse(item.data));
        this.setState({
            submissionStream: submissionStream,
            submissionEventSource: es
        });
    }

    cleanupStreams() {
        // close event sources
        this.state.commentEventSource.close();
        this.state.submissionEventSource.close();
        // close streams
        this.state.submissionStream.push(null);
        this.state.commentStream.push(null);
    }

    toggleLive(toggleValue, event) {
        let streaming = !!toggleValue;
        if (streaming) { // create streams
            this.initCommentStream("AskReddit");
            this.initSubmissionStream("AskReddit");
            this.setState({streaming: streaming});
        } else { // close existing streams
            this.setState({streaming: streaming});
            this.cleanupStreams();
            this.loadHistoricalData();
        }
    }

    render() {
        key += 1;
        return (
            <>
            <div className="d-flex justify-content-center">
                <ButtonToolbar>
                    <ToggleButtonGroup type="radio" name="options" defaultValue={0} onChange={this.toggleLive}>
                        <ToggleButton variant="success" value={0}>Historical Data</ToggleButton>
                        <ToggleButton variant="danger" value={1}>Live</ToggleButton>
                    </ToggleButtonGroup>
                </ButtonToolbar>
            </div>
            <div>
                {this.state.commentStream && this.state.submissionStream? 
                    <>
                    <RedditDayFlow
                        key={key}
                        submissions={this.state.submissionStream}
                        comments={this.state.commentStream}
                        nRows={4}
                        date={this.state.streaming ? Date.now() : new Date(2019, 3, 27)}
                    />
                    </>
                    :
                    <p> Loading... </p>
                }
            </div>
            
            </>
        )
    }
}

export default App;
//<div>
//    {this.state.comments.map(c => (
//        <p>{c}</p>
//    ))}
//</div>
