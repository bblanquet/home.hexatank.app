import { h, Component, JSX } from 'preact';
import SmBlueButtonComponent from './SmBlueButtonComponent';
import SmBlackButtonComponent from './SmBlackButtonComponent';

export default class SmActiveButtonComponent extends Component<
	{ left: JSX.Element; right: JSX.Element; callBack: () => void; isActive: boolean },
	any
> {
	constructor() {
		super();
	}

	render() {
		if (this.props.isActive) {
			return <SmBlueButtonComponent callBack={this.props.callBack}>{this.props.right}</SmBlueButtonComponent>;
		} else {
			return <SmBlackButtonComponent callBack={this.props.callBack}>{this.props.left}</SmBlackButtonComponent>;
		}
	}
}
