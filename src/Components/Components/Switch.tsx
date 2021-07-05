import { h, Component } from 'preact';

export default class Switch extends Component<{ isVisible: boolean; left: any; right: any }, any> {
	constructor() {
		super();
	}

	render() {
		return this.props.isVisible ? this.props.left : this.props.right;
	}
}
