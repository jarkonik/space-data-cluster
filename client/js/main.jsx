import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/main';

window.CESIUM_BASE_URL = './cesium';

const mainElement = document.createElement('div');
mainElement.id = 'main';
document.body.appendChild(mainElement);

ReactDOM.render(<Main />, mainElement);
