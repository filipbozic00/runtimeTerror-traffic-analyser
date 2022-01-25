import { Popup, CircleMarker } from 'react-leaflet'

function MarkerTrafficSign(props) {
    console.log('marker id: ' + props.trafficSign._id);
    var trafficSign = props.trafficSign;
    const fillBlueOptions = { fillColor: 'blue' }

    return (
        <CircleMarker center={[trafficSign.location.latitude, trafficSign.location.longditude]} pathOptions={fillBlueOptions} radius={10}>
            <Popup><img src={"http://localhost:3001/" + trafficSign.image.path} alt="Stop sign" style={{height: "48px", width: "48px"}}></img></Popup>
        </CircleMarker>
    );
}

export default MarkerTrafficSign;