import React, { Component } from 'react';
import dimple from 'dimple-js/dist/dimple.latest.js';
import * as d3 from 'd3';

class TimeSeriesPie extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postPieData: [],
            postState: {}
        };

        // set up initial submissions and comments if any
        let initialSubmissions = props.submissions;
        if (initialSubmissions) {
            initialSubmissions.forEach(s => this.onSubmissionRecieve(s));
        }
        let initialComments = props.comments;
        if (initialComments) {
            initialComments.forEach(c => this.onCommentRecieve(c));
        }

        let mockComment = (id, sentimentType) => {
            return {
                postId: id,
                sentimentType: sentimentType
            };
        }

        this.createChart = this.createChart.bind(this);
    }

    onSubmissionRecieve(submission) {
        if (submission.postId in this.state.postState) { // make sure to not duplicate submissions
            return;
        }

        // create three entrees for each post
        // start comment count at 1 because need to render pie
        var pos = {
            postId: submission.postId,
            postDate: submission.postDate,
            upvotes: submission.upvotes,
            sentimentType: "positive",
            sentimentCount: 1,
            ycord: 0
        };
        var neu = {
            postId: submission.postId,
            postDate: submission.postDate,
            upvotes: submission.upvotes,
            sentimentType: "neutral",
            sentimentCount: 1,
            ycord: 0
        };
        var neg = {
            postId: submission.postId,
            postDate: submission.postDate,
            upvotes: submission.upvotes,
            sentimentType: "negative",
            sentimentCount: 1,
            ycord: 0
        };

        // put reference to pos,neu,neg to both postState and postPieData
        this.state.postState[submission.postId] = {
            pos: pos,
            neu: neu,
            neg, neg
        };
        this.state.postPieData.push(pos);
        this.state.postPieData.push(neu);
        this.state.postPieData.push(neg);
    }

    onCommentRecieve(comment) {
        let postId = comment.postId;
        if (!(postId in this.state.postState)){ // check if has seen post
            return;
        }
        this.state.postState[postId][comment.sentimentType].sentimentCount += 1;
    }

    componentDidMount() {
        this.createChart();
    }
    componentDidUpdate() {
        this.createChart();
    }

    createChart() {
        let svgWidth = "100%";
        let svgHeight = 400;
        let svg = d3.select(this.node)
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);
        //let svg = dimple.newSvg("body", svgWidth, svgHeight);

        let chart = new dimple.chart(svg, this.state.postPieData);
        chart.defaultColors = [
            new dimple.color("#2ecc71", "#27ae60", 0.6), // green
            new dimple.color("#f1c40f", "#f39c12", 0.6), // yellow
            new dimple.color("#e74c3c", "#c0392b", 0.6) // red
        ];

        let x = chart.addTimeAxis("x", "postDate");
        x.tickFormat = "%H:%M %p";

        let y = chart.addMeasureAxis("y", "ycord");
        y.hidden = true; // hide dummy axis

        chart.addMeasureAxis("p", "sentimentCount"); // attribute for slice
        let z = chart.addLogAxis("z", "upvotes"); // pie radius
        z.logBase = 2;

        chart.addSeries("sentimentType", dimple.plot.pie); // pie over sentimentType
        chart.draw();
    }

    render() {
        return (
            <>
            <div ref={node => this.node = node}></div>
            </>
        )
    }
}

export default TimeSeriesPie;
// ------------------ TESTING CODE -------------
//let fillMockSubmission = function (id, bounds) {
//    let comment;
//    for (let i = 0; i < 100; i++) {
//        if (i < bounds[0]) {
//            comment = mockComment(id, "pos");
//        } else if (i < bounds[1]) {
//            comment = mockComment(id, "neu");
//        } else {
//            comment = mockComment(id, "neg");
//        }
//        this.onCommentRecieve(comment);
//    }
//}.bind(this);

//fillMockSubmission(1, [33, 69]);
//fillMockSubmission(2, [80, 90]);
//fillMockSubmission(3, [50, 75]);
//fillMockSubmission(4, [40, 80]);
