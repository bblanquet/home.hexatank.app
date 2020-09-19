import { h, Component } from 'preact';
import { Point } from '../../../../Core/Utils/Geometry/Point';

export default class SmDarkBtnComponent extends Component<
	{ CallBack: () => void; title: string; icon: string; Point: Point },
	{}
> {
	constructor() {
		super();
	}

	render() {
		return (
			<div
				className="btn btn-dark btn-circular"
				style={`transform:translate(${this.props.Point.X}px,${this.props.Point
					.Y}px); opacity:${this.props.Point.IsOrigin() ? 0 : 1}`}
			>
				<div class="max-space container-center" onClick={() => this.props.CallBack()}>
					<div class={`${this.props.icon} circular-space`} />
				</div>
			</div>
		);
	}
}
