import { Component, h } from 'preact';

export default class Background extends Component {
	render() {
		return (
			<div class="background-color">
				<div class="background-pattern">{this.props.children}</div>
			</div>
		);
	}
}
