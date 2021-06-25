import { LogKind } from './LogKind';

export class LogMessage {
	public Author: string;
	constructor(public Kind: LogKind, public Date: number, public Content: string) {}
	public static New(kind: LogKind, date: number, content: string, author: string): LogMessage {
		const result = new LogMessage(kind, date, content);
		result.Author = author;
		return result;
	}
}
