import { Popup, CircleMarker } from 'react-leaflet'

function MarkerCar(props) {
    var car = props.car;
    var fillColor;
    if(car.numberOfCars > 4) {
        fillColor = { fillColor: 'red', color: 'red' }
    } else if (car.numberOfCars <= 4 && car.numberOfCars > 2){
        fillColor = { fillColor: 'orange', color: 'orange' }
    } else {
        fillColor = { fillColor: 'green', color: 'green' }
    }
    console.log(car.location);

    return(
        <CircleMarker center={[car.location.latitude, car.location.longditude]} pathOptions={fillColor} radius={20}>
            <Popup>
                <p>Number of cars seen: <br/> { car.numberOfCars }</p>
                <p>{car.imageSource.link}</p>
                <p>{car.location.latitude}, { car.location.longditude}</p>
            </Popup>
        </CircleMarker>
    )
}

export default MarkerCar;