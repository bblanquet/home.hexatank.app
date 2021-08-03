import { JSX, h } from 'preact';
import { Truck } from '../../Core/Items/Unit/Truck';
import GameCanvas from '../Components/GameCanvas';
import { GameStatus } from '../../Core/Framework/GameStatus';
import TruckMenuComponent from '../Components/Canvas/TruckMenuComponent';
import OptionPopup from '../Components/OptionPopup';
import Redirect from '../Components/Redirect';
import SmPopup from '../Components/SmPopup';
import Visible from '../Common/Struct/Visible';
import { HookedComponent } from '../Hooks/HookedComponent';
import { CamouflageHook } from '../Hooks/CamouflageHook';
import { RuntimeState } from '../Model/RuntimeState';
import { useState } from 'preact/hooks';
import { Item } from '../../Core/Items/Item';
import { isNullOrUndefined } from '../../Utils/ToolBox';

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
							<TruckMenuComponent
								callBack={(e: Item) => this.Hook.SendContext(e)}
								Truck={this.Hook.State.Item as Truck}
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
				<div style="left: 0px; bottom: 0px;position: absolute;text-align: center; border-radius: 20px;font-weight: bold;background-color: white;height: 90px;width: 90%;margin: 5%;">
					<div>Reach this position.</div>
					<div style="position: relative;left: 0px; bottom: 0px;">
						<button className="btn btn-primary ">next</button>
					</div>
				</div>
			</Redirect>
		);
	}
}
