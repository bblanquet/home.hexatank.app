import { Component, h } from 'preact';
import { isNullOrUndefined } from '../../Core/Utils/ToolBox';
import Visible from './VisibleComponent';

export class Face extends Component<
	{
		eyes: string[];
		mouths: string[];
		face: string;
	},
	any
> {
	private _eyesDiv: HTMLDivElement;
	private _mouthDiv: HTMLDivElement;
	private _mouthTimer: NodeJS.Timer;
	private _eyesTimer: NodeJS.Timer;
	private _eyesIndex = 0;
	private _mouthIndex = 0;

	componentDidMount() {
		this._eyesTimer = setInterval(() => this.EyesAnimation(), 200);
		this._mouthTimer = setInterval(() => this.MouthAnimation(), 200);
	}

	componentWillUnmount() {
		clearInterval(this._eyesTimer);
		clearInterval(this._mouthTimer);
	}

	private EyesAnimation(): void {
		clearInterval(this._eyesTimer);
		let current = this._eyesIndex;
		this._eyesIndex = (this._eyesIndex + 1) % this.props.eyes.length;
		this._eyesDiv.classList.remove(this.props.eyes[current]);
		this._eyesDiv.classList.add(this.props.eyes[this._eyesIndex]);

		if (this._eyesIndex === 0) {
			this._eyesTimer = setInterval(() => this.EyesAnimation(), 2000);
		} else {
			this._eyesTimer = setInterval(() => this.EyesAnimation(), 250);
		}
	}

	private MouthAnimation(): void {
		clearInterval(this._mouthTimer);

		let current = this._mouthIndex;
		this._mouthIndex = (this._mouthIndex + 1) % this.props.mouths.length;
		this._mouthDiv.classList.remove(this.props.mouths[current]);
		this._mouthDiv.classList.add(this.props.mouths[this._mouthIndex]);

		if (this._eyesIndex === 0) {
			this._mouthTimer = setInterval(() => this.MouthAnimation(), 1000);
		} else {
			this._mouthTimer = setInterval(() => this.MouthAnimation(), 100);
		}
	}

	render() {
		return (
			<Visible isVisible={!isNullOrUndefined(this.props)}>
				<div class="generalContainer">
					<div class="container-center">
						<div class="logo-container">
							<div class={this.props.face} />
							<div
								class={this.props.eyes[0]}
								ref={(dom) => {
									this._eyesDiv = dom;
								}}
							/>
							<div
								class={this.props.mouths[0]}
								ref={(dom) => {
									this._mouthDiv = dom;
								}}
							/>
						</div>
					</div>
				</div>
			</Visible>
		);
	}
}
