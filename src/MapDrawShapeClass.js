import React, { PureComponent, createRef } from 'react';
import GoogleMapReact from 'google-map-react';

import MapDrawShapeManager from 'google-maps-draw-shape-lib';
import './MapDrawShape.css';

export default class MapDrawShape extends PureComponent {
  static defaultProps = {
    mapBootstrap: {
      key: 'AIzaSyCn8eV4OJCGnktvuqI5DmfXqb-g1xn6LVk', // Set your google maps api key here
      libraries: ['drawing']
    },
    mapOptions: {
      mapTypeId: 'roadmap',
      minZoom: 5,
      maxZoom: 20,
      gestureHandling: 'greedy',
      disableDefaultUI: true,
      scrollwheel: true,
      clickableIcons: false,
      rotateControl: false,
      tilt: 0
    },
    defaultCenter: {
      lat: 39.58875553716348,
      lng: -8.576849426688483
    },
    defaultZoom: 7,
    polygonOptions: {
      clickable: false,
      fillColor: "#303030",
      fillOpacity: 0.1,
      strokeColor: "#000000",
      strokeWeight: 4,
      strokeOpacity: 1
    },
    initialPointInnerHtml: `<button class="btn-initial-point" title="Initial Point"></button>`,
    deletePointInnerHtml: `<button class="btn-delete-point" title="Delete">X</button></div>`
  };

  constructor(props) {
    super(props);

    this.state = {
      mapLoaded: false,
      drawingMode: false,
      drawFreeHandMode: false,
      shape: []
    };

    this.mapDrawShapeManagerRef = createRef();
  }

  onGoogleApiLoaded = (map) => {
    const { polygonOptions, initialPointInnerHtml, deletePointInnerHtml } = this.props;
    const { drawingMode, drawFreeHandMode } = this.state;

    this.mapDrawShapeManagerRef.current = new MapDrawShapeManager(
      map,
      this.onDrawCallback,
      drawingMode,
      drawFreeHandMode,
      polygonOptions,
      initialPointInnerHtml,
      deletePointInnerHtml
    );

    this.setState({ mapLoaded: true });
  };

  onDrawCallback = (shape) => {
    console.log(shape);

    this.setState({ shape, drawingMode: false });
  }

  setDrawingMode = (drawingMode) => {
    this.setState({ drawingMode }, () => this.mapDrawShapeManagerRef.current.setDrawingMode(drawingMode));
  }

  setDrawFreeHandMode = (drawFreeHandMode) => {
    this.setState({ drawFreeHandMode }, () => this.mapDrawShapeManagerRef.current.setDrawFreeHandMode(drawFreeHandMode));
  }

  initDrawnShape = () => {
    const initalShape = [
      {
        "lat": 38.71755745031312,
        "lng": -9.34395756832437
      },
      {
        "lat": 39.780999209652855,
        "lng": -8.82210698238687
      },
      {
        "lat": 38.91016617157451,
        "lng": -6.82259526363687
      },
      {
        "lat": 38.71755745031312,
        "lng": -9.34395756832437
      }
    ];

    this.setState({ shape: initalShape }, () => this.mapDrawShapeManagerRef.current.initDrawnShape(initalShape));
  }

  resetDrawnShape = () => {
    this.setState({ shape: [] }, () => this.mapDrawShapeManagerRef.current.resetDrawnShape());
  }

  render() {
    const { mapBootstrap, mapOptions, defaultCenter, defaultZoom } = this.props;
    const { mapLoaded, drawingMode, drawFreeHandMode, shape } = this.state;

    return (
      <>
        <div className="header-container">
          <div className="center">
            <h2>Google Maps Draw Shape</h2>
          </div>
        </div>
        <div className="map-container">
          <GoogleMapReact
            bootstrapURLKeys={mapBootstrap}
            options={mapOptions}
            defaultCenter={defaultCenter}
            defaultZoom={defaultZoom}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => this.onGoogleApiLoaded(map, maps)}
          >
          </GoogleMapReact>
        </div>
        {mapLoaded &&
          <div className="controls-container">
            <div className="center">
              <button className="btn-control" onClick={() => this.setDrawingMode(!drawingMode)}>
                {!drawingMode ? 'Start Draw' : 'Cancel Draw'}
              </button>
              <button className="btn-control" disabled={drawingMode} onClick={() => this.setDrawFreeHandMode(!drawFreeHandMode)}>
                {!drawFreeHandMode ? 'Set Drag Mode' : 'Set Click Mode'}
              </button>
              <button className="btn-control" disabled={(shape?.length > 0 || drawingMode)} onClick={this.initDrawnShape}>Set Initial Shape</button>
              <button className="btn-control" disabled={(!(shape?.length > 0) || drawingMode)} onClick={this.resetDrawnShape}>Clear Shape</button>
            </div>
          </div>
        }
      </>
    );
  }
}