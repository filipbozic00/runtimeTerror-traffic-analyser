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

    return (
        <>
        { cars.map((car) => (<MarkerCar key={car._id} car={car}/>)) }
        </>
    );
}

export default MarkerCars;