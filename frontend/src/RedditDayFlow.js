import React, { Component } from 'react';
import dimple from 'dimple-js/dist/dimple.latest.js';
import * as d3 from 'd3';
import { startOfDay } from 'date-fns';
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
        let submissionData = props.submissions.filter(s => (s.postDate >= dayBegin && s.postDate < dayEnd));

        // set up functions determine whether a entry is in a row
        let millisRow = millisDay / props.nRows;
        let rowTimes = [];
        let rowIndicatorFns = [];
        for (let i = 0; i < props.nRows; i++) {
            let startRow = dayBegin + i * millisRow;
            let endRow = dayBegin + (i+1) * millisRow;
            console.log("row " + i + " is between " + new Date(startRow) + " and " + new Date(endRow));
            rowIndicatorFns.push(entry => {
                return (entry.postDate >= startRow && entry.postDate < endRow)
            });
            rowTimes.push({
                beginTime: startRow,
                endTime: endRow
            });
        }

        // bucket data into rows
        let rowData = {};
        for (let i = 0; i < props.nRows; i++) {
            rowData[i] = {
                submissions: [],
                comments: commentData // TODO fix this
            };
        }

        submissionData.forEach(s => {
            for (let i = 0; i < props.nRows; i++) {
                if (rowIndicatorFns[i](s)) {
                    rowData[i].submissions.push(s);
                    break;
                }
            }
        });

        this.state = {
            day: dayBegin,
            nRows: props.nRows,
            rowData: rowData,
            rowTimes: rowTimes,
            currentSubmissionHoverInfo: null
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
