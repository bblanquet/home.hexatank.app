import { h, JSX } from 'preact';
import Redirect from '../Components/Redirect';
import Btn from '../Common/Button/Stylish/Btn';
import { LockBtn } from '../Common/Button/Stylish/LockBtn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import { Face } from '../Components/Face';
import StatBar from '../Components/StatBar';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import Struct from '../Components/Struct';
import { StageState } from '../../Services/Campaign/StageState';
import { VictoryBtn } from '../Common/Button/Stylish/VictoryBtn';
import { HookedComponent } from '../Hooks/HookedComponent';
import { BlueHook } from '../Hooks/BlueHook';
import { CampaignState } from '../Model/GreenState';
import { useState } from 'preact/hooks';
import Visible from '../Components/Visible';

export default class BlueScreen extends HookedComponent<{}, BlueHook, CampaignState> {
	public GetDefaultHook(): BlueHook {
		const [ state, setState ] = useState(BlueHook.DefaultState());
		return new BlueHook(state, setState);
	}

	public Rendering(): JSX.Element {
		return (
			<Redirect>
				<Struct
					header={<StatBar />}
					content={
						<div class="container-center-horizontal">
							<div style="width:80%">
								<div class="container-center">
									<Face
										eyes={[ 'fill-blue-eyes-1', 'fill-blue-eyes-2' ]}
										mouths={[ 'fill-blue-mouth-1', 'fill-blue-mouth-2', 'fill-blue-mouth-3' ]}
										face={'fill-blue-face'}
									/>
								</div>
								<Visible isVisible={this.Hook.State.HasBubble}>
									<div class="arrow-up" />
									<p class="bubble">{this.Hook.State.CurrentSentence}</p>
									<div class="container-center-horizontal">
										<Btn callBack={() => this.Hook.SetBubble()} color={ColorKind.Black}>
											<Icon Value="fas fa-undo-alt" /> Back
										</Btn>
										<Btn
											callBack={() => this.Hook.Start(this.Hook.State.Level)}
											color={ColorKind.Blue}
										>
											<Icon Value="fas fa-fist-raised" /> Fight
										</Btn>
									</div>
								</Visible>
								<div class="container-center">
									<Visible isVisible={!this.Hook.State.HasBubble}>
										<div class="container-center-horizontal">
											<Btn callBack={() => this.Hook.Red()} color={ColorKind.Black}>
												<Icon Value="fas fa-long-arrow-alt-left" />
											</Btn>
										</div>
										<div class="d-flex flex-wrap justify-content-center">
											{this.Hook.GetStages().map((state, index) => {
												if (state === StageState.lock) {
													return <LockBtn />;
												} else if (state === StageState.achieved) {
													return <VictoryBtn />;
												} else {
													return this.GetButton(index + 1);
												}
											})}
										</div>
									</Visible>
								</div>
							</div>
						</div>
					}
					footer={
						<div class="navbar nav-inner">
							<SmBtn callBack={() => this.Hook.Back()} color={ColorKind.Black}>
								<Icon Value="fas fa-undo-alt" /> Back
							</SmBtn>
						</div>
					}
				/>
			</Redirect>
		);
	}

	private GetButton(index: number) {
		return (
			<Btn callBack={() => this.Hook.Select(index)} color={ColorKind.Blue}>
				<Icon Value="fas fa-arrow-alt-circle-right" /> {index}
			</Btn>
		);
	}
}
