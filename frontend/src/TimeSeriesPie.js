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

        this.createNewPostEntry(submission1);
        this.createNewPostEntry(submission2);
        this.createNewPostEntry(submission3);
        this.createNewPostEntry(submission4);

        let mockComment = (id, sentimentType) => {
            return {
                postId: id,
                sentimentType: sentimentType
            };
        }


        let fillMockSubmission = function (id, bounds) {
            let comment;
            for (let i = 0; i < 100; i++) {
                if (i < bounds[0]) {
                    comment = mockComment(id, "pos");
                } else if (i < bounds[1]) {
                    comment = mockComment(id, "neu");
                } else {
                    comment = mockComment(id, "neg");
                }
                this.onCommentRecieve(comment);
            }
        }.bind(this);

        fillMockSubmission(1, [33, 69]);
        fillMockSubmission(2, [80, 90]);
        fillMockSubmission(3, [50, 75]);
        fillMockSubmission(4, [40, 80]);


        console.log(this.state.postState);
        console.log(this.state.postPieData);

        this.createChart = this.createChart.bind(this);
    }

    createNewPostEntry(submission) {
        // create three entrees for each post
        var pos = {
            postId: submission.postId,
            postDate: submission.postDate,
            upvotes: submission.upvotes,
            sentimentType: "positive",
            sentimentCount: 0,
            ycord: 0
        };
        var neu = {
            postId: submission.postId,
            postDate: submission.postDate,
            upvotes: submission.upvotes,
            sentimentType: "neutral",
            sentimentCount: 0,
            ycord: 0
        };
        var neg = {
            postId: submission.postId,
            postDate: submission.postDate,
            upvotes: submission.upvotes,
            sentimentType: "negative",
            sentimentCount: 0,
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
        let x = chart.addTimeAxis("x", "postDate");
        x.tickFormat = "%H:%M %p";

        let y = chart.addMeasureAxis("y", "ycord");
        y.hidden = true; // hide dummy axis

        chart.addMeasureAxis("p", "sentimentCount"); // attribute for slice
        chart.addLogAxis("z", "upvotes"); // pie radius
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
//let postPieData = [
        //    {
        //        postId: 0,
        //        postDate: new Date(2019, 3, 27, 10, 10),
        //        upvotes: 100,
        //        sentimentType: "positive",
        //        sentimentCount: 34,
        //        ycord: 0
        //    },
        //    {
        //        postId: 0,
        //        postDate: new Date(2019, 3, 27, 10, 10),
        //        upvotes: 100,
        //        sentimentType: "negative",
        //        sentimentCount: 34,
        //        ycord: 0
        //    },
        //    {
        //        postId: 0,
        //        postDate: new Date(2019, 3, 27, 10, 10),
        //        upvotes: 100,
        //        sentimentType: "neutral",
        //        sentimentCount: 33,
        //        ycord: 0
        //    },
        //    {
        //        postId: 1,
        //        postDate: new Date(2019, 3, 27, 10, 13),
        //        upvotes: 500,
        //        sentimentType: "positive",
        //        sentimentCount: 80,
        //        ycord: 0
        //    },
        //    {
        //        postId: 1,
        //        postDate: new Date(2019, 3, 27, 10, 13),
        //        upvotes: 500,
        //        sentimentType: "negative",
        //        sentimentCount: 10,
        //        ycord: 0
        //    },
        //    {
        //        postId: 1,
        //        postDate: new Date(2019, 3, 27, 10, 13),
        //        upvotes: 500,
        //        sentimentType: "neutral",
        //        sentimentCount: 10,
        //        ycord: 0
        //    }
        //];


