import { h, Component, JSX } from 'preact';
import { ColorKind } from './ColorKind';
import SmButtonComponent from './SmButtonComponent';

export default class SmActiveButtonComponent extends Component<
	{ left: JSX.Element; right: JSX.Element; callBack: () => void; isActive: boolean },
	any
> {
	render() {
		if (this.props.isActive) {
			return (
				<SmButtonComponent color={ColorKind.Blue} callBack={this.props.callBack}>
					{this.props.right}
				</SmButtonComponent>
			);
		} else {
			return (
				<SmButtonComponent color={ColorKind.Black} callBack={this.props.callBack}>
					{this.props.left}
				</SmButtonComponent>
			);
		}
	}
}
