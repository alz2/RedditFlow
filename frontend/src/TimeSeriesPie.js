import React, { Component } from 'react';
import dimple from 'dimple-js/dist/dimple.latest.js';
import * as d3 from 'd3';

class TimeSeriesPie extends Component {
    constructor(props) {
        super(props);
        let postState = [
            {
                postId: 0,
                postDate: new Date(2019, 3, 27, 10, 10),
                upvotes: 100,
                sentimentType: "positive",
                sentimentCount: 34,
                ycord: 0
            },
            {
                postId: 0,
                postDate: new Date(2019, 3, 27, 10, 10),
                upvotes: 100,
                sentimentType: "negative",
                sentimentCount: 34,
                ycord: 0
            },
            {
                postId: 0,
                postDate: new Date(2019, 3, 27, 10, 10),
                upvotes: 100,
                sentimentType: "neutral",
                sentimentCount: 33,
                ycord: 0
            },
            {
                postId: 1,
                postDate: new Date(2019, 3, 27, 10, 13),
                upvotes: 500,
                sentimentType: "positive",
                sentimentCount: 80,
                ycord: 0
            },
            {
                postId: 1,
                postDate: new Date(2019, 3, 27, 10, 13),
                upvotes: 500,
                sentimentType: "negative",
                sentimentCount: 10,
                ycord: 0
            },
            {
                postId: 1,
                postDate: new Date(2019, 3, 27, 10, 13),
                upvotes: 500,
                sentimentType: "neutral",
                sentimentCount: 10,
                ycord: 0
            },
            {
                postId: 1,
                postDate: new Date(2019, 3, 27, 10, 13),
                upvotes: 500,
                pos: 80,
                neu: 10,
                neg: 10,
                ycord: 0
            }
                    ];

        this.state = {
            postState: postState
        };

        this.createChart = this.createChart.bind(this);
    }

    componentDidMount() {
        this.createChart();
    }
    componentDidUpdate() {
        this.createChart();
    }

    createChart() {
        let svgWidth = "100%";
        let svgHeight = 500;
        console.log(this.node);
        let svg = d3.select(this.node)
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);
        console.log(svg)
        //let svg = dimple.newSvg("body", svgWidth, svgHeight);

        let chart = new dimple.chart(svg, this.state.postState);
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
