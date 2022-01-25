
function Image(props) {
    console.log('image id: ' + props.image._id);
    var image = props.image;
    return (
        <div className="container col-sm-10 mx-auto my-3 bg-light border border-light rounded">
            <h5 className="card-title">{image.src}</h5>
            <img src={'http://localhost:3001/' + image.src} alt={image.link}></img>
        </div>
    );
}

export default Image;