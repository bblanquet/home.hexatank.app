import { GameSettings } from '../../../../Framework/GameSettings';
export class UpCalculator {
	public GetAttack(energy: number): number {
		if (energy === 0) {
			return 0;
		} else if (energy === 1) {
			return GameSettings.Fire;
		} else {
			return GameSettings.Fire + (energy - 1) * (GameSettings.Fire / 2);
		}
	}

	public GetPoison(energy: number): number {
		return this.GetAttack(energy) / 6;
	}

	public GetHeal(energy: number): number {
		return this.GetAttack(energy) / 8;
	}

	public GetDiamondValue(energy: number): number {
		return this.GetAttack(energy) * 0.5;
	}

	public GetSpeedTranslation(energy: number): number {
		return -energy * 250;
	}

	public GetSpeedRotation(energy: number): number {
		return -energy * 75;
	}
}
