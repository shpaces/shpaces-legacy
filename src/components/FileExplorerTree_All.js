
import React, { Component } from 'react';
import { remote } from 'electron';
import _ from 'lodash';
import Shuffle from 'shufflejs'

import ProgressBar from "react-uwp/ProgressBar";
const { Menu, MenuItem } = remote;

import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import FileIcon from 'react-file-icon';

// const MyImage = (props) => { 
	
// 	return ( 
// 	<Image
// 		source={require('C:/Users/theaz/Desktop/me.jpg')}
// 		style={{width: 50}}
// 	/> 
// 	)
// }



class FileExplorerTree extends Component {
	constructor(props) {
		super(props);

		this.menu = null;
		this.clickedPath = null;
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
    
    componentDidMount () { 
        this.shuffle = new Shuffle(this.element, {
            itemSelector: '.file-item',
            sizer: this.sizer,
          });
    }

    componentDidUpdate () { 
        this.shuffle.resetItems();
    }

    searchFiles () { 
        try { 
            this.shuffle.filter('Ai')
        } catch (e) { 
            console.log(e)
        }
    }

	updateCurrentPath(folder) {
		!folder.isFile && this.props.updateCurrentPath(`${this.props.currentPath}${folder.title}/`);
	}

	contextMenu(folderTitle) {
		this.clickedPath = `${this.props.currentPath}${folderTitle}/`;
		this.menu.popup(remote.getCurrentWindow());
	}

	renderFolders() {
		
		return _.map(this.props.treeData, folder => {
			// console.log(folder)
			let iconType = ''
			let imagepath = ''
			let isImage = false
			if (folder.isFile) { 
				if (folder.mimeType == 'application/pdf') { 
					iconType = 'insert_photo'
				} else if (folder.mimeType == 'image/jpeg') { 
					isImage = true
					iconType = ('f_logo.jpg')
					imagepath = this.props.currentPath + folder.title
					console.log("image path:", imagepath)
				} 	
				else { 
					iconType = 'insert_drive_file'
				} 
			} else { 
				iconType = 'folder'
			}
			if (folder.title[0] == '.') { 
				return
			} else {
				
			if (this.props.fileType == 'folder') {
				if (!folder.isFile) {  
				return(
					<a 	className="collection-item avatar root-item file-item"
						onContextMenu={() => {
							this.contextMenu(folder.title)
						}}
						onClick={() => {this.updateCurrentPath(folder)}}
						key={folder.title}
					>
							<i className="material-icons circle ">
								{iconType}
								{/* {folder.isFile ? 'insert_drive_file' : 'folder'} */}
								{folder.mimeType == 'application/pdf' }						
							</i>
							{/* {isImage && 
								<MyImage source={folder.title} />
							}  */}
							
							{folder.title} 
					</a>
				
				)
				}
			} 
			else if (this.props.fileType == 'document') {
				if (folder.mimeType == 'application/pdf') {  
				return(
					<a 	className="collection-item avatar root-item file-item"
						onContextMenu={() => {
							this.contextMenu(folder.title)
						}}
						onClick={() => {this.updateCurrentPath(folder)}}
						key={folder.title}
					>
							<i className="material-icons circle ">
								{iconType}
								{/* {folder.isFile ? 'insert_drive_file' : 'folder'} */}
								{folder.mimeType == 'application/pdf' }						
							</i>							
							{folder.title} 
					</a>
				
				)
				}
			} else if (this.props.fileType == 'image') {
				if (folder.mimeType == 'image/jpeg') {  
				return(
					<a 	className="collection-item avatar root-item file-item"
						onContextMenu={() => {
							this.contextMenu(folder.title)
						}}
						onClick={() => {this.updateCurrentPath(folder)}}
						key={folder.title}
					>
							<i className="material-icons circle ">
								{iconType}
								{/* {folder.isFile ? 'insert_drive_file' : 'folder'} */}
								{/* {folder.mimeType == 'application/pdf' }						 */}
							</i>		
							{/* <MyImage  /> */}

							{folder.title} 
					</a>
				
				)
				}
			} 
			
			else { 
				if (folder.isFile) {  
					return(
                        // <div key={folder.title}  className="file-item"> 
						<a 	className="collection-item  avatar root-item  "
							onContextMenu={() => {
								this.contextMenu(folder.title)
							}}
							onClick={() => console.log(this.props.currentPath + folder)}
							key={folder.title}
                            style={{overflow: 'hidden'}}
                            data-title={folder.title}
						>
								<i className="material-icons circle white ">
									{/* {iconType} */}
								<FileIcon size={40} extension="pdf" color='lavender' type="image"  />
								 
									{/* {folder.mimeType == 'application/pdf' }						 */}
								</i>
								{/* {isImage &&  
									<MyImage ImageSource={}/>
								}  */}			

									{/* <MyImage /> */}

								{folder.title} 
						</a>
                        // </div>
					// 	<Card >
					// 	<CardContent>
					// 		{folder.title}  
					// 	</CardContent>`
					// 	<CardActions>
					// 	  {/* <Button size="small">Openn</Button> */}
					// 	</CardActions>
					//   </Card>
					
					)
					}
			}
		} 
			
		});
	}

	renderEmptyFolder() {
		return <h2 className="center-align">Folder is empty</h2>;
		// return <ProgressBar isIndeterminate  />;

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
            <IconButton onClick={this.searchFiles} >
                <SearchIcon />
            </IconButton>
			<div ref={element => this.element = element} className="row my-shuffle " >
            
                {/* {this.renderExplorer()} */}
            { 
                _.map(this.props.treeData, folder => {
                    console.log(folder)
                    return (
                    <div key={folder.title} className="col-3@xs col-4@sm file-item"
                        style={{backgroundColor: '#efefef', padding: 10}}
                        data-title={folder.title}
                    >
                    <a 	className="collection-item avatar root-item"
                        onContextMenu={() => {
                            this.contextMenu(folder.title)
                        }}
                        onClick={() => console.log(this.props.currentPath + folder)}
                        key={folder.title}
                        style={{overflow: 'hidden'}}
                    >
                        <i className="material-icons circle white ">
                         <FileIcon size={40} extension="pdf" color='lavender' type="image"  />
                        </i>
                        {folder.title} 
                    </a>
                    </div>
                    )
                } 
                )
            }
                {/* <div ref={element => this.sizer = element} className="col-1@xs col-1@sm photo-grid__sizer"></div> */}
			</div>
            </div>
		);
	}
}
export default FileExplorerTree;
