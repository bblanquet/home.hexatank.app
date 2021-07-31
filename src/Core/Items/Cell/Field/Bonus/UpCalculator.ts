import { GameSettings } from '../../../../Framework/GameSettings';
export class UpCalculator {
	public GetAttack(energy: number): number {
		if (energy === 0) {
			return 0;
		} else if (energy === 1) {
			return GameSettings.Fire;
		} else {
			return energy * (GameSettings.Fire - 1) / 2 + GameSettings.Fire;
		}
	}

	public GetPoison(energy: number): number {
		return this.GetAttack(energy) / 6;
	}

	public GetHeal(energy: number): number {
		return this.GetAttack(energy) / 8;
	}

	public GetDiamondValue(energy: number): number {
		return energy * 0.5;
	}

	public GetTranslationUp(energy: number): number {
		return -energy * 350;
	}

	public GetRotationUp(energy: number): number {
		return -energy * 75;
	}
}
