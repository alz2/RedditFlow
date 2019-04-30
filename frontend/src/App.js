import React, { Component } from 'react';
import Stream from 'stream';
import d3 from 'd3';
import RedditDayFlow from './RedditDayFlow.js';
import logo from './logo.svg';
import { ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import './App.css';
import "./btn.css";
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav'

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
                    <Card>
                  <Card.Header as="h5">Methodology</Card.Header>
                  <Card.Body>
                    <Card.Title>Live Section: </Card.Title>
                    <Card.Text>
                    <ul> 
                  <li> We use Reddit API to generate a live version of the app which is aimed at getting the latest comments  in a subreddit and displaying according to time per post. </li>
                  <li> Each of the pie charts refer to a post which was created in the given duration. The size of the piechart refers to the number of upvotes for that thread on Reddit.</li>
                  <li> As the comments are live streamed it gets processed for the sentiment classification. </li>
                  </ul>
                    </Card.Text>
                    <Card.Title> Historical Data Section: </Card.Title>
                    <Card.Text>
                    <ul> 
                      <li> In this section we present historical (past 1/2  days) of data  for different subreddits. </li>
                      <li> This presents an overiews of how active the users have been on the subreddit</li>
                    </ul>
                    </Card.Text>

                    <Card.Title>  Analysis and Trends: </Card.Title>
                    <Card.Text>
                    <ul> 

                      <li> We take an example of set of subreddits which are of universities with largest subscriber count. </li>
                      <li> We see how much activities there is in larger universities, especially in universities in campustown.</li>
                      <li> UIUC is one of the biggest universities which is not located in a city, as a result all the local community chatter happens on the university reddit </li>
                      <li> In comparison, nyu  is much less active, as the New York City has a much active local subreddit </li>
                      <li> As we can see most of the piecharts align towards positive segments, as the mods of reddit and downvote ability removes negative comments.</li>

                      </ul>

                    </Card.Text>
                    <Card.Title>  Functionality : </Card.Title>
                    <Card.Text>

                      <ul>
                      <li> On the right we display the comments, title and upvote score when we hovering over the piechart. This let’s users understand where the data from the display is coming from.</li>
                      <li> When any of the piecharts is clicked it takes the user to the original reddit post.</li>
                      <li> Use the search functionality to search and select the reddit for live viz </li>
                      </ul>
                    </Card.Text>
                    <Card.Title>  Further Improvement : </Card.Title>
                    <Card.Text>

                      <ul>
                      <li> The historical data is only for past 1/2 days. This can lead to a false assumption that the a most is more active than another. We only display the data for few days which is not a measure of how popular the post is.</li>
                      <li> Similarly, it’s positive to add more negative comments when the thread doesn’t have a lot of incoming comments as the two mechanism of moderation (moderators and downvote) won't be effective. This can lead to certain treads to appear more negative than they are.</li>
                      <li> The GoogleBig Query database we used gets updated once or twice per day. We rely on praw library to update the upvote count which is laggy. </li>

                      </ul>
                    </Card.Text>
                  </Card.Body>
                </Card>;

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
