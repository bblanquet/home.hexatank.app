import { h, Component } from 'preact';

export default class Visible extends Component<{ isVisible: boolean }, {}> {
	constructor() {
		super();
	}

	render() {
		if (this.props.isVisible) {
			return this.props.children;
		} else {
			return '';
		}
	}
}
