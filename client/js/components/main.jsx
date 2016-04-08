import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import TextField from 'material-ui/lib/text-field';

import {} from 'cesium/Build/Cesium/Widgets/widgets.css';
import Viewer from 'cesium/Source/Widgets/Viewer/Viewer';
import Cartesian3 from 'cesium/Source/Core/Cartesian3';
import Transforms from 'cesium/Source/Core/Transforms';
import Model from 'cesium/Source/Scene/Model';
import Color from 'cesium/Source/Core/Color';

const m = 50;
const g = 9.80665;
const A = 2;
const C = 0.75;
const STEP = 100;
const EARTHMOLAR = 0.0289644;
const TSTART = 293;
const TEMPLAPSE = -0.0065;
const RHOSTART = 1.2250;
const GASCONST = 8.31432;

const d = (h) => {
  const base = RHOSTART * (TSTART / (TSTART + TEMPLAPSE * (h)));
  const exp = (1 + ((g * EARTHMOLAR) / (GASCONST * TEMPLAPSE)));
  return Math.pow(base, exp);
};

const v = (h) => Math.sqrt((2 * m * g) / (d(h) * A * C));

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
    this.updateViewer(this.state.longitude, this.state.latitude, this.state.altitude);
  }

  componentWillUpdate(nextProps, nextState) {
    this.updateViewer(nextState.longitude, nextState.latitude, nextState.altitude);
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

  updateViewer(lon, lat, alt) {
    if (lon && lat && alt) {
      const arr = [];
      let h = parseFloat(this.state.altitude);
      const hvector = [];
      const dvector = [];
      const vvector = [];
      const tvector = [];
      const wind = 10;
      let last = 0;

      while (h > 0) {
        hvector.push(h);
        dvector.push(d(h));
        vvector.push(v(h));
        last = STEP / v(h) + last;
        tvector.push(last);

        arr.push(this.state.longitude + wind * last * 0.00005);
        arr.push(this.state.latitude);
        arr.push(h);

        h -= STEP;
      }

      const modelMatrix = Transforms.eastNorthUpToFixedFrame(
        Cartesian3.fromDegrees(
          arr[arr.length - 3],
          arr[arr.length - 2],
          arr[arr.length - 1]
        )
      );

      this.viewer.entities.removeAll();
      this.viewer.entities.add({
        polyline: {
          positions: Cartesian3.fromDegreesArrayHeights(arr),
          width: 5,
          material: Color.RED,
        },
      });

      this.model = this.viewer.scene.primitives.add(Model.fromGltf({
        url: require('models/rocket.glb'),
        modelMatrix,
        scale: 500.0,
      }));
      this.viewer.zoomTo(this.viewer.entities);
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
