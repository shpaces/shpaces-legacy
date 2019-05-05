import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { ROOT_FOLDER, DESKTOP_FOLDER  } from '../constants';
// "electron": "^1.7.11",
import { withRouter } from 'react-router-dom'

const storage = require('electron-storage');


import { Scrollbars } from 'react-custom-scrollbars';
import WebView from 'react-electron-web-view';

import FileExplorerTree from './FileExplorer.js'
import ErrorBoundary from '../components/ErrorBoundary.js'

import GridLayout from 'react-grid-layout';
import '../../node_modules/react-grid-layout/css/styles.css'
import '../../node_modules/react-resizable/css/styles.css'

import Dock from "react-osx-dock";


//coverflow
var Coverflow = require('react-coverflow');
import {Carousel} from '3d-react-carousal';

import Paper from '@material-ui/core/Paper' ;
import AppBar from '@material-ui/core/AppBar';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';


import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import CloseIcon from '@material-ui/icons/Close';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import CssBaseline from '@material-ui/core/CssBaseline';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';





// ICONS 
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ArrowDropDownCircle from '@material-ui/icons/ArrowDropDownCircle';
// import FileExplorerTree from '../components/FileExplorerTree';
// import FileExplorerTree_All from '../components/FileExplorerTree_All';

import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import FileExplorerBreadcrumbs from '../components/FileExplorerBreadcrumbs';

import RecentCard from '../components/RecentCard';


const drawerWidth = 240;
const styles = theme => ({
	root: {
	  display: 'flex',
	},
	appBar: {
	  width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
    zIndex: theme.zIndex.drawer + 1,
	},
	drawer: {
	  width: drawerWidth,
	  flexShrink: 0,
	},
	drawerPaper: {
	  width: drawerWidth,
	},
	toolbar: theme.mixins.toolbar,
	content: {
	  flexGrow: 1,
	  backgroundColor: theme.palette.background.default,
	  padding: theme.spacing.unit * 3,
	},
  });
	
  
  
  


//Custom Components
import PrimarySearchAppBar from '../components/AppBar'
import WebWidget from '../components/widgets/WebWidget';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}
function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

class FileExplorer extends Component {
	constructor(props) {
    super(props);
    //reset layout: 
    // this.setStorage();

    this.state = {
			currentPath: DESKTOP_FOLDER, 
      open: false, 
      addTab: false,
      value: 0,
      modal: false,
      modalNewTab: true,
      enableEdit: false,
      loading: true,
      userSettings: {
        workspaces: []
      },  
      
      currentWorkspace: 0,       
      currentTab: 1, 
      currentProject: 'seniorproject'
		};
	}

	handleTabSwitch(active) {
        this.setState({ currentTab: active });
	}
	
	componentDidMount() {
		// this.props.levelDataListenerOn();
		// this.props.pasteDoneListenerOn();
    // this.props.levelDataRequest(this.state.currentPath);
    
    this.getStorage()
  }
  
  
  setStorage = () => { 
    let someData = { 
      unicorn: '🦄', 
      settings: {
        name: 'Rashid'
      },
      workspaces: [
        {
          name: 'Senior Project', 
          tabs: ['Home', 'Email'],
          layouts : [
            [
              {i: 'a', x: 5, y: 0, w: 5, h: 10 },
              {i: 'b', x: 5, y: 10, w: 5, h: 7 },
            ], 
            [
              {i: 'd', x: 5, y: 0, w: 5, h: 10 },
              {i: 'e', x: 5, y: 10, w: 5, h: 7 },
            ]
          ], 
          widgets : [
            {
              'a' : {link: 'https://google.com'},
              'b' : {link: 'https://slack.com'},
            }, 
            {
              'd' : {link: 'https://drive.google.com'},
              'e' : {link: 'https://notion.so'},
            }
          ]

        }
      ]
    }

    let path = './settings/settings.json'
    storage.set(path, someData)
    .then(() => {
      console.log('The file was successfully written to the storage');
      this.getStorage()
    })
    .catch(err => {
      console.error(err);
    });
  }

  getStorage = () => { 
    let path = './settings/settings.json'

    let alldata = storage.get(path)
    .then(data => {
      console.log(data);
      alldata = data
      this.setState({userSettings: data, loading: false})
      return data;
    })
    .catch(err => {
      console.error(err);
    });
    // return alldata

  }


