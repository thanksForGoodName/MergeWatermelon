/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import View=Laya.View;
import Dialog=Laya.Dialog;
import Scene=Laya.Scene;
var REG: Function = Laya.ClassUtils.regClass;
export module ui.scenes {
    export class MainSceneUI extends Scene {
		public bg:Laya.Sprite;
		public contentBox:Laya.Box;
		public bottleImg:Laya.Image;
		public deadline:Laya.Sprite;
		public crown:Laya.Sprite;
		public scoreBox:Laya.Box;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("scenes/MainScene");
        }
    }
    REG("ui.scenes.MainSceneUI",MainSceneUI);
}