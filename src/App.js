/* global Plotly:true */

import React, { Component } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory'
import './App.css';
import 'react-select/dist/react-select.css';

require('dotenv').config();

const Plot = createPlotlyComponent(Plotly);

class App extends React.Component {

    constructor(props) {
        super(props);
        
        const plotJSON = {
            layout: {
                plotBackground: '#f3f6fa',
                margin: {t:0, r: 0, l: 20, b: 30},
            },
            google_data: {
                x: [1,2,3,4],
                y: [3,2,7,4],
                type: 'scatter',
                marker: {color: '#19d3f3'},
                name: 'Google'
            },
            apple_data: {
                x: [1,2,3,4],
                y: [1,3,2,6],
                type: 'scatter',
                marker: {color: '#ab63fa'},
                name: 'Apple'
            }
        };

        this.state = {
            json: plotJSON,
            plotUrl: ''
        };
    }

    componentDidMount() {
        var apple_prices = [];
        var google_prices = [];
        // first load apple
        fetch('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=5min&apikey='+process.env.API_KEY
        ,{
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(function(response){
            console.log(response)
            return response.json();
        })
        .then(myJson => {
            const raw_prices = myJson['Time Series (5min)'];
            for (const [key, value] of Object.entries(raw_prices)) {
                apple_prices.push(value['4. close']);
            }
            var xVals = Array.from(Array(apple_prices.length).keys());
            this.setState({
                apple_data: {
                    x: xVals,
                    y: apple_prices,
                    type: 'scatter',
                    marker: {color: '#ab63fa'},
                    name: 'Apple'
                }
            });
        });

        // now load google
        fetch('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=GOOG&interval=5min&apikey='+process.env.API_KEY
        ,{
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(function(response){
            console.log(response)
            return response.json();
        })
        .then(myJson => {
            const raw_prices = myJson['Time Series (5min)'];
            for (const [key, value] of Object.entries(raw_prices)) {
                google_prices.push(value['4. close']);
            }
            var xVals = Array.from(Array(google_prices.length).keys());
            this.setState({
                google_data: {
                    x: xVals,
                    y: google_prices,
                    type: 'scatter',
                    marker: {color: '#19d3f3'},
                    name: 'Google'
                }
            });
        });
        console.log('Now resetting state.');
    }
    
    render() {

        let searchPlaceholder = 'Search charts on plot.ly by topic -- e.g. "GDP"';

        const plotInputPlaceholder = 'Link to plot JSON';

        let footnoteStyle = {
            fontSize: '12px',
            textAlign: 'left',
            width: '300px',
            overflowWrap: 'break-word',
            margin: '10px'
        }

        var data = [this.state.apple_data, this.state.google_data];
        return (
            <div className="App">
                <Plot
                    data={data}
                    layout={this.state.json.layout}
                    config={{displayModeBar: true}}
                />
            </div>
        );
    }
}

export default App;
