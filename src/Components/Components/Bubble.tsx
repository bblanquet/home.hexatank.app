import { h, Component } from 'preact';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import { SizeKind } from '../Model/SizeKind';
import GreenFace from './Faces/GreenFace';
import YellowFace from './Faces/YellowFace';
import BlueFace from './Faces/BlueFace';
import RedFace from './Faces/RedFace';

export default class Bubble extends Component<
	{ Color: ColorKind; Sentence: string; OnNext: () => void },
	{ Sentence: string; CurrentSentence: string }
> {
	private _timeout: NodeJS.Timeout;

	componentDidMount() {
		this.setState({
			CurrentSentence: '',
			Sentence: this.props.Sentence
		});
	}

	componentDidUpdate() {
		if (!this._timeout) {
			this.TextAnimation();
		}

		if (this.props.Sentence !== this.state.Sentence) {
			this.setState({
				CurrentSentence: '',
				Sentence: this.props.Sentence
			});
			clearTimeout(this._timeout);
			this._timeout = null;
		}
	}

	componentWillUnmount() {
		clearTimeout(this._timeout);
	}

	public TextAnimation(): void {
		if (this.state.CurrentSentence.length < this.state.Sentence.length) {
			let size = this.state.CurrentSentence.length + 2;
			this.setState({ CurrentSentence: this.props.Sentence.substring(0, size) });
		}

		if (this.state.CurrentSentence.length < this.state.Sentence.length) {
			this._timeout = setTimeout(() => {
				this.TextAnimation();
			}, 50);
		}
	}

	public GetFace() {
		if (this.props.Color === ColorKind.Blue) {
			return <BlueFace Size={SizeKind.Sm} />;
		} else if (this.props.Color === ColorKind.Green) {
			return <GreenFace Size={SizeKind.Sm} />;
		} else if (this.props.Color === ColorKind.Red) {
			return <RedFace Size={SizeKind.Sm} />;
		}
		return <YellowFace Size={SizeKind.Sm} />;
	}

	render() {
		return (
			<div class="bubbleApp" style="left: 0px; bottom: 0px;position: absolute;fit-content;width: 90%;margin: 5%;">
				<div class="d-flex" style="flex-direction:row;align-content:space-between;align-items: center">
					{this.GetFace()}
					<div style="width:100%">{this.state.CurrentSentence}</div>
					<button onClick={() => this.props.OnNext()} className="btn btn-primary rounded-pill">
						<Icon Value="fas fa-caret-square-right" />
					</button>
				</div>
			</div>
		);
	}
}
