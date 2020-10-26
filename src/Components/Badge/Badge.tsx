import { Component, h } from 'preact';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import SmButtonComponent from '../Common/Button/Stylish/SmButtonComponent';

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
				<SmButtonComponent
					callBack={() => {
						this.props.Onclick(this.props.text);
					}}
					color={ColorKind.Black}
				>
					<div class={`${this.props.icon} max-width`} />
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
				</SmButtonComponent>
			</div>
		);
	}
}
