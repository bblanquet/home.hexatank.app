import { h, Component } from 'preact';
import { Dictionary } from '../../../../Core/Utils/Collections/Dictionary';
import { ColorKind } from './ColorKind';

export default class SmButtonComponent extends Component<{ callBack: () => void; color: ColorKind }, any> {
	private _primary: Dictionary<string> = new Dictionary<string>();
	private _secondary: Dictionary<string> = new Dictionary<string>();

	constructor() {
		super();
		this._primary.Add(ColorKind[ColorKind.Black], 'black-primary');
		this._primary.Add(ColorKind[ColorKind.Blue], 'blue-primary');
		this._primary.Add(ColorKind[ColorKind.Red], 'red-primary');
		this._primary.Add(ColorKind[ColorKind.Green], 'green-primary');
		this._primary.Add(ColorKind[ColorKind.Gray], 'white-primary');
		this._primary.Add(ColorKind[ColorKind.Yellow], 'yellow-primary');

		this._secondary.Add(ColorKind[ColorKind.Black], 'black-secondary');
		this._secondary.Add(ColorKind[ColorKind.Blue], 'blue-secondary');
		this._secondary.Add(ColorKind[ColorKind.Red], 'red-secondary');
		this._secondary.Add(ColorKind[ColorKind.Green], 'green-secondary');
		this._secondary.Add(ColorKind[ColorKind.Gray], 'white-secondary');
		this._secondary.Add(ColorKind[ColorKind.Yellow], 'yellow-secondary');
	}

	render() {
		return (
			<div class="custom-sm-btn-layout-3 fit-content">
				<div class={`custom-sm-btn-layout-2 ${this._secondary.Get(ColorKind[this.props.color])} fit-content`}>
					<div
						class={`custom-btn-layout-1 ${this._primary.Get(ColorKind[this.props.color])} fit-content`}
						onClick={this.props.callBack}
					>
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}
