import React, { Component } from 'react';
import dimple from 'dimple-js/dist/dimple.latest.js';
import * as d3 from 'd3';



class TimeSeriesPie extends Component {
    constructor(props) {
        super(props);
        let postState = [
            {
                postDate: new Date(2019, 3, 27, 10, 10),
                upvotes: 100,
                sentimentType: "positive",
                sentimentCount: 34,
                ycord: 0
            },
            {
                postDate: new Date(2019, 3, 27, 10, 10),
                upvotes: 100,
                sentimentType: "negative",
                sentimentCount: 34,
                ycord: 0
            },
            {
                postDate: new Date(2019, 3, 27, 10, 10),
                upvotes: 100,
                sentimentType: "neutral",
                sentimentCount: 33,
                ycord: 0
            },
            {
                postDate: new Date(2019, 3, 27, 10, 13),
                upvotes: 500,
                sentimentType: "positive",
                sentimentCount: 80,
                ycord: 0
            },
            {
                postDate: new Date(2019, 3, 27, 10, 13),
                upvotes: 500,
                sentimentType: "negative",
                sentimentCount: 10,
                ycord: 0
            },
            {
                postDate: new Date(2019, 3, 27, 10, 13),
                upvotes: 500,
                sentimentType: "neutral",
                sentimentCount: 10,
                ycord: 0
            },
            {
                postDate: new Date(2019, 3, 27, 10, 13),
                upvotes: 500,
                pos: 80,
                neu: 10,
                neg: 10,
                ycord: 0
            }
                    ];

        let svgWidth = 590;
        let svgHeight = 400;
        let svg = dimple.newSvg("body", svgWidth, svgHeight);
        let chart = new dimple.chart(svg, postState);
        this.state = {
            postState: postState,
            svg: svg,
            chart: chart
        };

        chart.addTimeAxis("x", "postDate");
        let y = chart.addMeasureAxis("y", "ycord");
        y.hidden = true;
        chart.addMeasureAxis("p", "sentimentCount");
        chart.addMeasureAxis("z", "upvotes"); // pie radius
        chart.addSeries("sentimentType", dimple.plot.pie);
        chart.draw();
    }

    render() {
        return (
            <>
            <h1> Testing Time Series Pie</h1>
            </>
        )
    }

}

export default TimeSeriesPie;
