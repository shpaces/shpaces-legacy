import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import Clock from 'react-live-clock';
let backgroundUrl = 'https://iso.500px.com/wp-content/uploads/2015/12/top.jpg'
const id = '1d10eb93bf29a76031bf161b86adb0e0294d06f3fdc8c7de0112fb9218e76a71'
class HomePage extends Component { 
    constructor(props) { 
        super(props)
        this.state= {
            time : '', 
            imgUrl: backgroundUrl
        }
    }

    componentDidMount() { 
        this.getTime()
    }

    getRandomImage = () => { 
        fetch('https://api.unsplash.com/photos/random/?client_id=' + id )
            .then(res => res.json())
            .then(data => {
                console.log(data)

                let image = data.urls.regular
                this.setState({ imgUrl: image });
            })
            .catch(err => {
                console.log('Error happened during fetching!', err);
            });
    }

    getTime =() => { 
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        this.setState({time: time})
        // console.log(time)
    }

    render () { 
        let backgroundUrl = this.state.imgUrl
    return(
        <div style={{
            // backgroundColor: '#efefef',
             height: '100%',
        }} >
            <div style={{
                backgroundImage: `url(${backgroundUrl})`,
                backgroundSize: 'cover',
                // background: 'rgb(34,32,41,0.8)',
                 width: '100%', height: '100%', position: 'absolute', top: 0,
                padding: 10
                }}> 

                <div style={{margin: 30}}> 
                    <h4> Hi, Rashid </h4>
                    <Button 
                        onClick={ () => this.props.history.push('/workspaces')}
                    >My Workspaces
                    </Button>
                </div>

                <div style={{margin: 30, paddingRight: 20, top: 0, right: 0,
                     position: 'absolute', alignItems: 'center'}}> 
                    <h4> 
                    <Clock format={'h:mm a'} ticking={true}  />   

                    </h4>
                    <Button 
                        onClick={ this.getRandomImage}
                    >
                        <Clock format={'dddd, MMMM Mo, YYYY'} />    
                    </Button>
                </div>
            </div> 
        </div>
    )}
}

export default withRouter(HomePage)