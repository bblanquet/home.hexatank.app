import googleAnalytics from '@analytics/google-analytics';
import { Analytics } from 'analytics';
import { IAnalyzeService } from './IAnalyzeService';

export class AnalyzeService implements IAnalyzeService {
	private _analytics: any;
	constructor() {
		this._analytics = Analytics({
			app: 'kimchi studio',
			plugins: [
				googleAnalytics({
					trackingId: 'G-9KRF08871W'
				})
			]
		});
	}
	Analyze(message: string): void {
		this._analytics.page({ url: message });
	}
}
