import { withRouter } from "react-router-dom";
import Image from 'react-bootstrap/Image';
import background from '../../resources/background.jpg'

function Home(props) {
    return(
        <div className="text-center mx-auto pb-5 px-0 w-100 bg-secondary">
            <Image className="mx-auto" alt="Background_image" src={background} fluid/>
            <div className="container bg-dark mx-auto my-3 py-2 col-sm-10 rounded text-light">
                <h3>Runtime Terror</h3>
                <hr className="mx-auto col-sm-8"></hr>
                <p>
                    This is a web application. The application collects road data sent to it through the mobile app and other sources with public data.
                </p>
                <p className="mx-auto col-sm-10">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    <br></br>
                    <br></br>
                    Integer malesuada nunc vel risus commodo viverra maecenas accumsan lacus. 
                    Duis at tellus at urna condimentum mattis. 
                    Tempus urna et pharetra pharetra massa massa ultricies mi quis. 
                    Dictumst quisque sagittis purus sit amet volutpat consequat. 
                    At risus viverra adipiscing at in tellus integer. 
                    Viverra nibh cras pulvinar mattis nunc sed blandit libero volutpat. 
                    Etiam dignissim diam quis enim lobortis. 
                    Pulvinar etiam non quam lacus suspendisse faucibus. 
                    Non pulvinar neque laoreet suspendisse interdum. 
                    Ut placerat orci nulla pellentesque. 
                    Venenatis tellus in metus vulputate eu scelerisque felis imperdiet proin. 
                    Sed elementum tempus egestas sed sed risus pretium quam vulputate.
                    <br></br>
                    <br></br>
                    Ac turpis egestas integer eget aliquet nibh praesent tristique magna. 
                    Cras ornare arcu dui vivamus arcu felis bibendum. 
                    In vitae turpis massa sed elementum. 
                    Tincidunt tortor aliquam nulla facilisi cras fermentum odio eu. Nunc scelerisque viverra mauris in. 
                    Morbi enim nunc faucibus a pellentesque sit amet. 
                    Est ante in nibh mauris cursus mattis molestie a iaculis. 
                    Nunc congue nisi vitae suscipit tellus mauris a. 
                    Gravida dictum fusce ut placerat orci. 
                    Dolor sit amet consectetur adipiscing elit duis tristique sollicitudin. 
                    Magna fringilla urna porttitor rhoncus dolor purus non enim praesent. 
                    Dignissim sodales ut eu sem integer vitae. 
                    Sed risus ultricies tristique nulla aliquet enim tortor.
                </p>
            </div>
        </div>
    );
}


export default withRouter(Home);