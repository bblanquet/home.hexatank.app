import { Component, h } from 'preact';

export default class Column extends Component {
	render() {
		return (
			<div
				class="d-flex justify-content-start"
				style="flex-direction:column;align-content:space-between;align-items:center;"
			>
				{this.props.children}
			</div>
		);
	}
}
