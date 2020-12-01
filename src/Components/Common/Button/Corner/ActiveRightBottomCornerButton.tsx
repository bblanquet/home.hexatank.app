import { h, Component, JSX } from 'preact';
import RightBottomCornerButton from './RightBottomCornerButton';

export default class ActiveRightBottomCornerButton extends Component<
	{
		callBack: () => void;
		isActive: boolean;
	},
	any
> {
	render() {
		if (this.props.isActive) {
			return <RightBottomCornerButton isSelected={this.props.isActive} callBack={this.props.callBack} />;
		} else {
			return <RightBottomCornerButton isSelected={this.props.isActive} callBack={this.props.callBack} />;
		}
	}
}
