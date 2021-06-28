export class JetlagData {
	public Latency: number;
	public CalculationDate: number;
	//example Device A = > UTC +5H and Device B => UTC +3 so jetlag = 2H
	public Jetlag: number;
	public JetlagSign: boolean;
}
