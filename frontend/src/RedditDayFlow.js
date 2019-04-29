import React, { Component } from 'react';
import { startOfDay } from 'date-fns';
import Stream from 'stream';
import './App.css';

import TimeSeriesPie from './TimeSeriesPie.js';

class RedditDayFlow extends Component {
    constructor(props) {
        super(props);
        let inDate = props.date;
        let millisDay = 24 * 60 * 60 * 1000;
        let dayBegin = startOfDay(inDate).getTime();
        console.log("DAY BEGIN: " + new Date(dayBegin));
        let dayEnd = dayBegin + millisDay;

        // only keep data of the day
        let commentData = props.comments;
        //let submissionData = props.submissions.filter(s => (s.postDate >= dayBegin && s.postDate < dayEnd));

        // set up row dates to determine whether a entry is in a row
        let millisRow = millisDay / props.nRows;
        let rowTimes = []; // row start and end times
        let rowData = {}; // data corresponding with rows
        for (let i = 0; i < props.nRows; i++) {
            let startRow = dayBegin + i * millisRow;
            let endRow = dayBegin + (i+1) * millisRow;
            console.log("row " + i + " is between " + new Date(startRow) + " and " + new Date(endRow));
            rowTimes.push({
                beginTime: startRow,
                endTime: endRow
            });

            // create rowData entry
            let rowSubmissionStream = new Stream.Readable({objectMode: true})
            rowSubmissionStream._read = () => {};
            let rowCommentStream = new Stream.Readable({objectMode: true})
            rowCommentStream._read = () => {};

            rowData[i] = {
                submissions: rowSubmissionStream,
                comments: rowCommentStream
            };
        }

        this.state = {
            dayBegin: dayBegin,
            dayEnd: dayEnd,
            nRows: props.nRows,
            rowData: rowData,
            rowTimes: rowTimes,
            currentSubmissionHoverInfo: null
        }

        // set stream handlers
        props.submissions.on('data', s => this.onSubmissionRecieve(s));
        props.comments.on('data', c => this.onCommentRecieve(c));
    }

    onSubmissionRecieve(s) {
        // determine whether to keep submission
        if (s.postDate < this.state.dayBegin || s.postDate >= this.state.dayEnd) {
            return; 
        }
        for (let i = 0; i < this.state.nRows; i++) {
            if (s.postDate >= this.state.rowTimes[i].beginTime && s.postDate < this.state.rowTimes[i].endTime) {
                this.state.rowData[i].submissions.push(s);
                break;
            }
        }
    }

    onSubmissionMouseOver(dimpleEv, postTitle, postAuthor) {
        let submissionInfo = {
            postDate: dimpleEv.xValue,
            postTitle: postTitle,
            upvotes: dimpleEv.zValue,
            postAuthor: postAuthor
        }
        this.setState({currentSubmissionHoverInfo: submissionInfo})
    }

    onCommentRecieve(c) {
        // TODO: inefficient implementation (leaving lower props to filter)
        for (let i = 0; i < this.state.nRows; i++) {
            this.state.rowData[i].comments.push(c);
        }
    }

    createTimeSeriesPieRows = () => {
        let rows = [];
        for (let i = 0; i < this.state.nRows; i++) {
            rows.push(
                <TimeSeriesPie
                    submissions={this.state.rowData[i].submissions} 
                    comments={this.state.rowData[i].comments}
                    beginTime={this.state.rowTimes[i].beginTime}
                    endTime={this.state.rowTimes[i].endTime}
                    onMouseOver={this.onSubmissionMouseOver.bind(this)}
                />);
        }
        return rows;
    }

    render() {
        return (
            <>
            <div style={{display: "flex"}}>
                <div className="RedditDayFlow_chart"> 
                    {this.createTimeSeriesPieRows()}
                </div>
                <div className="RedditDayFlow_hover">
                    {this.state.currentSubmissionHoverInfo &&
                        <>
                            <h1>{this.state.currentSubmissionHoverInfo.postTitle}</h1>
                            <h4>{this.state.currentSubmissionHoverInfo.postAuthor}</h4>
                            <h4>{this.state.currentSubmissionHoverInfo.upvotes}</h4>
                        </>
                    }
                </div>
            </div>
            </>
        )
    }

}

export default RedditDayFlow;
