import { HealUp } from './../../Items/Unit/PowerUp/HealUp';
import { TimeUpCondition } from './../../Items/Unit/PowerUp/Condition/TimeUpCondition';
import { AttackUp } from '../../Items/Unit/PowerUp/AttackUp';
import { Tank } from '../../Items/Unit/Tank';
import { SpeedUp } from '../../Items/Unit/PowerUp/SpeedUp';
import { HealMenuItem } from '../../Menu/Buttons/HealMenuItem';
import { AttackMenuItem } from '../../Menu/Buttons/AttackMenuItem';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { CombinationContext } from './CombinationContext';
import { Reactor } from '../../Items/Cell/Field/Bonus/Reactor';
import { SpeedFieldMenuItem } from '../../Menu/Buttons/SpeedFieldMenuItem';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { InteractionMode } from '../InteractionMode';
import { Item } from '../../Items/Item';
import { ISelectable } from '../../ISelectable';

export class OverlockCombination extends AbstractSingleCombination {
	constructor() {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			context.Items[0] instanceof Reactor &&
			(context.Items[0] as Reactor).HasPower() &&
			(context.Items[1] instanceof AttackMenuItem ||
				context.Items[1] instanceof HealMenuItem ||
				context.Items[1] instanceof SpeedFieldMenuItem)
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let vehicles = new Array<Vehicle>();
			const reactor = context.Items[0] as Reactor;
			reactor.GetAllCells().forEach((c) => {
				if (c.HasOccupier()) {
					const vehicle = c.GetOccupier() as Vehicle;
					if (!vehicle.IsEnemy(reactor.Hq)) {
						vehicles.push(vehicle);
					}
				}
			});

			reactor.StartOverclockAnimation();
			reactor.SetLocked(true);
			if (context.Items[1] instanceof AttackMenuItem) {
				vehicles.forEach((v) => {
					if (v instanceof Tank) {
						const sum = reactor.GetPower() * 0.1 + 2;
						v.SetPowerUp(new AttackUp(v, new TimeUpCondition(), sum));
					}
				});
			} else if (context.Items[1] instanceof HealMenuItem) {
				vehicles.forEach((v) => {
					const sum = reactor.GetPower() * 0.1 + 0.01;
					v.SetPowerUp(new HealUp(v, new TimeUpCondition(), sum));
				});
			} else if (context.Items[1] instanceof SpeedFieldMenuItem) {
				vehicles.forEach((v) => {
					const sum = reactor.GetPower() * 0.1 + 2;
					v.SetPowerUp(new SpeedUp(v, new TimeUpCondition(), sum, sum));
				});
			}
			this.UnSelectItem(context.Items[0]);
			this.OnClearContext.Invoke();
			this.OnChangedMode.Invoke(this, InteractionMode.SingleSelection);
			return true;
		}
		return false;
	}

	private UnSelectItem(item: Item) {
		var selectable = <ISelectable>(<any>item);
		selectable.SetSelected(false);
	}
}
