
import React, { Component } from 'react';
import { remote, shell } from 'electron';
import shuffle from 'shufflejs'
// const shell = require('electron').shell;
var path = require('path');
var prettyFileIcons = require('pretty-file-icons');


var electronFs = remote.require('fs');
import _ from 'lodash';

import ProgressBar from "react-uwp/ProgressBar";
const { Menu, MenuItem } = remote;

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chip from '@material-ui/core/Chip';


import FileIcon from 'react-file-icon';

import posed, { PoseGroup } from 'react-pose'
import FileCard from './FileCard';


// const MyImage = (props) => { 
	
// 	return ( 
// 	<Image
// 		source={require('C:/Users/theaz/Desktop/me.jpg')}
// 		style={{width: 50}}
// 	/> 
// 	)
// }
const Item = posed.div({
	enter: { opacity: 1 },
	exit: { opacity: 0 }
  })


class FileExplorerTree extends Component {
	constructor(props) {
		super(props);

		this.menu = null;
		this.clickedPath = null;
		
		this.state = { 
			display: this.props.display, 
			filter: '', 
			filterList: []
		}
	}

	componentWillMount() {
		this.menu = new Menu();
		this.menu.append(new MenuItem({
				label: 'Copy',
				click: () => {
					this.props.copyRequest(this.clickedPath);
					this.menu.items[4].enabled = true;
				}})
		);
		this.menu.append(new MenuItem({type: 'separator'}));
		this.menu.append(new MenuItem({
			label: 'Move',
			click: () => {
				this.props.moveRequest(this.clickedPath);
				this.menu.items[4].enabled = true;
			}})
		);
		this.menu.append(new MenuItem({type: 'separator'}));
		this.menu.append(new MenuItem({
			label: 'Paste',
			enabled: _.some(this.props.copyMovePaths, _.isEmpty),
			click: () => {
				const { toCopy, toMove } = this.props.copyMovePaths;
				this.props.pasteRequest(toCopy || toMove, this.clickedPath,  toCopy ? 'copy' : 'move');
			}})
		);
	}


	updateCurrentPath(folder) {
		!folder.isFile && this.props.updateCurrentPath(`${this.props.currentPath}${folder.title}/`);
	}

	contextMenu(folderTitle) {
		this.clickedPath = `${this.props.currentPath}${folderTitle}/`;
		this.menu.popup(remote.getCurrentWindow());
	}

	componentDidUpdate(prevProps) { 
		// Typical usage (don't forget to compare props):
		if (this.props.userID !== prevProps.userID) {
			this.fetchData(this.props.userID);
			console.log('🚀',this.props.userID)
		}
	}

	renderFolders() {
		let allFilters = []
		let folders =  _.map(this.props.treeData, folder => {

			// console.log('ICON: ' + prettyFileIcons.getIcon(folder.title, 'svg'))
			let current = this.props.currentPath			
			let imagePath = path.join(__dirname) + current.substring(8) + folder.title
			let prettyIconType = prettyFileIcons.getIcon(folder.title, 'svg')
		
			if (this.props.fileType == 'other') { 
				if (!allFilters.includes(folder.mimeType)) { 
					allFilters.push(folder.mimeType)
				}
			}	

			if (folder.title[0] == '.') { 
				return
			} else {
			if (this.props.fileType == 'folder') {
				if (!folder.isFile) {  
				return(
					<Tooltip title={folder.title} TransitionComponent={Zoom} enterDelay={100} leaveDelay={100} >
					<div 
						onContextMenu={() => {
							this.contextMenu(folder.title)
						}}
						onClick={() => {this.updateCurrentPath(folder)}}
						key={folder.title}
					>
						<FileCard name={folder.title.substring(0,10)} image={'./assets/icons/folder.png'}/>
					</div>
					</Tooltip>
				)
				}
			} 
			else if (this.props.fileType == 'document') {
				if (folder.mimeType == 'application/pdf') {  
				return(
				<Tooltip title={folder.title} TransitionComponent={Zoom} enterDelay={300} leaveDelay={100}>
					<FileCard name={folder.title.substring(0,10)}  image={"./assets/icons/" + prettyIconType}/>
				</Tooltip>
				)
				}
			} else if (this.props.fileType == 'image') {
				if (folder.mimeType == 'image/jpeg' || folder.mimeType == 'image/png') {  
				return(
					<Tooltip title={folder.title} TransitionComponent={Zoom} enterDelay={300} leaveDelay={100}>

					<a 	className="collection-item  root-item"
						onContextMenu={() => {
							this.contextMenu(folder.title)
						}}
						onClick={() => {
							let current = this.props.currentPath
							let imagePath = path.join(__dirname) + current.substring(8) + folder.title
							console.log(imagePath)
							shell.openItem(imagePath)

						}}
						key={folder.title}
					>

							<img src={imagePath} style={{width: '100%', borderRadius: 10}} />
						

					</a>
					</Tooltip>
				
				)
				}
			} 
			
			else { 
				if (folder.isFile) {  

					if (this.state.filter == '') { 

						return(
							<Tooltip title={folder.title} TransitionComponent={Zoom} enterDelay={300} leaveDelay={100}>
							<div onClick={() => { 
								let current = this.props.currentPath
								let openFile = path.join(__dirname) + current.substring(8) + folder.title
								console.log(openFile)
								shell.openItem(openFile)
							}} > 

							<FileCard name={folder.title.substring(0,10)}  image={"./assets/icons/" + prettyIconType}/>
							</div>
						</Tooltip>
					)
					} else if (this.state.filter == folder.mimeType) { 
						return (
							<Tooltip title={folder.title} TransitionComponent={Zoom} enterDelay={300} leaveDelay={100}>
							<div onClick={() => { 
								let current = this.props.currentPath
								let openFile = path.join(__dirname) + current.substring(8) + folder.title
								console.log(openFile)
								shell.openItem(openFile)
							}} > 

							<FileCard name={folder.title.substring(0,10)}  image={"./assets/icons/" + prettyIconType}/>
							</div>
							</Tooltip>
						)
					}
				}
			}
		} 
			
		});

		if (this.props.fileType == 'other') { 
			// console.log("🚀", allFilters)
			// this.setState({allFilters: allFilters})
		}
		
		return folders
	}

	renderEmptyFolder() {
		return <div className="center-align"> 
				{/* <p className="center-align">loading...</p> */}
				<CircularProgress className="center-align" color="secondary"/>

			</div> 
	}

	renderExplorer() {
		if (this.props.treeData && this.props.treeData.length) {
			return <div className="collection">{this.renderFolders()}</div>
		}
		return <div>{this.renderEmptyFolder()}</div>;
	}


	render() {
		return (
			<div>
				{
					this.props.fileType == 'other' && 
					<div style={{display: 'flex'}}> 
						<h5 style={{margin: '2px', marginRight: '10px'}}> Files </h5>

						<Chip variant="outlined" label="All" onClick={ () => this.setState({filter: ''})}/>
						<Chip variant="outlined" label="PNG" onClick={ () => this.setState({filter: 'image/png'})}/>
						<Chip variant="outlined" label="PDF" onClick={ () => this.setState({filter: 'application/pdf'})}/>
					</div>
				}
					{this.renderExplorer()}
			</div>
		);
	}
}
export default FileExplorerTree;
