import * as luxon from 'luxon';
import { Env } from '../../../Env';
import { Dictionnary } from '../Collections/Dictionnary';
import { LogKind } from './LogKind';

export class StaticLogger {
	private static _messages: string[] = [];
	private static Anonymous: string = 'anonymous';
	private static _excludes: string[] = [ 'Interac', StaticLogger.Anonymous ];

	private static _colors: Dictionnary<string> = Dictionnary.New([
		{ key: LogKind[LogKind.none], value: '#000000' },
		{ key: LogKind[LogKind.info], value: '#36a6e3' },
		{ key: LogKind[LogKind.success], value: '#8fe336' },
		{ key: LogKind[LogKind.warning], value: '#e38736' },
		{ key: LogKind[LogKind.error], value: '#8c2323' },
		{ key: LogKind[LogKind.dangerous], value: '#d93232' }
	]);
	private static _style: Dictionnary<string> = Dictionnary.New([
		{ key: LogKind[LogKind.none], value: 'normal' },
		{ key: LogKind[LogKind.info], value: 'bold' },
		{ key: LogKind[LogKind.success], value: 'bold' },
		{ key: LogKind[LogKind.warning], value: 'bold' },
		{ key: LogKind[LogKind.error], value: 'bolder' },
		{ key: LogKind[LogKind.dangerous], value: 'bolder' }
	]);

	public static Log(logKind: LogKind, message: string) {
		if (!Env.IsPrd()) {
			const caller = this.CallerName();
			if (!this._excludes.some((exclude) => caller.includes(exclude))) {
				let content = message;
				content = this.AddStyle(content);
				content = this.AddCaller(caller, content);
				content = this.AddTime(content);
				this._messages.push(content);
				console.log(
					`${content}`,
					`color:${this._colors.Get(LogKind[logKind])};font-weight:${this._style.Get(LogKind[logKind])};`
				);
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

	private static AddCaller(caller: string, content: string) {
		return `[${caller}] ${content}`;
	}

	private static AddTime(message: string): string {
		return `[${luxon.DateTime.now().toLocaleString(luxon.DateTime.TIME_WITH_SECONDS)}] ${message}`;
	}

	private static AddStyle(message: string): string {
		return `%c${message}`;
	}

	public static GetLogs(): string[] {
		return this._messages;
	}
}
