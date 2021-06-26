import * as luxon from 'luxon';
import { Env } from '../../../Env';
import { Dictionary } from '../Collections/Dictionary';
import { LiteEvent } from '../Events/LiteEvent';
import { LogKind } from './LogKind';
import { LogMessage } from './LogMessage';

export class StaticLogger {
	public static OnMessage: LiteEvent<LogMessage> = new LiteEvent<LogMessage>();
	private static _messages: LogMessage[] = [];
	private static Anonymous: string = 'anonymous';
	private static _excludes: string[] = [ 'Interac', StaticLogger.Anonymous, 'LatencyProvider' ];

	public static Colors: Dictionary<string> = Dictionary.New([
		{ key: LogKind[LogKind.none], value: '#000000' },
		{ key: LogKind[LogKind.info], value: '#36a6e3' },
		{ key: LogKind[LogKind.success], value: '#8fe336' },
		{ key: LogKind[LogKind.warning], value: '#e38736' },
		{ key: LogKind[LogKind.error], value: '#8c2323' },
		{ key: LogKind[LogKind.dangerous], value: '#d93232' }
	]);
	private static _style: Dictionary<string> = Dictionary.New([
		{ key: LogKind[LogKind.none], value: 'normal' },
		{ key: LogKind[LogKind.info], value: 'bold' },
		{ key: LogKind[LogKind.success], value: 'bold' },
		{ key: LogKind[LogKind.warning], value: 'bold' },
		{ key: LogKind[LogKind.error], value: 'bolder' },
		{ key: LogKind[LogKind.dangerous], value: 'bolder' }
	]);

	public static Icons: Dictionary<string> = Dictionary.New([
		{ key: LogKind[LogKind.none], value: 'fas fa-sticky-note' },
		{ key: LogKind[LogKind.info], value: 'fas fa-info-circle' },
		{ key: LogKind[LogKind.success], value: 'fa fa-check-circle' },
		{ key: LogKind[LogKind.warning], value: 'fas fa-exclamation-triangle' },
		{ key: LogKind[LogKind.dangerous], value: 'fas fa-radiation' },
		{ key: LogKind[LogKind.error], value: 'fas fa-times' }
	]);

	public static Log(logKind: LogKind, content: string) {
		if (!Env.IsPrd()) {
			const caller = this.CallerName();
			if (!this._excludes.some((exclude) => caller.includes(exclude))) {
				const message = new LogMessage(logKind, Date.now(), content);
				this._messages.push(message);
				console.log(
					`${this.Format(caller, message)}`,
					`color:${this.Colors.Get(LogKind[logKind])};font-weight:${this._style.Get(LogKind[logKind])};`
				);
				this.OnMessage.Invoke(this, message);
			}
		}
	}

	private static CallerName(): string {
		//cannot be used in PRD
		var sCallerName = '';
		{
			let re = /([^(]+)@|at ([^(]+) \(/g;
			const stack = new Error().stack.split('\n');
			const beforeLastCaller = new Error().stack.split('\n')[3];
			let aRegexResult = re.exec(beforeLastCaller);
			if (aRegexResult) {
				sCallerName = aRegexResult[1] || aRegexResult[2];
			} else {
				sCallerName = StaticLogger.Anonymous;
			}
		}
		return sCallerName;
	}

	private static Format(caller: string, message: LogMessage): string {
		return `[${luxon.DateTime
			.now()
			.toLocaleString(luxon.DateTime.TIME_WITH_SECONDS)}] [${caller}] %c${message.Content}`;
	}

	public static GetLogs(): LogMessage[] {
		return this._messages;
	}
}
