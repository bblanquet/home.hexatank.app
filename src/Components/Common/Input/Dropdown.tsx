import { h, Component } from 'preact';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { ColorKind } from '../Button/Stylish/ColorKind';

export default class Dropdown extends Component<
	{ OnInput: (e: any) => void; Label: string; Values: string[]; Default: string; Color: ColorKind },
	{}
> {
	private _primary: Dictionary<string> = new Dictionary<string>();

	constructor() {
		super();
		this._primary.Add(ColorKind[ColorKind.Black], 'black-primary');
		this._primary.Add(ColorKind[ColorKind.Blue], 'blue-primary');
		this._primary.Add(ColorKind[ColorKind.Red], 'red-primary');
		this._primary.Add(ColorKind[ColorKind.Green], 'green-primary');
		this._primary.Add(ColorKind[ColorKind.Gray], 'white-primary');
		this._primary.Add(ColorKind[ColorKind.Yellow], 'yellow-primary');
	}

	render() {
		return (
			<div class="input-group mb-3" style="max-width:300px">
				<div class="input-group-prepend">
					<span
						class={`input-group-text ${this._primary.Get(ColorKind[this.props.Color])} custom-btn-layout-1`}
					>
						{this.props.Label}
					</span>
				</div>
				<select
					value={this.props.Default ? this.props.Default : this.props.Values[0]}
					onInput={(e: any) => {
						this.props.OnInput(e);
					}}
					class="custom-select mr-sm-2"
				>
					{this.props.Values.map((v) => <option value={v}>{v}</option>)}
				</select>
			</div>
		);
	}
}
