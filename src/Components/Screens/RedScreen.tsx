import { JSX, h } from 'preact';
import Btn from '../Common/Button/Stylish/Btn';
import { LockBtn } from '../Common/Button/Stylish/LockBtn';
import { VictoryBtn } from '../Common/Button/Stylish/VictoryBtn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import { Face } from '../Components/Face';
import StatBar from '../Components/StatBar';
import Redirect from '../Components/Redirect';
import Visible from '../Components/Visible';
import Struct from '../Components/Struct';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import { StageState } from '../../Services/Campaign/StageState';
import { RedHook } from '../Hooks/RedHook';
import { HookedComponent } from '../Hooks/HookedComponent';
import { CampaignState } from '../Model/GreenState';
import { useState } from 'preact/hooks';

export default class RedScreen extends HookedComponent<{}, RedHook, CampaignState> {
	public GetDefaultHook(): RedHook {
		const [ state, setState ] = useState(RedHook.DefaultState());
		return new RedHook(state, setState);
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
										eyes={[ 'fill-red-eyes-1', 'fill-red-eyes-2' ]}
										mouths={[ 'fill-red-mouth-1', 'fill-red-mouth-2', 'fill-red-mouth-3' ]}
										face={'fill-red-face'}
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
											color={ColorKind.Red}
										>
											<Icon Value="fas fa-fist-raised" /> Fight
										</Btn>
									</div>
								</Visible>
								<div class="container-center">
									<Visible isVisible={!this.Hook.State.HasBubble}>
										<div class="container-center-horizontal">
											<Btn callBack={() => this.Hook.Green()} color={ColorKind.Black}>
												<Icon Value="fas fa-long-arrow-alt-left" />
											</Btn>
											<Btn callBack={() => this.Hook.Blue()} color={ColorKind.Black}>
												<Icon Value="fas fa-long-arrow-alt-right" />
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
			<Btn callBack={() => this.Hook.Select(index)} color={ColorKind.Red}>
				<Icon Value="fas fa-arrow-alt-circle-right" /> {index}
			</Btn>
		);
	}
}
