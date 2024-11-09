import { DESIGN_SCREEN_HEIGHT, DESIGN_SCREEN_WIDTH } from "../define/ConstDefine";
import { ui } from "../ui/layaMaxUI";

export default class MainScene extends ui.scenes.MainSceneUI {
    onAwake(): void {
        this.screenAdapter();
        this.deadline.zOrder = Number.MAX_SAFE_INTEGER;
    }

    /**
     * 屏幕适配
     */
    screenAdapter() {
        const scaleX = Laya.stage.height / DESIGN_SCREEN_HEIGHT >= 1 ? 1 : Laya.stage.height / DESIGN_SCREEN_HEIGHT;

        this.bg.width = Laya.stage.width;
        this.bg.height = Laya.stage.height;

        this.contentBox.scale(scaleX, scaleX);
        this.contentBox.y *= scaleX
        this.contentBox.x = this.bg.width / 2;
    }


}