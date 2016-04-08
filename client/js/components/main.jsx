import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import TextField from 'material-ui/lib/text-field';

import {} from 'cesium/Build/Cesium/Widgets/widgets.css';
import Viewer from 'cesium/Source/Widgets/Viewer/Viewer';
import Cartesian3 from 'cesium/Source/Core/Cartesian3';

let contentStyle = {
  display: 'flex',
  margin: '25px 25px',
};

let sidebarStyle = {
  flex: '0 0 25%',
};

let viewportStyle = {
  flex: '0 0 75%',
};

const cesiumViewerOptions = {
  animation: false,
  baseLayerPicker: true,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  infoBox: false,
  sceneModePicker: false,
  selectionIndicator: false,
  timeline: false,
  navigationHelpButton: false,
  navigationInstructionsInitiallyVisible: false,
  automaticallyTrackDataSourceClocks: false,
};

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.onLonChange = this.onLonChange.bind(this);
    this.onLatChange = this.onLatChange.bind(this);
    this.onAltChange = this.onAltChange.bind(this);

    this.state = {
      longitude: 19.9450,
      latitude: 50.0647,
      altitude: 10000.0,
    };
  }

  componentDidMount() {
    this.viewer = new Viewer('viewport', cesiumViewerOptions);
    this.updateCamera(this.state.longitude, this.state.latitude, this.state.altitude);
  }

  componentWillUpdate(nextProps, nextState) {
    this.updateCamera(nextState.longitude, nextState.latitude, nextState.altitude);
  }

  onLonChange(event) {
    this.setState({ longitude: event.target.value });
  }

  onLatChange(event) {
    this.setState({ latitude: event.target.value });
  }

  onAltChange(event) {
    this.setState({ altitude: event.target.value });
  }

  updateCamera(lon, lat, alt) {
    if (lon && lat && alt) {
      this.viewer.camera.setView({
        destination: Cartesian3.fromDegrees(parseFloat(lon), parseFloat(lat), parseFloat(alt)),
      });
    }
  }

  render() {
    return (<div>
      <AppBar
        title="AGH Space Systems Data Cluster"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
      <div id="content" style={contentStyle}>
        <div id="sidebar" style={sidebarStyle}>
          <TextField
            onChange={this.onLonChange}
            value={this.state.longitude}
            hintText="Longitude"
          />
          <br />
          <TextField
            onChange={this.onLatChange}
            value={this.state.latitude}
            hintText="Latitude"
          />
          <br />
          <TextField
            onChange={this.onAltChange}
            value={this.state.altitude}
            hintText="Max Altitude"
          />
          <br />
        </div>
        <div id="viewport" style={viewportStyle}></div>
      </div>
    </div>);
  }
}
