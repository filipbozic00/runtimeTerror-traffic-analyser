import React from "react"
import { MapContainer, TileLayer, LayersControl, LayerGroup } from 'react-leaflet'
import { MarkerTrafficSigns, MarkerCars } from '../../components'

const center = [46.5575, 15.645556]

/* <CircleMarker center={center} pathOptions={fillBlueOptions} radius={10}>
  <Popup><img src={stopsign} alt="Stop sign" style={{height: "48px", width: "48px"}}></img></Popup>
</CircleMarker>
<CircleMarker center={sign90location} pathOptions={fillBlueOptions} radius={10}>
  <Popup><img src={sign90} alt="Stop sign" style={{height: "48px", width: "48px"}}></img></Popup>
</CircleMarker> */

class Map extends React.Component { 
  render() {
    return (
      <div>
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css'></link>
        <MapContainer style={{ height: "720px" }}  center={center} zoom={15} scrollWheelZoom={true}>
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="OpenStreetMap.Mapnik">
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="OpenStreetMap.BlackAndWhite">
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.Overlay checked name="Display cars">
              <LayerGroup>
                <MarkerCars/>
              </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay checked name="Display traffic signs">
              <LayerGroup>
                <MarkerTrafficSigns/>
              </LayerGroup>
            </LayersControl.Overlay>      
          </LayersControl>    
        </MapContainer>
      </div>
    )
  }
}

export default Map;