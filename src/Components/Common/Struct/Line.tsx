import { Component, h } from 'preact';

export default class Line extends Component {
	render() {
		return (
			<div
				class="d-flex "
				style="flex-direction:row;align-content:space-between;align-items: baseline;margin-top:5px;margin-bottom:5px"
			>
				{this.props.children}
			</div>
		);
	}
}
