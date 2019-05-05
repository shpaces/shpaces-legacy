import React, { Component } from 'react';
import _ from 'lodash';

import Button from "react-uwp/Button";


class FileExplorerBreadcrumbs extends Component {
	constructor(props) {
		super(props);
	}

	levelBack= () => {
		const { currentPath, updateCurrentPath } = this.props;
		const newPath = currentPath.match(/^(.+\/)[^\/]+\/$/)[1];
		console.log(newPath);
		updateCurrentPath(newPath);
	}

	shapeBreadcrumbs(currentPath) {
		return _.map(_.split(currentPath, '/'), (folder)=> {
			return {
				path: folder && currentPath.substr(0, currentPath.indexOf(folder) + folder.length + 1),
				title: folder
			};
		});
	}

	renderBreadcrumbs() {
		const {	currentPath, updateCurrentPath } = this.props;
		const shapedBreadcrumbs = this.shapeBreadcrumbs(currentPath);
			return _.map(shapedBreadcrumbs, (crumb) => {
				return crumb.title && <Button className="waves-effect waves-light breadcrumb-item" onClick={() => {updateCurrentPath(crumb.path)}} key={crumb.title}>
					{ 
						crumb.title == 'root' ? 
						'🏠'
						: 
						`${crumb.title}/`
					}
					{/* {`${crumb.title}/`} */}
					
					</Button>
			});
	}

	render() {
		return (
			<div>
				<Button className="waves-effect waves-light breadcrumb-item" onClick={this.levelBack}>
			 	{/* // 	<a className={`${currentPath === ROOT_FOLDER && 'disabled'}`} onClick={this.levelBack}>
			// 	</a> */}
					{/* <ChevronLeftIcon /> */}
			 🔼 Up
				</Button>
				{this.renderBreadcrumbs()}
			</div>
		);
	}
}
export default FileExplorerBreadcrumbs;
