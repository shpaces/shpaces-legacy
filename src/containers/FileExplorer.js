import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { ROOT_FOLDER, DESKTOP_FOLDER  } from '../constants';

import { Scrollbars } from 'react-custom-scrollbars';


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

// ICONS 
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import FileExplorerTree from '../components/FileExplorerTree';
import FileExplorerTree_All from '../components/FileExplorerTree_All';

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


class FileExplorer extends Component {
	constructor(props) {
		super(props);
		this.updateCurrentPath = this.updateCurrentPath.bind(this);

		this.state = {
			currentPath: DESKTOP_FOLDER, 
			activeTab: 0, 
			open: true, 
			displayImages: false, 
			displayFiles: false
		};
	}

	handleTabSwitch(active) {
        this.setState({ activeTab: active });
	}
	
	componentDidMount() {
		this.props.levelDataListenerOn();
		this.props.pasteDoneListenerOn();
		this.props.levelDataRequest(this.state.currentPath);
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

	render() {
		const { classes } = this.props;
		const {toCopy, toMove} = this.props.copyMovePaths;
	  
		return (
		<Scrollbars style={{ width: '100%', height: '100%' }}
		 	autoHide
		 	renderThumbVertical={({ style, ...props }) =>
				<div {...props} style={{ ...style, backgroundColor: '#E0E9E9', borderRadius: 5 }}/>
			}>

		<div className={classes.root}> 

		<CssBaseline />

		{/* <Drawer
		  variant="permanent"
		  className={classes.drawer}
		  classes={{
				paper: classes.drawerPaper,
			}}
     
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
               <ChevronLeftIcon />
            </IconButton>
		  </div>
				<List>
						{['Desktop', 'Documents', 'Pictures'].map((text, index) => (
							<ListItem button key={text} onClick={this.navigateToFavorite} >
								<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
								<ListItemText primary={text} />
							</ListItem>
						))}
				</List>
				<Divider />
         
		</Drawer> */}
	
		<main className={classes.content}> 
		{/* <PrimarySearchAppBar /> */}

		<div className={classes.toolbar}>
				<div className="file-explorer__navigation">
					<div>
						<h5>Desktop</h5>	
					</div>
						
					<div style={{}}> 
						{/* <BackButton updateCurrentPath={this.updateCurrentPath}
									currentPath={this.state.currentPath}
						/> */}
						<FileExplorerBreadcrumbs 
							currentPath={this.state.currentPath}
							updateCurrentPath={this.updateCurrentPath}
						/>
					</div>

					<div>
						{this.props.copyMovePaths.status === 'inprogress' ? <Spinner /> : ''}
						{/* <button disabled={!toCopy && !toMove}
								onClick={this.clickPasteButtonHandler.bind(this)}
								className="waves-effect waves-light btn paste-btn">Paste Here</button> */}
					</div>
				</div>
		</div>
				
				
		<div className="file-explorer" style={{width: '100%'}}>

				<Paper elevation={5} style={{marginTop: 15}}> 
					<div style={{padding: 10 }}> 			
						<h5> Folders </h5> 
						<FileExplorerTree
							currentPath={this.state.currentPath}
							updateCurrentPath={this.updateCurrentPath}
							copyRequest={this.props.copyRequest}
							moveRequest={this.props.moveRequest}
							pasteRequest={this.props.pasteRequest}
							saveDestPath={this.props.saveDestPath}
							copyMovePaths={this.props.copyMovePaths}
							treeData={this.props.levelData[this.state.currentPath]} 
							fileType={'folder'}
						/>
					</div>
				</Paper> 

				<Paper elevation={5} style={{marginTop: 15}}> 
					<div style={{padding: 10 }}> 
						<h5> Documents </h5>
						<FileExplorerTree
							currentPath={this.state.currentPath}
							updateCurrentPath={this.updateCurrentPath}
							copyRequest={this.props.copyRequest}
							moveRequest={this.props.moveRequest}
							pasteRequest={this.props.pasteRequest}
							saveDestPath={this.props.saveDestPath}
							copyMovePaths={this.props.copyMovePaths}
							treeData={this.props.levelData[this.state.currentPath]} 
							fileType={'document'}
						/>	
					</div>
				</Paper>

				<Paper elevation={5} style={{marginTop: 15}}> 
					<div style={{padding: 10 }}> 
						<h5> Images </h5>
						<FileExplorerTree
							currentPath={this.state.currentPath}
							updateCurrentPath={this.updateCurrentPath}
							copyRequest={this.props.copyRequest}
							moveRequest={this.props.moveRequest}
							pasteRequest={this.props.pasteRequest}
							saveDestPath={this.props.saveDestPath}
							copyMovePaths={this.props.copyMovePaths}
							treeData={this.props.levelData[this.state.currentPath]} 
							fileType={'image'}
						/>
					</div>
				</Paper>

				<Paper elevation={5} style={{marginTop: 15}}> 
					<div style={{padding: 10 }}>
						<FileExplorerTree
							currentPath={this.state.currentPath}
							updateCurrentPath={this.updateCurrentPath}
							copyRequest={this.props.copyRequest}
							moveRequest={this.props.moveRequest}
							pasteRequest={this.props.pasteRequest}
							saveDestPath={this.props.saveDestPath}
							copyMovePaths={this.props.copyMovePaths}
							treeData={this.props.levelData[this.state.currentPath]} 
							fileType={'other'}
						/>
					</div> 
				</Paper>

		</div>

		</main>
		
		</div> 
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
