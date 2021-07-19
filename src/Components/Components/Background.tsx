import { Component, h } from 'preact';

export default class Background extends Component {
	render() {
		return (
			<div id="gradient">
				<div class="background-pattern">{this.props.children}</div>
			</div>
		);
	}
}