	handleDrawerClose = () => { 
		console.log("hii", this.state.open)
		this.setState({open: !this.state.open})
    }
    
	changeTab = (event, value) => {
    console.log("changing tab", value)
			this.setState({ currentTab: value });
    };
    
  updateLayout = (layout) => { 
    const currentTab = this.state.currentTab
    const currentWorkspace = this.state.currentWorkspace
    let currentSettings = this.state.userSettings

    if (layout) { 
      console.log("Updating Layout...", currentSettings, layout )
      currentSettings.workspaces[currentWorkspace].layouts[currentTab] = layout
      
      let path = './settings/settings.json'
      storage.set(path, currentSettings)
      .then(() => {
        console.log('The file was successfully written to the storage');
        this.getStorage()
      })
      .catch(err => {
        console.error(err);
      });
    }
    
  }

  createWidget = () => { 
    const val = this.state.value
    let currentSettings = this.state.userSettings

    let id = currentSettings.workspaces[val].layouts[val].length
    let widget = {i: `${id}`, x: 0, y: 0, w: 4, h: 4, widget: {type: 'web'}}

    console.log(currentSettings.workspaces[val].layouts[val])
    currentSettings.workspaces[val].layouts[val].push(widget)

    let path = './settings/settings.json'
    storage.set(path, currentSettings)
    .then(() => {
      console.log('The file was successfully written to the storage');
      this.getStorage()
    })
    .catch(err => {
      console.error(err);
    });
    
  }

  handleUpdate = event => {
    console.log(event.value())
    let seniorProject = Object.assign({}, this.state.seniorProject)
    seniorProject.zero.widgets.link = event.value()
    this.setState({ seniorProject: seniorProject });
  };

