import { Component, h } from 'preact';
import { Vibrator } from '../../../../Utils/Vibrator';
export default class LeftBottomCornerButton extends Component<
	{ OnClick: () => void; isMute?: boolean; isSelected: boolean },
	any
> {
	render() {
		return (
			<div role="button" class="custom-left-corner-sm-btn-layout-3 fit-content">
				<div
					class={`custom-left-corner-sm-btn-layout-2 ${this.props.isSelected
						? 'blue-secondary'
						: 'blue-selection-secondary'}fit-content`}
				>
					<div
						class={`custom-left-corner-btn-layout-1 ${this.props.isSelected
							? 'blue-primary'
							: 'blue-selection-primary'} fit-content`}
						OnClick={() => {
							Vibrator.Vibrate();
							this.props.OnClick();
						}}
					>
						<div class={`fill-tank-multi-cell`} />
					</div>
				</div>
			</div>
		);
	}
}
