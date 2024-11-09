/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import MainScene from "./scene/MainScene"
import BottlePhysicsComp from "./component/BottlePhysicsComp"
import DeadlinePhysicsComp from "./component/DeadlinePhysicsComp"
import FruitesController from "./control/FruitesController"
import FruitePhysicsComp from "./component/FruitePhysicsComp"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=640;
    static height:number=1136;
    static scaleMode:string="fixedwidth";
    static screenMode:string="vertical";
    static alignV:string="top";
    static alignH:string="left";
    static startScene:any="scenes/MainScene.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("scene/MainScene.ts",MainScene);
        reg("component/BottlePhysicsComp.ts",BottlePhysicsComp);
        reg("component/DeadlinePhysicsComp.ts",DeadlinePhysicsComp);
        reg("control/FruitesController.ts",FruitesController);
        reg("component/FruitePhysicsComp.ts",FruitePhysicsComp);
    }
}
GameConfig.init();