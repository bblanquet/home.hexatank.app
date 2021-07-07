import axios from 'axios';
import { ErrorDetail } from '../../Components/Model/ErrorDetail';
import { SingletonKey, Singletons } from '../../Singletons';
import { IAppService } from '../../Services/App/IAppService';
import { IBlueprint } from '../../Core/Framework/Blueprint/IBlueprint';
import { IKeyService } from '../../Services/Key/IKeyService';

export class ErrorSender {
	public Send(name: string, stacktrace: string): void {
		const payload = new ErrorDetail();
		payload.date = new Date();
		payload.name = name;
		payload.stacktrace = stacktrace;
		const appKey = Singletons.Load<IKeyService>(SingletonKey.Key).GetAppKey();
		const record = Singletons.Load<IAppService<IBlueprint>>(appKey).GetRecord();
		payload.content = record ? JSON.stringify(record.GetRecord()) : '';
		axios.post('{{error_url}}/server/Exception/Add', payload);
	}
}
