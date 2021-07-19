import { Component, h } from 'preact';
import Visible from '../../Struct/Visible';
import { ColorKind } from '../Stylish/ColorKind';
import SmBtn from '../Stylish/SmBtn';
import AnimatedIcon from './AnimatedIcon';

export default class Badge extends Component<
	{ Onclick: (e: string) => void; icon: string; text: string; percentage: number },
	any
> {
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<div class="space-out-horizontal">
				<SmBtn
					OnClick={() => {
						this.props.Onclick(this.props.text);
					}}
					Color={ColorKind.Black}
				>
					<div class={`${this.props.icon} max-width`}>
						<Visible isVisible={this.props.percentage === 100}>
							<AnimatedIcon
								values={[ 'fill-light-1', 'fill-light-2', 'fill-light-3', 'fill-light-4' ]}
								frequency={1000}
							/>
						</Visible>
					</div>
					<div class="progress" style="height:20px; border: 4px solid rgb(198, 198, 198);">
						<div
							class={this.props.percentage === 100 ? 'progress-bar bg-danger' : 'progress-bar bg-dark '}
							role="progressbar"
							style={'width:' + this.props.percentage + '%'}
							aria-valuenow={this.props.percentage}
							aria-valuemin="0"
							aria-valuemax="100"
						/>
					</div>
				</SmBtn>
			</div>
		);
	}
}
