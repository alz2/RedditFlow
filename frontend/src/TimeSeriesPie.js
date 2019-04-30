import React, { Component } from 'react';
import dimple from 'dimple-js/dist/dimple.latest.js';
import * as d3 from 'd3';

class TimeSeriesPie extends Component {
    constructor(props) {
        super(props);
        this.createChart = this.createChart.bind(this);
        let beginTime = props.beginTime;
        let endTime = props.endTime;
        this.state = {
            postPieData: [], // Data in format for pie
            postState: {}, // References for easy updates
            beginTime: beginTime, // start time of this row
            endTime: endTime, // end time of this row
            postTimeToInfo: {},
            idToTime: {},
            onMouseOver: props.onMouseOver, // target div to display on hover
            chart: null
        };

        // set up initial submissions and comments if any
        let rowSubmissionStream = props.submissions;
        if (rowSubmissionStream) {
            //initialSubmissions.forEach(s => this.onSubmissionRecieve(s));
            rowSubmissionStream.on('data', s => this.onSubmissionRecieve(s));
            //rowSubmissionStream.onmessage = s => this.onSubmissionRecieve(s);
        }
        let commentStream = props.comments;
        if (commentStream) {
            //commentStream.forEach(c => this.onCommentRecieve(c));
            commentStream.on('data', c => this.onCommentRecieve(c));
            //commentStream.onmessage = c => this.onCommentRecieve(c);
            console.log(commentStream);
        }

        // set refresh logic
        let intervalMs = 5000;
        setInterval(this.refreshUpvotes.bind(this), intervalMs);
    }

    onSubmissionRecieve(submission) {
        if (submission.postId in this.state.postState) { // make sure to not duplicate submissions
            return;
        }

        // possibly scale upvotes to change bubble sizes better?
        let upvoteScaleFactor = 1;
        let scoreScaled = submission.score * upvoteScaleFactor; 

        // create three entrees for each post
        // start comment count at 1 because need to render pie
        var pos = {
            postId: submission.postId,
            postDate: submission.postDate,
            upvotes: scoreScaled,
            sentimentType: "positive",
            sentimentCount: 1,
            ycord: 0
        };
        var neu = {
            postId: submission.postId,
            postDate: submission.postDate,
            upvotes: scoreScaled,
            sentimentType: "neutral",
            sentimentCount: 1,
            ycord: 0,

        };
        var neg = {
            postId: submission.postId,
            postDate: submission.postDate,
            upvotes: scoreScaled,
            sentimentType: "negative",
            sentimentCount: 1,
            ycord: 0
        };

        // put reference to pos,neu,neg to both postState and postPieData
        this.state.postState[submission.postId] = {
            positive: pos,
            neutral: neu,
            negative: neg
        };
        this.state.postPieData.push(pos);
        this.state.postPieData.push(neu);
        this.state.postPieData.push(neg);

        this.state.idToTime[submission.postId] =  submission.postDate
        // update time to URL Map
        this.state.postTimeToInfo[submission.postDate] = {
            URL: submission.URL,
            postTitle: submission.postTitle,
            postAuthor: submission.postAuthor,
            upvotes: submission.score,
            postText : []
        }

        this.forceUpdate();
    }

    refreshUpvotes() {
        let ids = Object.keys(this.state.postState);
        if (!ids.length) {
            return;
        }
        let qString = ids.map(id => "postId="+id).join('&');
        // make request for updated upvotes for current post
        fetch('http://localhost:8080/upvotes?' + qString)
            .then(response => response.json())
            .then(json => {
                let newUpvotes = json.data;
                newUpvotes.forEach(s => {
                    this.state.postState[s.postId].positive.upvotes = s.score;
                    this.state.postState[s.postId].neutral.upvotes = s.score;
                    this.state.postState[s.postId].negative.upvotes = s.score;
                });
                this.forceUpdate();
            });
    }

    onCommentRecieve(comment) {
        let postId = comment.postId;
        if (!(postId in this.state.postState)){ // check if has seen post
            return;
        }
        this.state.postState[postId][comment.sentimentType].sentimentCount += 1;

        let link_date = this.state.idToTime[comment.postId];
        this.state.postTimeToInfo[link_date].postText.push(comment.text);

        this.forceUpdate();
    }

    alignTimeAxis() {
        // get all outer g tags
        let gs = [].slice.call(document.getElementsByTagName('g')).filter(g => g.parentNode.tagName == "svg");
        gs.forEach(g => g.style.cssText = "transform: translate(0%, -45%)");
    }

    componentDidMount() {
        if (!this.state.chart) {
            this.state.chart = this.createChart();
        } 
        this.state.chart.draw();
        this.alignTimeAxis()
    }

    componentDidUpdate() {
        if (!this.state.chart) {
            this.state.chart = this.createChart();
        } 
        this.state.chart.draw();
        this.alignTimeAxis();
    }

    createChart() {
        let svgWidth = "100%";
        let svgHeight = 150;
        let svg = d3.select(this.node)
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);
        //let svg = dimple.newSvg("body", svgWidth, svgHeight);

        let chart = new dimple.chart(svg, this.state.postPieData);
        chart.defaultColors = [
            new dimple.color("#dc3545", "#dc3545", 0.6), // red
            new dimple.color("#ffa10c", "#ffa10c", 0.6), // yellow
            new dimple.color("#0a661f", "#0a661f", 0.6), // green
        ];

        let x = chart.addTimeAxis("x", "postDate");
        x.dateParseFormat = null;
        x.tickFormat = "%H:%M %p";
        if (this.state.beginTime) {
            x.overrideMin = this.state.beginTime;
        }
        if (this.state.endTime) {
            x.overrideMax = this.state.endTime;
        }

        let y = chart.addMeasureAxis("y", "ycord");
        y.hidden = true; // hide dummy axis

        chart.addMeasureAxis("p", "sentimentCount"); // attribute for slice
        let z = chart.addLogAxis("z", "upvotes"); // pie radius
        z.logBase = 2;

        let pies = chart.addSeries("sentimentType", dimple.plot.pie); // pie over sentimentType
        pies.radius = 50;

        pies.addEventHandler("click", (ev) => {
            let postTime = ev.xValue.getTime(),
                postUrl = this.state.postTimeToInfo[postTime].URL;
            window.open(postUrl, "_blank");
        }) ;

        // Override the standard tooltip behaviour
        let onMouseOver = this.state.onMouseOver
        if (onMouseOver) {
            let postTimeToInfo = this.state.postTimeToInfo;
            pies.addEventHandler("mouseover", function (e){
                let postTime = e.xValue.getTime(),
                    postTitle =  postTimeToInfo[postTime].postTitle,
                    postAuthor = postTimeToInfo[postTime].postAuthor,
                    postText = postTimeToInfo[postTime].postText
                onMouseOver(e, postTitle, postAuthor,postText);
            });
        }

        //chart.draw();
        return chart;
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
//let mockComment = (id, sentimentType) => {
//    return {
//        postId: id,
//        sentimentType: sentimentType
//    };
//}
//let fillMockSubmission = function (id, bounds) {
//    let comment;
//    for (let i = 0; i < 100; i++) {
//        if (i < bounds[0]) {
//            comment = mockComment(id, "positive");
//        } else if (i < bounds[1]) {
//            comment = mockComment(id, "neutral");
//        } else {
//            comment = mockComment(id, "negative");
//        }
//        this.onCommentRecieve(comment);
//    }
//}.bind(this);

//fillMockSubmission(1, [33, 69]);
//fillMockSubmission(2, [80, 90]);
//fillMockSubmission(3, [50, 75]);
//fillMockSubmission(4, [40, 80]);
