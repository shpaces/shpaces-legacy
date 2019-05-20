import React, { Component } from 'react';
import WebView from 'react-electron-web-view';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import TextBox from "react-uwp/TextBox";
import Button from '@material-ui/core/Button';
// import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper' ;


class WebWidget extends Component { 
    constructor(props) { 
        super(props)
        this.state = { 
            link: props.link, 
            showIcon: false, 
            showModal: false
        }
    }
    handleLinkUpdate = (e) => { 
        this.setState({link: e.target.value})
    }

    handlePress(e) {
        e.stopPropagation();
    }

    saveWidget = () => { 
        const workspace = this.props.currentWorkspace
        const tab = this.props.currentTab
        const layout = this.props.currentLayout

        let thisWidget = this.props.userSettings.workspaces[workspace].widgets[tab][layout]
        thisWidget.link = this.state.link

        let settings = this.props.userSettings
        settings.workspaces[workspace].widgets[tab][layout].link = this.state.link

        // console.log(workspace, tab, thisWidget)
        this.props.saveStorage(settings)
    }

    render () { 
    return(
        <div style={{backgroundColor: '#efefef', height: '100%', borderRadius: 5, paddingBottom: '10px'}} key={this.props.key}
            onMouseEnter={() => this.setState({showIcon: true})}
            onMouseLeave={() => this.setState({showIcon: false})}
        >
            <div >
            <WebView
                src={this.props.link}
                // disablewebsecurity
                // style={{ height: '100%'}}
                minheight="3000px"
                autosize={false}
            />

            {
                this.state.showIcon &&
                <div style={{
                    position: 'absolute', 
                    right: 2, 
                    bottom: 2
                }}> 
                 {/* <Fab color="secondary" aria-label="Edit" >
                    <Icon>edit_icon</Icon>
                </Fab> */}
                <Button 
                    onClick={() => this.setState({showModal: true})}
                    variant="contained" > Open
                        
                </Button>
                </div>
            }
            
            </div>
            { 
                this.props.enableEdit && 
                <div style={{
                    background: 'rgb(34,32,41,1)', width: '100%', height: '100%', position: 'absolute', top: 0,
                    padding: '10px'
                }}> 
                    <FormControl  onMouseDown={(e)=> this.handlePress(e)}>
                    <h4> Settings </h4>
                    <div style={{width: '300px'}}>                  
                    <Select
                        value={'web'}
                        fullWidth
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

                    </div>

                    <div style={{width: '300px', flex: 1, color: 'white'}}>
                    
                      <TextField
                        label="Link"
                        value={this.state.link}
                        onChange={(e) => this.handleLinkUpdate(e)}
                        variant="outlined"                        
                        margin="normal"
                        fullWidth
                    />
                    </div>

                    <Button 
                    onClick={this.saveWidget}
                    variant="contained" >
                        Save
                    </Button>
                    
                    </FormControl>
                </div> 
            }

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          disableAutoFocus={true}
          open={this.state.showModal}
          onClose={() => this.setState({showModal: !this.state.showModal})}
        >
          <div style={{position: 'absolute', top: '10%', left: '5%', width: '1200px', height: '800px'}} >
          <Paper style={{padding: 50, borderRadius: 10}}> 

          <WebView
                src={this.props.link}
                // disablewebsecurity
                // style={{ height: '100%'}}
                minheight="3000px"
                autosize={false}
                // didStopLoading={() => console.log('Done Loading..')}
                // onWillNavigate={() => console.log('yoo')}
                // consoleMessage={ (e) => {
                //     console.log('Guest page logged a message:', e.message)
                // }}
            />
            
          </Paper>
          </div>
        </Modal>
    
        </div>
    )}
}

export default WebWidget