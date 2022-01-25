import { useEffect, useState, Component } from "react";
import Pagination from "../addon-components/Pagination";
import Image from "./Image";

class Images extends Component {
    constructor(props) {
        super(props);
        this.state = {
          activePage: 1,
          images: [],
          pageOfItems: []
        };
        
        this.getImages = this.getImages.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
    }
     
    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({activePage: pageNumber});
    }

    // callImages() {
    //     const getImages = async function() {
    //         const res = await fetch('http://localhost:3001/camera');
    //         const data = await res.json();
    //         console.log("images from api: \n" + data);
    //         this.setState({images: data});
    //     }
    //     getImages();
    // }

    async getImages() {
        const res = await fetch('http://localhost:3001/camera');
        const data = await res.json();
        console.log("images from api: \n" + data);
        this.setState({images: data});
    }

    componentDidMount() {
        fetch('http://localhost:3001/camera')
        .then(res => res.json())
        .then(data => this.setState({images: data}));
    }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }

    render() {
        // this.callImages();
        return(
            <div className="bg-secondary col-sm-10 mx-auto w-100">
                {this.state.pageOfItems.map((image) => (<Image key={image._id} image={image}/>))}
                <Pagination items={this.state.images} onChangePage={this.onChangePage} />
            </div>
        );
    }
}

// function Images(props) {
//     const [images, setImages] = useState([]);
//     useEffect(function() {
//         const getImages = async function() {
//             const res = await fetch('http://localhost:3001/camera');
//             const data = await res.json();
//             console.log("images from api: \n" + data);
//             setImages(data);
//         };
//         getImages();
//     }, []);
//     console.log(images);

//     return (
//         <div className="container mx-auto col-sm-10">
//             {images.map((image) => (<Image key={image._id} image={image}/>))}
//         </div>
//     );
// }

export default Images;