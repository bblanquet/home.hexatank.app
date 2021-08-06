import { JSX, h } from 'preact';
import GameCanvas from '../Components/GameCanvas';
import { GameStatus } from '../../Core/Framework/GameStatus';
import OptionPopup from '../Components/OptionPopup';
import Redirect from '../Components/Redirect';
import SmPopup from '../Components/SmPopup';
import Visible from '../Common/Struct/Visible';
import Bubble from '../Components/Bubble';
import { HookedComponent } from '../Hooks/HookedComponent';
import { CamouflageHook } from '../Hooks/CamouflageHook';
import { RuntimeState } from '../Model/RuntimeState';
import { useState } from 'preact/hooks';
import { isNullOrUndefined } from '../../Utils/ToolBox';
import { Vehicle } from '../../Core/Items/Unit/Vehicle';
import { BtnProps } from '../Components/Canvas/BtnProps';
import MenuBtn from '../Components/Canvas/MenuBtn';
import LeftMenu from '../Components/Canvas/LeftMenu';

export default class CamouflageScreen extends HookedComponent<{}, CamouflageHook, RuntimeState> {
	public GetDefaultHook(): CamouflageHook {
		return new CamouflageHook(useState(CamouflageHook.DefaultState()));
	}

	public Rendering(): JSX.Element {
		return (
			<Redirect>
				<Visible
					isVisible={
						this.Hook.State.GameStatus !== GameStatus.Pending &&
						!isNullOrUndefined(this.Hook.State.StatusDetails)
					}
				>
					<SmPopup Status={this.Hook.State.GameStatus} Details={this.Hook.State.StatusDetails} />
				</Visible>
				<Visible isVisible={this.Hook.State.GameStatus === GameStatus.Pending}>
					<Visible isVisible={!this.Hook.State.HasMenu}>
						<div style="position: fixed;">
							<button
								type="button"
								class="btn btn-dark small-space space-out fill-option"
								onClick={() => this.Hook.SetMenu()}
							/>
						</div>
						<Visible isVisible={!this.Hook.State.HasMenu && !isNullOrUndefined(this.Hook.State.Item)}>
							<LeftMenu
								Btns={BtnProps.TankList(this.Hook.State.Item as Vehicle, (e) =>
									this.Hook.SendContext(e)
								)}
							/>
						</Visible>
					</Visible>
					<Visible isVisible={this.Hook.State.HasMenu}>
						<OptionPopup
							Status={this.Hook.State.GameStatus}
							Resume={() => this.Hook.SetMenu()}
							Quit={() => this.Hook.Stop(false)}
						/>
					</Visible>
				</Visible>
				<GameCanvas Center={this.Hook.GetCenter()} OnRefresh={this.Hook.OnRetried} />
				<Visible
					isVisible={!isNullOrUndefined(this.Hook.State.Sentence) && 0 < this.Hook.State.Sentence.length}
				>
					<Bubble Sentence={this.Hook.State.Sentence} OnNext={() => this.Hook.SetNextSentence()} />
				</Visible>
			</Redirect>
		);
	}
}
