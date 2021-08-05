import { DiamondBlueprint } from '../../Core/Framework/Blueprint/Diamond/DiamondBlueprint';
import { Diamondworld } from '../../Core/Framework/World/Diamondworld';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';
import { AbstractGameHook } from './AbstractGameHook';

export class DiamondHook extends AbstractGameHook<DiamondBlueprint, Diamondworld> {
	GetGoalDiamond(): number {
		return this.Gameworld.GetDiamond();
	}
	public GetDuration(): number {
		return this.Gameworld.Duration;
	}

	public OnTimerDone(): SimpleEvent {
		return this.Gameworld.OnTimerDone;
	}
}
