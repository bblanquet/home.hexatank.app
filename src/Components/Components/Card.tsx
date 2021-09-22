import { h, Component } from 'preact';

export default class Card extends Component {
	render() {
		return (
			<div class="container-center">
				<div class="text-detail shadowEffect width80percent">{this.props.children}</div>
			</div>
		);
	}
}
