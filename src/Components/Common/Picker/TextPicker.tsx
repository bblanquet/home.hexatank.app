import { h, Component } from 'preact';
import Icon from '../Icon/IconComponent';
import SmBtn from '../Button/Stylish/SmBtn';
import { ColorKind } from '../Button/Stylish/ColorKind';
import { isNullOrUndefined } from '../../../Utils/ToolBox';

export default class TextPicker extends Component<
	{ Items: string[]; OnSelected: (e: number) => void },
	{ Index: number }
> {
	private _div: HTMLDivElement;

	componentDidMount() {
		this.setState({
			Index: 0
		});
	}

	Update(index: number) {
		this.props.OnSelected(index);
		if (this._div) {
			this._div.classList.remove('slow-bounce');
			setTimeout(() => {
				this._div.classList.add('slow-bounce');
			}, 50);
		}
	}

	render() {
		return (
			<div class="d-flex" style="flex-direction:row;align-content:space-between;align-items: center; margin:10px">
				<SmBtn
					OnClick={() => {
						let index = this.state.Index > 0 ? this.state.Index - 1 : this.props.Items.length - 1;
						this.setState({
							Index: index
						});
						this.Update(index);
					}}
					Color={ColorKind.Red}
				>
					<Icon Value="fas fa-chevron-left" />
				</SmBtn>
				<div class="textBorder">
					<div class="textContainer">
						<div
							ref={(e) => (this._div = e)}
							class="slow-bounce"
							style={`width:100%;height:100%;padding:10px;border-radius:5px`}
						>
							{this.GetText()}
						</div>
					</div>
				</div>
				<SmBtn
					OnClick={() => {
						const index = (this.state.Index + 1) % this.props.Items.length;
						this.setState({
							Index: index
						});
						this.Update(index);
					}}
					Color={ColorKind.Red}
				>
					<Icon Value="fas fa-chevron-right" />
				</SmBtn>
			</div>
		);
	}

	private GetText() {
		if (!isNullOrUndefined(this.state.Index) && this.props.Items) {
			return this.props.Items[this.state.Index];
		} else {
			return '';
		}
	}
}
