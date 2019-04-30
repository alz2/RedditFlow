import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AppName from './AppName';
import SortBy from './SortBy';
import DynamicSwitch from './DynamicSwitch';
import PostsPerLine from './PostsPerLine';
import TimeSeriesPie from './TimeSeriesPie';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
	<>
	<AppName />
	<DynamicSwitch/>
	<SortBy />
	<PostsPerLine />
	<App />
	</>, 
	document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
