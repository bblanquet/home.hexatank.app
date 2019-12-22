import * as PIXI from 'pixi.js';
 
export class GroupsContainer{
    Groups:{[id:number]:PIXI.Container}
    private _fixedParent:PIXI.Container;
    private _parent:PIXI.Container;

    constructor(
        layout:{zs:Array<number>, parent:PIXI.Container},
        fixedLayout:{zs:Array<number>, parent:PIXI.Container})
    {
        this.Groups = {};
        this._parent = layout.parent;
        this._fixedParent = fixedLayout.parent;

        layout.zs.forEach(z =>{
            var group = new PIXI.Container();
            this._parent.addChild(group);
            this.Groups[z] = group;
        });

        fixedLayout.zs.forEach(z =>{
            var group = new PIXI.Container();
            this._fixedParent.addChild(group);
            this.Groups[z] = group;
        });
    }
}