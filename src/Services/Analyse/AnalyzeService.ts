import googleAnalytics from '@analytics/google-analytics';
import { Analytics, AnalyticsInstance } from 'analytics';
import { IAnalyzeService } from './IAnalyzeService';

export class AnalyzeService implements IAnalyzeService {
	private _analytics: AnalyticsInstance;
	constructor() {
		this._analytics = Analytics({
			app: 'kimchi studio',
			plugins: [
				googleAnalytics({
					trackingId: 'UA-198570575-1'
				})
			]
		});
	}
	Analyze(message: string): void {
		this._analytics.track(message);
		this._analytics.page();
	}
}
