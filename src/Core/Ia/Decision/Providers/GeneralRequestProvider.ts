import { GeneralSquadRequest } from './../RequestMaker/GeneralRequester/Requesters/GeneralSquadRequest';
import { GeneralTruckRequester } from './../RequestMaker/GeneralRequester/Requesters/GeneralTruckRequester';
import { GeneralEnergyRequester } from './../RequestMaker/GeneralRequester/Requesters/GeneralEnergyRequester';
import { GeneralHealingRequester } from './../RequestMaker/GeneralRequester/Requesters/GeneralHealingRequester';
import { IGeneralRequester } from '../RequestMaker/GeneralRequester/IGeneralRequester';
import { IGeneralRequetProvider } from './IGeneralRequestProvider';
export class GeneralRequestProvider implements IGeneralRequetProvider {
	Get(): IGeneralRequester[] {
		return [
			new GeneralTruckRequester(),
			new GeneralHealingRequester(),
			new GeneralEnergyRequester(),
			new GeneralSquadRequest()
		];
	}
}
