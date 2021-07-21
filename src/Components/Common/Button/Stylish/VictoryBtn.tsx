import { Component, h } from 'preact';
import { AudioArchive } from '../../../../Core/Framework/AudioArchiver';
import { Singletons, SingletonKey } from '../../../../Singletons';
import { IAudioService } from '../../../../Services/Audio/IAudioService';
import Icon from '../../Icon/IconComponent';
import { AudioLoader } from '../../../../Core/Framework/AudioLoader';

export class VictoryBtn extends Component<any, any> {
	private _lockDiv: any;

	render() {
		return (
			<div
				class={`custom-btn-layout-4 green-secondary max-fit-content btn-space`}
				ref={(e: any) => {
					this._lockDiv = e;
				}}
			>
				<div class={`custom-btn-layout-2 green-secondary max-fit-content `}>
					<div
						class={`custom-btn-layout-1 green-primary max-fit-content`}
						onClick={() => {
							Singletons.Load<IAudioService>(SingletonKey.Audio).Play(
								AudioLoader.GetAudio(AudioArchive.ok),
								0.1
							);
							this._lockDiv.classList.remove('bounce');
							setTimeout(() => {
								this._lockDiv.classList.add('bounce');
							}, 10);
						}}
					>
						<Icon Value="fas fa-flag" />
					</div>
				</div>
			</div>
		);
	}
}
