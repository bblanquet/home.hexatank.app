import { h, Component } from 'preact';
import { Point } from '../../../../Utils/Geometry/Point';

export default class LightDarkBtn extends Component<
	{ CallBack: () => void; Amount: string; Icon: string; Point: Point },
	{}
> {
	constructor() {
		super();
	}

	render() {
		return (
			<a
				onClick={() => this.props.CallBack()}
				class="menuItem"
				style={`left:${this.props.Point.X}%;top:${this.props.Point.Y}%`}
			>
				<div
					className="btn btn-dark btn-circle"
					style={`opacity:${this.props.Point.IsOrigin() ? 0 : 1}; border:1px solid #aaaaaa;`}
				>
					<div class={`${this.props.Icon} circular-space`} style="width:100%" />
					{this.props.Amount} <span class="fill-diamond badge very-small-space middle"> </span>
				</div>
			</a>
		);
	}
}
