import { Component, h } from 'preact';

export default class Line extends Component {
	render() {
		return (
			<div
				class="d-flex justify-content-start"
				style="flex-direction:row;align-content:space-between;align-items: baseline"
			>
				{this.props.children}
			</div>
		);
	}
}