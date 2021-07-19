import { h, Component } from 'preact';

export default class Switch extends Component<{ isLeft: boolean; left: any; right: any }, any> {
	constructor() {
		super();
	}

	render() {
		return this.props.isLeft ? this.props.left : this.props.right;
	}
}
