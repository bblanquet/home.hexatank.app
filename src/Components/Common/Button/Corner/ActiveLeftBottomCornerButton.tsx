import { h, Component, JSX } from 'preact';
import LeftBottomCornerButton from './LeftBottomCornerButton';

export default class ActiveLeftBottomCornerButton extends Component<
	{
		OnClick: () => void;
		isActive: boolean;
	},
	any
> {
	render() {
		if (this.props.isActive) {
			return <LeftBottomCornerButton isSelected={this.props.isActive} OnClick={this.props.OnClick} />;
		} else {
			return <LeftBottomCornerButton isSelected={this.props.isActive} OnClick={this.props.OnClick} />;
		}
	}
}
