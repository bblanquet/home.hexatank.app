import { Component, h } from 'preact';
import { Vibrator } from '../../../../Utils/Vibrator';

export default class RightBottomCornerButton extends Component<
	{ OnClick: () => void; isMute?: boolean; isSelected: boolean; logo: string },
	any
> {
	render() {
		return (
			<div role="button" class="custom-right-corner-sm-btn-layout-3 fit-content">
				<div class={`custom-right-corner-sm-btn-layout-2 blue-selection-secondary fit-content`}>
					<div
						class={`custom-right-corner-btn-layout-1 ${this.props.isSelected
							? 'blue-selection-hover-primary'
							: 'blue-selection-primary'}  fit-content`}
						onClick={() => {
							Vibrator.Vibrate();
							this.props.OnClick();
						}}
					>
						<div class={this.props.logo} />
					</div>
				</div>
			</div>
		);
	}
}
