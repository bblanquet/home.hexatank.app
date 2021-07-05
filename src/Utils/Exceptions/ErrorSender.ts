import axios from 'axios';
import { ErrorDetail } from '../../Components/Model/ErrorDetail';
import { SingletonKey, Singletons } from '../../Singletons';
import { IRecordService } from '../../Services/Record/IRecordService';

export class ErrorSender {
	public Send(name: string, stacktrace: string): void {
		const payload = new ErrorDetail();
		payload.date = new Date();
		payload.name = name;
		payload.stacktrace = stacktrace;
		const recordService = Singletons.Load<IRecordService>(SingletonKey.Record);
		payload.content = JSON.stringify(recordService.Publish());
		axios.post('{{p2p_url}}/server/exception/Add', payload);
	}
}
