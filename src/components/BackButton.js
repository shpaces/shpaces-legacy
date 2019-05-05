import React, { Component } from 'react';
import { ROOT_FOLDER } from '../constants';
import Button from "react-uwp/Button";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

class BackButton extends Component {
	constructor(props) {
		super(props);
		this.levelBack = this.levelBack.bind(this);
	}

	levelBack() {
		const { currentPath, updateCurrentPath } = this.props;
		const newPath = currentPath.match(/^(.+\/)[^\/]+\/$/)[1];
		console.log(newPath);
		updateCurrentPath(newPath);
	}

	render() {
		const { currentPath } = this.props;

		return (
			// <div className="back-btn"> 
			// <Button className="waves-effect waves-light breadcrumb-item" style={{color: 'white'}}>
			// 	<a className={`${currentPath === ROOT_FOLDER && 'disabled'}`} onClick={this.levelBack}>
			// 		<i className="material-icons left">arrow_upward</i>
			// 	</a>
			// </Button>

			<Button className="waves-effect waves-light breadcrumb-item"  onClick={this.levelBack} >
			 	{/* // 	<a className={`${currentPath === ROOT_FOLDER && 'disabled'}`} onClick={this.levelBack}>
			// 	</a> */}
					{/* <ChevronLeftIcon /> */}
			 🔼 Up
			</Button>
			// </div>
		);
	}
}
export default BackButton;
