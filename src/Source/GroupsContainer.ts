import * as PIXI from 'pixi.js';

export class GroupsContainer{
    Groups:{[id:number]:PIXI.Container}
    private _parent:PIXI.Container;

    constructor(zs:Array<number>, parent:PIXI.Container)
    {
        this._parent = parent;
        this.Groups = {};
        zs.forEach(z =>{
            var group = new PIXI.Container();
            this._parent.addChild(group);
            this.Groups[z] = group;
        });
    }
}