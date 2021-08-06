import { Component, h } from 'preact';
import { AudioArchive } from '../../../../Core/Framework/AudioArchiver';
import { Singletons, SingletonKey } from '../../../../Singletons';
import { IAudioService } from '../../../../Services/Audio/IAudioService';
import Icon from '../../Icon/IconComponent';
import { AudioLoader } from '../../../../Core/Framework/AudioLoader';
import SmBtn from './SmBtn';
import { ColorKind } from './ColorKind';

export class LockBtn extends Component<{ Index: number }, any> {
	private _lockDiv: any;

	render() {
		return (
			<div
				ref={(e: any) => {
					this._lockDiv = e;
				}}
			>
				<SmBtn
					OnClick={() => {
						Singletons.Load<IAudioService>(SingletonKey.Audio).Play(
							AudioLoader.GetAudio(AudioArchive.nok),
							0.1
						);
						this._lockDiv.classList.remove('bounce');
						setTimeout(() => {
							this._lockDiv.classList.add('bounce');
						}, 10);
					}}
					Color={ColorKind.Yellow}
				>
					<div class={`fill-lock max-width`} />
					<Icon Value="fas fa-arrow-alt-circle-right" /> {this.props.Index}
				</SmBtn>
			</div>
		);
	}
}
