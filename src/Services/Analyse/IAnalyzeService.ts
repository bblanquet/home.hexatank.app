export interface IAnalyzeService {
	Page(): void;
	Event(event: string, payload?: any): void;
}
