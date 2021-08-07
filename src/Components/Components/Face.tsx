import { Component, h } from 'preact';
import { isNullOrUndefined } from '../../Utils/ToolBox';
import Visible from '../Common/Struct/Visible';
import { SizeKind } from '../Model/SizeKind';

export class Face extends Component<
	{
		Size: SizeKind;
		Eyes: string[];
		Mouths: string[];
		Face: string;
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
		this._eyesIndex = (this._eyesIndex + 1) % this.props.Eyes.length;
		this._eyesDiv.classList.remove(this.props.Eyes[current]);
		this._eyesDiv.classList.add(this.props.Eyes[this._eyesIndex]);

		if (this._eyesIndex === 0) {
			this._eyesTimer = setInterval(() => this.EyesAnimation(), 2000);
		} else {
			this._eyesTimer = setInterval(() => this.EyesAnimation(), 250);
		}
	}

	private MouthAnimation(): void {
		clearInterval(this._mouthTimer);

		let current = this._mouthIndex;
		this._mouthIndex = (this._mouthIndex + 1) % this.props.Mouths.length;
		this._mouthDiv.classList.remove(this.props.Mouths[current]);
		this._mouthDiv.classList.add(this.props.Mouths[this._mouthIndex]);

		if (this._eyesIndex === 0) {
			this._mouthTimer = setInterval(() => this.MouthAnimation(), 1000);
		} else {
			this._mouthTimer = setInterval(() => this.MouthAnimation(), 100);
		}
	}

	public GetSize(): number {
		if (this.props.Size === SizeKind.Bg) {
			return 200;
		} else if (this.props.Size === SizeKind.Md) {
			return 100;
		} else {
			return 75;
		}
	}

	render() {
		return (
			<Visible isVisible={!isNullOrUndefined(this.props)}>
				<div style={`width:${this.GetSize()}px;height:${this.GetSize()}px;`}>
					<div style={`position: relative;width:${this.GetSize()}px;height:${this.GetSize()}px;`}>
						<div class={this.props.Face} />
						<div
							class={this.props.Eyes[0]}
							ref={(dom) => {
								this._eyesDiv = dom;
							}}
						/>
						<div
							class={this.props.Mouths[0]}
							ref={(dom) => {
								this._mouthDiv = dom;
							}}
						/>
					</div>
				</div>
			</Visible>
		);
	}
}
