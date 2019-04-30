import React, { Component } from 'react';
import Stream from 'stream';
import d3 from 'd3';
import RedditDayFlow from './RedditDayFlow.js';
import logo from './logo.svg';
import { ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import './App.css';
import "./btn.css";

let key = 0; // global key for react updates :(

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backendUrl: "http://localhost:8080/",
            comments: [],
            commentStream: null,
            submissionStream: null,
            value: "UIUC",
            streaming: false,
            dateMap: {
                "UIUC": new Date(2019, 3, 27),
                "uwaterloo": new Date(2019, 3, 29),
                "nyu": new Date(2019, 3, 29),
                "ucla": new Date(2019, 3, 29),
                "aggies": new Date(2019, 3, 29)
            },
            liveSubreddit: "AskReddit"
        };
        this.toggleLive = this.toggleLive.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadHistoricalData();
    }

    handleChange(event) {
        console.log(event.target.value);
        this.setState({value: event.target.value}, () => {
            this.cleanupStreams();
            this.loadHistoricalData();
        });
    }

    handleSubmit(event) {
        alert('Your dataset right now is: ' + "/sample_link_" + this.state.value + ".csv");
        event.preventDefault();
    }

    componentWillUnmount() {
        this.cleanupStreams();
    }

    determineLabel(comment) {
        let posScore = comment.posScore;
        let negScore = comment.negScore;
        let neuScore = comment.neutralScore;
        if (posScore > negScore && posScore > neuScore)  {
            return "positive";
        } else if (neuScore > posScore && neuScore > negScore) {
            return "neutral";
        } else {
            return "positive";
        }
    };

    loadHistoricalData() {
        let submissionFile = "/sample_link_" + this.state.value + ".csv";
        let commentFile = "/sample_comm_" + this.state.value + ".csv";
        console.log(submissionFile);
        console.log(commentFile);
        // let submissionFile = "/sample_link_UIUC.csv";
        // let commentFile = "/sample_comm_UIUC.csv";
        d3.csv(submissionFile, submissionData => {
            d3.csv(commentFile, commentData => {
                submissionData.map(s => s.postDate *= 1000) ; // convert to millis
                commentData.map(c => c.sentimentType = this.determineLabel(c));

                console.log(commentData);

                // create streams from arrays
                const submissionStream = new Stream.Readable({objectMode: true});
                submissionStream._read = () => {};
                submissionData.forEach(item => submissionStream.push(item));
                submissionStream.push(null);

                this.setState({submissionStream: submissionStream})

                const commentStream = new Stream.Readable({objectMode: true});
                commentStream._read = () => {};
                commentData.forEach(item => commentStream.push(item));
                commentStream.push(null);

                this.setState({
                    commentStream: commentStream
                });

                let cDist = {
                    "positive": 0,
                    "negative": 0,
                    "neutral": 0
                }
                commentData.forEach(c => cDist[c.sentimentType] += 1);
                console.log(cDist);
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
        if (this.state.commentEventSource) {
            this.state.commentEventSource.close();
        }
        if (this.state.submissionEventSource) {
            this.state.submissionEventSource.close();
        }
        // close streams
        this.state.submissionStream.push(null);
        this.state.submissionStream.destroy();
        this.state.commentStream.push(null);
        this.state.commentStream.destroy();
    }

    toggleLive(toggleValue, event) {
        let streaming = !!toggleValue;
        if (streaming) { // create streams
            this.initCommentStream(this.state.liveSubreddit);
            this.initSubmissionStream(this.state.liveSubreddit);
            this.setState({streaming: streaming});
        } else { // close existing streams
            this.setState({streaming: streaming});
            this.cleanupStreams();
            this.loadHistoricalData();
        }
    }

    searchLiveSubreddit(e) {
        e.preventDefault();
        let textIn = document.getElementById("SubredditSearch");
        let subredditName = textIn.value;
        console.log("SWITCHING TO " + subredditName);
        this.cleanupStreams();
        this.initCommentStream(subredditName);
        this.initSubmissionStream(subredditName);
        this.setState({liveSubreddit: subredditName});
    }

    render() {
        key += 1;
        return (
            <>
            <div>
                { ! this.state.streaming && 
                        <form onSubmit={this.handleSubmit}>
                            <label>
                                Pick a Subreddit:
                                <select onChange= {this.handleChange}>
                                    <option value="UIUC">UIUC</option>
                                    <option value="uwaterloo">uwaterloo</option>
                                    <option value="nyu">nyu</option>
                                    <option value="ucla">ucla</option>
                                    <option value="aggies">aggies</option>
                                </select>
                            </label>
                            <input type="submit" value="Submit" />
                        </form>
                }
                    </div>
            <div>
                { this.state.streaming && 
                        <form>
                            <label>
                                Subreddit:
                                <input id="SubredditSearch" type="text" name="Subreddit" />
                            </label>
                            <input type="button" type="submit" value="Submit" onClick={e => this.searchLiveSubreddit(e)}/>
                        </form>
                }
                    </div>
            <div className="d-flex justify-content-center">
                <ButtonToolbar>
                    <ToggleButtonGroup type="radio" name="options" defaultValue={0} onChange={this.toggleLive}>
                        <ToggleButton className="Btn-H-BG" value={0}>Historical Data</ToggleButton>
                        <ToggleButton className="Btn-L-BG" value={1}>Live</ToggleButton>
                    </ToggleButtonGroup>
                </ButtonToolbar>
            </div>
            <div>
                {this.state.commentStream && this.state.submissionStream?
                        <>
                        <h4>{this.state.streaming ? "Live Data": "Historical Data"} </h4>
                        <RedditDayFlow
                            key={key}
                            submissions={this.state.submissionStream}
                            comments={this.state.commentStream}
                            nRows={4}
                            date={this.state.streaming ? Date.now() : this.state.dateMap[this.state.value]}
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
