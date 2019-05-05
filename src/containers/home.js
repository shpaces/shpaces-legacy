import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button';

let backgroundUrl = 'https://iso.500px.com/wp-content/uploads/2015/12/top.jpg'
class HomePage extends Component { 

    render () { 
    return(
        <div style={{
            // backgroundColor: '#efefef',
             height: '100%',
        }} >
            <div style={{
                backgroundImage: `url(${backgroundUrl})`,
                // background: 'rgb(34,32,41,0.8)',
                 width: '100%', height: '100%', position: 'absolute', top: 0,
                padding: 10
                }}> 
            
                <h4> Welcome </h4>
                <Button 
                    onClick={ () => this.props.history.push('/workspaces')}
                >My Workspaces
                </Button>
            </div> 
        </div>
    )}
}

export default withRouter(HomePage)