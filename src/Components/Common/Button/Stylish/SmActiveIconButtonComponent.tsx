import { h, Component } from 'preact';
import SmRedIconButtonComponent from './SmRedIconButtonComponent';
import SmBlackIconButtonComponent from './SmBlackIconButtonComponent';

export default class SmActiveIconButtonComponent extends Component<
	{ callBack: () => void; style: string; isActive: boolean },
	any
> {
	constructor() {
		super();
	}

	render() {
		if (this.props.isActive) {
			return <SmRedIconButtonComponent style={this.props.style} callBack={this.props.callBack} />;
		} else {
			return <SmBlackIconButtonComponent style={this.props.style} callBack={this.props.callBack} />;
		}
	}
}
