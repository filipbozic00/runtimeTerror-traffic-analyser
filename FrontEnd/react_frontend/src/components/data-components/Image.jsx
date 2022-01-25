
function Image(props) {
    console.log('image id: ' + props.image._id);
    var image = props.image;
    return (
        <div className="container col-sm-5 mx-auto my-3 py-3 card">
            <img src={'http://localhost:3001/' + image.src} alt={image.link} style={{maxHeight: 400, maxWidth: 600}} className="card-img-top mx-auto"></img>
            <div className="card-body">
                <h4 className="card-title my-2">{image.src}</h4>
                <p className="card-text">{image.link}</p>
            </div>
        </div>
    );
}

export default Image;