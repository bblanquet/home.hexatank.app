import { h, Component } from 'preact';
import { Dictionnary } from '../../../../Core/Utils/Collections/Dictionnary';
import { ColorKind } from './ColorKind';

export default class ButtonComponent extends Component<{ callBack: () => void; color: ColorKind }, any> {
	constructor() {
		super();
		this._primary.Add(ColorKind[ColorKind.Black], 'black-primary');
		this._primary.Add(ColorKind[ColorKind.Blue], 'blue-primary');
		this._primary.Add(ColorKind[ColorKind.Red], 'red-primary');
		this._primary.Add(ColorKind[ColorKind.Green], 'green-primary');
		this._primary.Add(ColorKind[ColorKind.Gray], 'white-primary');

		this._secondary.Add(ColorKind[ColorKind.Black], 'black-secondary');
		this._secondary.Add(ColorKind[ColorKind.Blue], 'blue-secondary');
		this._secondary.Add(ColorKind[ColorKind.Red], 'red-secondary');
		this._secondary.Add(ColorKind[ColorKind.Green], 'green-secondary');
		this._secondary.Add(ColorKind[ColorKind.Gray], 'white-secondary');
	}

	render() {
		return (
			<div class="custom-btn-layout-4 fit-content btn-space">
				<div class="custom-btn-layout-3 fit-content">
					<div class={`custom-btn-layout-2 ${this._secondary.Get(ColorKind[this.props.color])} fit-content`}>
						<div
							class={`custom-btn-layout-1 ${this._primary.Get(ColorKind[this.props.color])} fit-content`}
							onClick={() => this.props.callBack()}
						>
							{this.props.children}
						</div>
					</div>
				</div>
			</div>
		);
	}

	private _primary: Dictionnary<string> = new Dictionnary<string>();
	private _secondary: Dictionnary<string> = new Dictionnary<string>();
}
