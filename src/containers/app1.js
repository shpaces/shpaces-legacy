import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { ROOT_FOLDER, DESKTOP_FOLDER  } from '../constants';
// "electron": "^1.7.11",

const storage = require('electron-storage');


import { Scrollbars } from 'react-custom-scrollbars';
import WebView from 'react-electron-web-view';

import FileExplorerTree from './FileExplorer.js'

import GridLayout from 'react-grid-layout';
import '../../node_modules/react-grid-layout/css/styles.css'
import '../../node_modules/react-resizable/css/styles.css'

import Dock from "react-osx-dock";


//coverflow
var Coverflow = require('react-coverflow');
import {Carousel} from '3d-react-carousal';

import Paper from '@material-ui/core/Paper' ;
import AppBar from '@material-ui/core/AppBar';

import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
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
		this.updateCurrentPath = this.updateCurrentPath.bind(this);

    
    
    console.log('EEYYYY___', props.userSettings)
		this.state = {
			currentPath: DESKTOP_FOLDER, 
			activeTab: 0, 
			open: false, 
			displayImages: false, 
      displayFiles: false, 
      value: 0,
      modal: false,
      modalNewTab: true,

      userSettings: props.userSettings ,

      'seniorProject' : { 
        zero: { 
          name: 'home',
          layout : [
            {i: 'a', x: 5, y: 0, w: 6, h: 10},
            {i: 'b', x: 5, y: 10, w: 4, h: 7},
            {i: 'c', x: 0, y: 0, w: 5, h: 18}
          ], 
          widgets: [
            {i : 'a', link: 'http://docs.google.com'}
          ]
        }, 
        one: {
          name: 'email', 
          layout : [
            {i: 'a', x: 8, y: 0, w: 3, h: 18},
            {i: 'b', x: 0, y: 0, w: 8, h: 18},
            // {i: 'c', x: 0, y: 0, w: 5, h: 18}
          ], 
        }
      },

      'proPractice' : { 
        one: { 
          layout : [
            {i: 'a', x: 5, y: 0, w: 6, h: 10},
            {i: 'b', x: 5, y: 10, w: 4, h: 7},
            {i: 'c', x: 0, y: 0, w: 5, h: 18}
          ], 
        }, 
        zero: { 
          layout : [
            {i: 'a', x: 6, y: 0, w: 5, h: 10},
            {i: 'b', x: 6, y: 10, w: 4, h: 8},
            {i: 'c', x: 0, y: 0, w: 6, h: 18}
          ], 
        }
      },


      currentProject: 'seniorproject'
		};
	}

	handleTabSwitch(active) {
        this.setState({ activeTab: active });
	}
	
	componentDidMount() {
		this.props.levelDataListenerOn();
		this.props.pasteDoneListenerOn();
    this.props.levelDataRequest(this.state.currentPath);
    
    // let userSettings = this.getStorage()
    // this.setState({userSettings: userSettings.settings})
  }
  
  setStorage = () => { 
    let someData = { 
      unicorn: '🦄', 
      settings: {
        'seniorproject': [ 
          { 
            name: 'home'
          }, 
          { 
            name: 'files'
          }, 
        ], 
        'propractice': [ 
          { 
            name: 'home'
          }, 
          { 
            name: 'email'
          }, 
        
        ]
      },
    }

    let path = './settings/settings.json'
    storage.set(path, someData)
    .then(() => {
      console.log('The file was successfully written to the storage');
    })
    .catch(err => {
      console.error(err);
    });
  }

  getStorage = () => { 
    let path = './settings/settings.json'

    storage.get(path)
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(err => {
      console.error(err);
    });

  }

	updateCurrentPath(newPath) {
		this.setState({
			currentPath: newPath
		});
		this.props.levelDataRequest(newPath);
	}

	clickPasteButtonHandler() {
		const { toCopy, toMove } = this.props.copyMovePaths;
		this.props.pasteRequest(toCopy || toMove, this.state.currentPath,  toCopy ? 'copy' : 'move');
	}

	navigateToFavorite = () => { 
		console.log("Favorites: ")
		// if (fav == 'desktop') { 
			this.updateCurrentPath(DESKTOP_FOLDER)
		// }
	}

	handleDrawerClose = () => { 
		console.log("hii", this.state.open)
		this.setState({open: !this.state.open})
    }
    
	changeTab = (event, value) => {
			this.setState({ value });
    };
    
  updateLayout = (layout, newLayout) => { 
    this.setState({layout: newLayout})
  }

  handleUpdate = event => {
    // console.log(event.value())
    // let seniorProject = Object.assign({}, this.state.seniorProject)
    // seniorProject.zero.widgets.link = event.value()
    // this.setState({ seniorProject: seniorProject });
  };

	render() {
		const { classes } = this.props;
		const {toCopy, toMove} = this.props.copyMovePaths;
        
		return (
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

      
      <AppBar position="sticky" color="inherit" >
        <Toolbar variant="dense" style={{WebkitAppRegion: 'drag'}}>

        <div float="left" style={{WebkitAppRegion: 'no-drag'}} >

        <Typography variant="h6" color="inherit" style={{ align: "center" }}>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu"
						onClick={ () => this.setState({modal: true})}
            >
            {/* <MenuIcon /> */}
          <Avatar alt="Shpaces" src="./logo.png" float="left"/>
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
          <Typography variant="h5" color="inherit" style={{ align: "center" }}>
            {/* {
              this.state.currentProject == 'seniorproject' ?
              <span> Senior Project </span>
              : 
              <span> Pro Practices </span>
            } */}
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu"
						onClick={ () => this.setState({open: true})}
					>
            <ArrowDropDownCircle />
          </IconButton>
          </Typography>
          
        </div>

        <div float="right">
        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu"
						// onClick={ () => this.setState({open: true})}
          >
            <CloseIcon />
          </IconButton>
        </div>

        </Toolbar>
        
        <Toolbar variant="dense" >

        <Tabs value={this.state.value} onChange={this.changeTab}>
            {
              this.state.userSettings[this.state.currentProject].map( (tab) => { 
                console.log(tab)
                return (
                  <Tab label={tab.name} key={tab.home}/>
                )
              })
            }
        </Tabs>
        <IconButton  aria-label="Add"
          onClick={this.setStorage}
          >
          <AddIcon />
        </IconButton>

        <IconButton  aria-label="Add" 
          onClick={this.getStorage}
        >
          <AddIcon />
        </IconButton>
        
        </Toolbar>
      </AppBar>
		<CssBaseline />

    {/* ----------------------- END AppBar ------------------  */}

    
    {this.state.currentProject == 'seniorproject' &&
		  <div className={classes.root}> 
        {this.state.value === 0 && 
        <main className={classes.content} style={{width: '100vw', height: '100vh'}}> 
          <GridLayout className="layout" layout={this.state.seniorProject.zero.layout} cols={12} rowHeight={30} width={1500}
              // onLayoutChange={ (layout) => { 
              //   let seniorProject = Object.assign({}, this.state.seniorProject)
              //   seniorProject.zero.layout = layout
              //   this.setState({seniorProject})
              // }}
          >
          {/* {
            this.state.seniorProject.zero.widgets.map( (widget) => {
              return (
                <div style={{backgroundColor: '#efefef', height: '100%', borderRadius: 5}} key={widget.i}>
                  <WebView src={widget.link}
                  // disablewebsecurity
                      style={{ height: '100%'}}
                      minheight="800px"
                      autosize={true}
                  />
              </div>
              )
            })
          } */}
         

          <div style={{backgroundColor: '#424242'}} key="b">
              <WebView src="https://www.calmlywriter.com/online/" 
              // disablewebsecurity
                  style={{ height: '100%'}}
                  minheight="800px"
                  autosize
              /> 
          </div>

          <div style={{backgroundColor: '#efefef'}} key="c">
              <WebView src="https://spspring19.slack.com/messages" 
              // disablewebsecurity
                  style={{ height: '100%'}}
                  minheight="800px"
                  autosize
              /> 
          </div>
         </GridLayout>	

         <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          disableAutoFocus={true}
          open={this.state.modal}
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
		    </main>
      } 

				 
      {this.state.value === 1 && 
        <main className={classes.content} style={{width: '100vw', height: '100vh'}}> 
        <GridLayout className="layout" layout={this.state.seniorProject.one.layout} cols={12} rowHeight={30} width={1500}
            // onLayoutChange={ (layout) => { 
            //   console.log(layout)
            //   let seniorProject = Object.assign({}, this.state.seniorProject)
            //   seniorProject.one.layout = layout
            //   this.setState({seniorProject})
            // }}
        >
        {/* <div style={{backgroundColor: '#efefef', height: '100%', borderRadius: 5}} key="a">
            <WebView src="https://calendar.google.com" 
            // disablewebsecurity
                style={{ height: '100%'}}
                minheight="800px"
                autosize={true}
            />  
        </div> */}

        <div style={{backgroundColor: '#efefef', height: '100%'}} key="b">
            {/* <WebView src="https://gmail.com" 
            // disablewebsecurity
                style={{ height: '100%'}}
                minheight="800px"
                autosize
            />  */}

            <FileExplorerTree />
        </div>
         </GridLayout>
		    </main>

      }   
		  </div> 
    }

    {this.state.currentProject == 'propractice' &&
		  <div className={classes.root}> 

        {this.state.value === 1 && 
        <main className={classes.content} style={{width: '100vw', height: '100vh'}}> 
          <GridLayout className="layout" layout={this.state.proPractice.one.layout} cols={12} rowHeight={30} width={1500}
              // onLayoutChange={ (layout) => { 
              //   console.log(layout)
              //   let proPractice = Object.assign({}, this.state.seniorProject)
              //   proPractice.one.layout = layout
              //   this.setState({proPractice})
              // }}
          >
          <div style={{backgroundColor: '#efefef', height: '100%', borderRadius: 5}} key="a">
            <WebView src="https://github.com/" 
            // disablewebsecurity
                style={{ height: '100%'}}
                minheight="800px"
                autosize={true}
            />
          </div>

          <div style={{backgroundColor: '#424242'}} key="b">
            <WebView src="https://gmail.com" 
              // disablewebsecurity
                  style={{ height: '100%'}}
                  minheight="800px"
                  autosize
              /> 
          </div>

        
         </GridLayout>	
		    </main>
      } 
				 
      {this.state.value === 0 && 
        <main className={classes.content} style={{width: '100vw', height: '100vh'}}> 
        <GridLayout className="layout" layout={this.state.proPractice.zero.layout} cols={12} rowHeight={30} width={1500}
                onLayoutChange={ (layout) => { 
                  console.log(layout)
                  let proPractice = Object.assign({}, this.state.seniorProject)
                  proPractice.zero.layout = layout
                  this.setState({proPractice})
                }}        
        >
        <div style={{backgroundColor: '#efefef', height: '100%', borderRadius: 5}} key="a">
            <WebView src="https://todoist.com" 
            // disablewebsecurity
                style={{ height: '100%'}}
                minheight="800px"
                autosize={true}
            />  
        </div>

        <div style={{backgroundColor: '#424242'}} key="b">
            <WebView src="http://clocktab.com/" 
            // disablewebsecurity
                style={{ height: '100%'}}
                minheight="800px"
                autosize
            /> 
        </div>

        <div style={{backgroundColor: '#efefef'}} key="c">
            <WebView src="https://trello.com" 
            // disablewebsecurity
                style={{ height: '100%'}}
                minheight="800px"
                autosize
            /> 
        </div>
         </GridLayout>
		    </main>

      }   
		  </div> 
    }

      <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          disableAutoFocus={true}
          open={this.state.addTab}
          onClose={() => this.setState({modalSettings: !this.state.addTab})}
        >
          <div style={{position: 'absolute', top: '30%', left: '30%', width: '600px'}} >
          <Paper style={{padding: 50, borderRadius: 10}}> 

            
            <Typography variant="h5" id="simple-modal-description">
              New Tab
            </Typography>
            <Divider style={{marginTop: '20px', marginBottom : '20px'}} />

            <TextField
              id="standard-name"
              label="Name"
              // value={this.state.newTab}
              // onChange={}
              margin="normal"
            />
            {/* <SimpleModalWrapped /> */}

            
          </Paper>
          </div>
        </Modal>
    
    
    
    </Scrollbars>
		);
	}
}

function mapStateToProps({levelData, copyMovePaths}) {
	return {
		levelData,
		copyMovePaths
	};
}

export default connect(mapStateToProps, actions)(withStyles(styles)(FileExplorer));
