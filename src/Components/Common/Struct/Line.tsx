import { Component, h } from 'preact';

export default class Line extends Component {
	render() {
		return (
			<div
				class="d-flex justify-content-start"
				style="flex-direction:row;align-content:space-between;flex-direction:row;align-items:center;"
			>
				{this.props.children}
			</div>
		);
	}
}
