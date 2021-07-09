import { Component, h } from 'preact';
import { AudioArchive } from '../../../../Core/Framework/AudioArchiver';
import { Singletons, SingletonKey } from '../../../../Singletons';
import { IAudioService } from '../../../../Services/Audio/IAudioService';
import Icon from '../../Icon/IconComponent';

export class LockButton extends Component<any, any> {
	private _lockDiv: any;

	render() {
		return (
			<div
				class={`custom-btn-layout-4 custom-btn-layout-2 yellow-secondary fit-content`}
				ref={(e: any) => {
					this._lockDiv = e;
				}}
			>
				<div
					class={`custom-btn-layout-1 yellow-primary fit-content`}
					onClick={() => {
						Singletons.Load<IAudioService>(SingletonKey.Audio).Play(`${AudioArchive.nok}`, 0.1);
						this._lockDiv.classList.remove('bounce');
						setTimeout(() => {
							this._lockDiv.classList.add('bounce');
						}, 10);
					}}
				>
					<Icon Value="fas fa-lock" />
				</div>
			</div>
		);
	}
}
