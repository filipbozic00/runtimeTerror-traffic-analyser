import { useEffect, useState } from "react";
import MarkerTrafficSign from "./MarkerTrafficSign"

function MarkerTrafficSigns(props) {
    const [trafficSigns, setTrafficSigns] = useState([]);
    useEffect(function() {
        const getTrafficSigns = async function() {
            const res = await fetch('http://localhost:3001/trafficsign');
            const data = await res.json();
            console.log("cars from api: \n" + data);
            setTrafficSigns(data);
        };
        getTrafficSigns();
    }, []);
    console.log(trafficSigns);

    return (
        <>
        { trafficSigns.map((trafficSign) => (<MarkerTrafficSign key={trafficSign._id} trafficSign={trafficSign}/>)) }
        </>
    );
}

export default MarkerTrafficSigns;