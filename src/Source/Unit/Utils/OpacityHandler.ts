import { MovingState } from "./MovingState";

export class OpacityHandler{

    private static GetCases():any{
        return {
            [MovingState.FromBlackToWhite]:this.BlackToWhiteHandler,
            [MovingState.FromBlackToBlack]:this.BlackToBlackHandler,
            [MovingState.FromWhiteToWhite]:this.WhiteToWhiteHandler,
            [MovingState.FromWhiteToBlack]:this.WhiteToBlackHandler
        }
    }

    private static BlackToWhiteHandler(translationPercentage:number):number{
        if(translationPercentage > 0.5){
            return 1;
        }
        else
        {
            translationPercentage *=2;
            return translationPercentage > 1 ? 1 : translationPercentage;
        }
    } 

    private static BlackToBlackHandler(translationPercentage:number):number{
        return 0;
    } 

    private static WhiteToWhiteHandler(translationPercentage:number):number{
        return 1;
    } 

    private static WhiteToBlackHandler(translationPercentage:number):number{
        if(translationPercentage >= 1){
            return 0;
        }
        else if(translationPercentage >= 0.5)
        {
            translationPercentage = (translationPercentage - 0.5) * 2;
            return translationPercentage < 0 ? 0 : translationPercentage;
        }
        else
        {
            return 1;
        }
    } 

    public static GetOpacity(translationPercentage:number, state:MovingState):number{
        const cases =  this.GetCases();
        
        if(cases[state])
        {
            let handler = cases[state];
            return handler(translationPercentage);
        }

        throw 'not possible';
    }


    public static GetMovingState(isCCVisible:boolean, isNCVisible:boolean):MovingState{
        if(isCCVisible && isNCVisible){
            return MovingState.FromWhiteToWhite;
        }
        if(!isCCVisible && !isNCVisible){
            return MovingState.FromBlackToBlack;
        }
        if(!isCCVisible && isNCVisible){
            return MovingState.FromBlackToWhite;
        }
        if(isCCVisible && !isNCVisible){
            return MovingState.FromWhiteToBlack;
        }
        throw 'not possible';
    }
}