import React, { Component } from 'react';
import WebView from 'react-electron-web-view';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';


class WebWidget extends Component { 

    render () { 
    return(
        <div style={{backgroundColor: '#efefef', height: '100%', borderRadius: 5, paddingBottom: '10px'}} key={this.props.key}>
            <div >
            <WebView src={this.props.link}
                // disablewebsecurity
                style={{ height: '100%'}}
                minheight="800px"
                autosize={true}
            />
            </div>
            { 
                this.props.enableEdit && 
                <div style={{
                    background: 'rgb(34,32,41,0.8)', width: '100%', height: '100%', position: 'absolute', top: 0,
                    padding: 10
                }}> 
                
                    <h4> Website </h4>

                    <form style={{display: 'flex', flexDirection: 'row'}} >
                    
                    <Select
                        value={'web'}
                        input={
                          <OutlinedInput
                            labelWidth={'Type'}
                            name="age"
                            id="outlined-age-simple"
                          />
                        }
                        // onChange={this.handleChange}
                    >
                        <MenuItem value={'web'}>Website</MenuItem>
                        <MenuItem value={'propractice'}>File Browser</MenuItem>
                      </Select>

                      <TextField
                        id="standard-uncontrolled"
                        label="Link"
                        defaultValue={this.props.link}
                        margin="normal"

                    />


                    </form>
                </div> 
            }
        </div>
    )}
}

export default WebWidget