	render() {
		const { classes } = this.props;
		const {toCopy, toMove} = this.props.copyMovePaths;
    console.log("____", this.state.currentTab, "_______")
		return (
    <ErrorBoundary>

		<Scrollbars style={{ width: '100vw', height: '100vh' }}
		 autoHide
		 renderThumbVertical={({ style, ...props }) =>
		        <div {...props} style={{ ...style, backgroundColor: '#E0E9E9', borderRadius: 5 }}/>
    }>

			<Drawer open={this.state.open} onClose={this.handleDrawerClose}>
        <div
          tabIndex={0}
          role="button"
          onClick={this.handleDrawerClose}
          onKeyDown={this.handleDrawerClose}
        >
          <List> 
              <ListItem button
                 onClick={() => this.setState({currentProject: 'seniorproject'})} 
              ><ListItemText primary={'Senior Project'} /> </ListItem>
              <ListItem button
                 onClick={() => this.setState({currentProject: 'propractice'})} 
              ><ListItemText primary={'Pro Practices'} /> </ListItem>
          </List> 
        </div>
      </Drawer>

      
      <AppBar position="sticky" color="#2F2B28" >
        <Toolbar variant="dense" style={{WebkitAppRegion: 'drag', backgroundColor: '#292022'}}>

        <div float="left" style={{WebkitAppRegion: 'no-drag'}} >

        <Typography variant="h6" color="inherit" style={{ align: "center" }}>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu"
            onClick={ () => this.props.history.push('/home')}
            >
          <Avatar alt="Shpaces" src="./logo.png" float="left" sizes="10"/>
          </IconButton>
            Shpaces  <span style={{fontWeight: '100',}}> Beta </span>
          </Typography>
        </div>

        <div style={{ 
            float       : 'none', 
            width       : '200px',
            marginLeft  : 'auto',
            marginRight : 'auto', 
            alignItems: 'center', 
            WebkitAppRegion: 'no-drag'
        }}>
       
        <Select
            value={this.state.currentProject}
            // onChange={this.handleChange}
        >
           
            <MenuItem value={'seniorproject'}>Senior Project</MenuItem>
            <MenuItem value={'propractice'}>Pro Practice</MenuItem>
          </Select>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu"
						onClick={ () => this.setState({enableEdit: !this.state.enableEdit})}
					>
            <SettingsIcon />
          </IconButton>
          
          
        </div>

        <div float="right">
        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu"
            onClick={ () => this.setState({open: true})}
          >
            <CloseIcon />
          </IconButton>
        </div>

        </Toolbar>
        
        <Toolbar variant="dense" >

          <Tabs value={this.state.currentTab} onChange={this.changeTab}>
          {/* <ErrorBoundary> */}
          {
              !this.state.loading &&
               this.state.userSettings.workspaces[0].tabs.map( (tab) => { 
                 return (
                   <Tab label={tab} key={tab}/>
                 )
               })
          }
          {/* </ErrorBoundary> */}
          </Tabs>
        
        <IconButton  aria-label="Add"
          onClick={() => this.setState({addTab: !this.state.addTab})}
          >
          <AddIcon />
        </IconButton>

        <Button  aria-label="Add"
          onClick={() => this.setStorage()}
        >reset
        </Button>
        <Button 
          onClick={() => console.log(this.state.userSettings.workspaces[0].layouts)}
        >debug
        </Button>
        

        </Toolbar>
      </AppBar>
		<CssBaseline />

    {/* ----------------------- END AppBar ------------------  */}

    <main className={classes.content} style={{width: '100vw', height: '100%', padding: 0}}> 

    {
            !this.state.loading && 
            <ErrorBoundary>
            <GridLayout 
              onLayoutChange={this.updateLayout}
              className="layout" layout={this.state.userSettings.workspaces[0].layouts[this.state.currentTab]} cols={12} rowHeight={30} width={1300}>
              {
                 this.state.userSettings.workspaces[0].layouts[this.state.currentTab].map( (layout) => { 
                  let thisWidget = this.state.userSettings.workspaces[0].widgets[this.state.currentTab][layout.i]
                  // console.log('This Widget', thisWidget, layout.i)
                  return( 
                    <div key={layout.i} style={{backgroundColor: '#222029'}}>
                        <WebWidget link={thisWidget.link} enableEdit={this.state.enableEdit}/>
                    </div>
                  )
                  })

              }
                </GridLayout>
            </ErrorBoundary>
            
          }

    </main>

    { 
      this.state.storage == '' && 
      <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          disableAutoFocus={true}
          open={true}
          onClose={() => this.setState({modal: !this.state.modal})}
        >
          <div style={{position: 'absolute', top: '30%', left: '30%', width: '600px', height: '600px'}} >
          <Paper style={{padding: 50, borderRadius: 10}}> 
            <Typography variant="h3" id="modal-title" >
              Welcome to Shpaces
            </Typography>
            <Typography variant="h5" id="simple-modal-description">
              Organize all your tools into a single workspace.
            </Typography>
            <Divider style={{marginTop: '20px', marginBottom : '20px'}} />

            <Typography variant="h6" id="simple-modal-description">
              Thank you for trying out the Shpaces Beta! Shpaces allows you to create
               custom workspaces (or Shpaces) for your projects, by organizing all of your
               tools into a single dashboard. 
               You can organize the tools in tabs, and move them around to create something 
               that works for you. Best of all, you can easily switch between projects and load
               all the tools & websites for that project. 
            </Typography>
          </Paper>
          </div>
        </Modal>
    }

      <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          disableAutoFocus={true}
          open={this.state.addTab}
          onClose={() => this.setState({addTab: !this.state.addTab})}
        >
          <div style={{position: 'absolute', top: '30%', left: '30%', width: '600px'}} >
          <Paper style={{padding: 50, borderRadius: 10}}> 

            
            <Typography variant="h5" id="simple-modal-description">
              New Tab
            </Typography>
            {/* <Divider style={{marginTop: '20px', marginBottom : '20px'}} /> */}

            <TextField
              id="standard-name"
              label="Name"
              // value={this.state.newTab}
              // onChange={}
              margin="normal"
            />

            <Button
              onClick={this.createWidget}
            >Create</Button>
            
          </Paper>
          </div>
        </Modal>
    
    
    
    </Scrollbars>
    </ErrorBoundary>

		);
	}
}

function mapStateToProps({levelData, copyMovePaths}) {
	return {
		levelData,
		copyMovePaths
	};
}

export default connect(mapStateToProps, actions)(withStyles(styles)(withRouter(FileExplorer)));
