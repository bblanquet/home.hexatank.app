import { h, Component } from 'preact';
import { Point } from '../../../../Core/Utils/Geometry/Point';

export default class SmDarkShopBtnComponent extends Component<
	{ CallBack: () => void; Amount: string; Icon: string; Point: Point },
	{}
> {
	constructor() {
		super();
	}

	render() {
		return (
			<div
				className="btn btn-dark btn-circular "
				style={`transform:translate(${this.props.Point.X}px,${this.props.Point
					.Y}px); opacity:${this.props.Point.IsOrigin() ? 0 : 1}`}
			>
				<div class="max-space container-center" onClick={() => this.props.CallBack()}>
					<div class={`${this.props.Icon} circular-space`} />
					<div>
						{this.props.Amount} <span class="fill-diamond badge very-small-space middle"> </span>
					</div>
				</div>
			</div>
		);
	}
}
