import React from "react";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';  
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import userImg from '../../resources/user.png'

function AboutUs() {
    return(
        <div className="container mt-5">
            <Grid container justify="center" className="bg-dark rounded" spacing={5}>
                <Grid className="text-light" item xs={12}>
                    <h2 className="text-light">About us</h2>
                    <p className="mx-auto col-sm-8">
                        We are a small group of students currently studying programming. 
                        <br></br>
                        This project displays road data gathered from our mobile app and from other sites with public road data.
                        <br></br>
                        <br></br>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        <hr></hr>
                    </p>
                </Grid>
                <Grid item xs={3}>
                    <Card>
                        <CardHeader title="Matija"/>
                        <CardMedia className="mx-auto" style={{ height: 160, width: 140 }} image={ userImg } title="user image"/>
                        <hr></hr>
                        <CardContent>
                            <Typography>
                                University of Maribor <br></br> 
                                Faculty of Electrical Engineering and Computer Science <br></br><hr></hr>
                                Student
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={3}>
                    <Card>
                        <CardHeader title="Ivan"/>
                        <CardMedia className="mx-auto" style={{ height: 160, width: 140 }} image={ userImg } title="user image"/>
                        <hr></hr>
                        <CardContent>
                            <Typography>
                                University of Maribor <br></br> 
                                Faculty of Electrical Engineering and Computer Science <br></br><hr></hr>
                                Student
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={3}>
                    <Card>
                        <CardHeader title="Filip"/>
                        <CardMedia className="mx-auto" style={{ height: 160, width: 140 }} image={ userImg } title="user image"/>
                        <hr></hr>
                        <CardContent>
                            <Typography>
                                University of Maribor <br></br> 
                                Faculty of Electrical Engineering and Computer Science <br></br><hr></hr>
                                Student
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}

export default AboutUs;