import { h, Component } from 'preact';
import { AudioArchive } from '../../../../Core/Framework/AudioArchiver';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { Singletons, SingletonKey } from '../../../../Singletons';
import { IAudioService } from '../../../../Services/Audio/IAudioService';
import { ColorKind } from './ColorKind';

export default class Btn extends Component<{ callBack: () => void; color: ColorKind }, any> {
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
			<div class="custom-btn-layout-4 fit-content btn-space">
				<div class="custom-btn-layout-3 fit-content">
					<div class={`custom-btn-layout-2 ${this._secondary.Get(ColorKind[this.props.color])} fit-content`}>
						<div
							class={`custom-btn-layout-1 ${this._primary.Get(ColorKind[this.props.color])} fit-content`}
							onClick={() => {
								this.Howl();
								this.props.callBack();
							}}
						>
							{this.props.children}
						</div>
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
