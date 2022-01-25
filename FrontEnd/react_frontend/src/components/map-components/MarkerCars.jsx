import { useEffect, useState } from "react";
import MarkerCar from "./MarkerCar"

function MarkerCars(props) {
    const [cars, setCars] = useState([]);
    useEffect(function() {
        const getCars = async function() {
            const res = await fetch('http://localhost:3001/cars');
            const data = await res.json();
            console.log("cars from api: \n" + data);
            setCars(data);
        };
        getCars();
    }, []);
    console.log(cars);

    function isDefined(car) {
        if (car.location === undefined || car.location.latitude === undefined || car.location.longditude === undefined) {
            return false
        } else {
            return true
        }
    }

    return (
        <>
        { cars.map((car => { 
            if (isDefined(car)) {
                return <MarkerCar key={car._id} car={car}/> 
            } else {
                return '';
            }
        }
        )) 
        }
        </>
    );
}

export default MarkerCars;