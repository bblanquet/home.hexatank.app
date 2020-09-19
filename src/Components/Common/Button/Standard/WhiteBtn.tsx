import { h, Component } from 'preact';
import { Point } from '../../../../Core/Utils/Geometry/Point';

export default class WhiteBtn extends Component<{ CallBack: () => void; icon: string; Point: Point }, {}> {
	constructor() {
		super();
	}

	render() {
		return (
			<div
				className="btn btn-light btn-circular "
				style={`transform:translate(${this.props.Point.X}px,${this.props.Point
					.Y}px); opacity:${this.props.Point.IsOrigin() ? 0 : 1}`}
			>
				<div class="max-space container-center" onClick={() => this.props.CallBack()}>
					<div class={`${this.props.icon} circular-space`} />
				</div>
			</div>
		);
	}

	SetPosition(point: Point): void {
		this.setState({
			Point: point
		});
	}
}
