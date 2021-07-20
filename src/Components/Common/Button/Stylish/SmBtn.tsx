import { h, Component } from 'preact';
import { AudioArchive } from '../../../../Core/Framework/AudioArchiver';
import { IAudioService } from '../../../../Services/Audio/IAudioService';
import { Singletons, SingletonKey } from '../../../../Singletons';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { ColorKind } from './ColorKind';

export default class SmBtn extends Component<{ OnClick: () => void; Color: ColorKind }, any> {
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
			<div class="custom-sm-btn-layout-3 fit-content" style="margin-left:5px;marigh-right:5px">
				<div class={`custom-sm-btn-layout-2 ${this._secondary.Get(ColorKind[this.props.Color])} fit-content`}>
					<div
						class={`custom-btn-layout-1 ${this._primary.Get(ColorKind[this.props.Color])} fit-content`}
						onClick={() => {
							this.Howl();
							navigator.vibrate([ 50 ]);
							this.props.OnClick();
						}}
					>
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}

	private Howl() {
		const audioService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		if (audioService) {
			Singletons.Load<IAudioService>(SingletonKey.Audio).Play(`${AudioArchive.ok}`, 0.2);
		}
	}
}
