import { GameSettings } from './../../../../Framework/GameSettings';
export class BonusValueProvider {
	public GetPower(energy: number): number {
		if (energy === 0) {
			return 0;
		} else if (energy === 1) {
			return GameSettings.Attack;
		} else {
			return GameSettings.Attack + (energy - 1) * (GameSettings.Attack / 2);
		}
	}

	public GetPoison(energy: number): number {
		return this.GetPower(energy) / 6;
	}

	public GetFixValue(energy: number): number {
		return this.GetPower(energy) / 8;
	}

	public GetDiamondValue(energy: number): number {
		return this.GetPower(energy) * 0.5;
	}

	public GetSpeedTranslation(energy: number): number {
		return -energy * 250;
	}

	public GetSpeedRotation(energy: number): number {
		return -energy * 75;
	}
}
