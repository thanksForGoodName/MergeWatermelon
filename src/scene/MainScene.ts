import ScoreController from "../component/ScoreController";
import { DESIGN_SCREEN_HEIGHT, DESIGN_SCREEN_WIDTH } from "../define/ConstDefine";
import { ui } from "../ui/layaMaxUI";

export default class MainScene extends ui.scenes.MainSceneUI {
    onAwake(): void {
        this.screenAdapter();
        this.registEvent();
        this.deadline.zOrder = Number.MAX_SAFE_INTEGER;
    }

    registEvent() {
        Laya.stage.on('addScore', this, this.addScore);
    }

    /**
     * 屏幕适配
     */
    screenAdapter() {
        const scale = Laya.stage.height / DESIGN_SCREEN_HEIGHT >= 1 ? 1 : Laya.stage.height / DESIGN_SCREEN_HEIGHT;

        this.bg.width = Laya.stage.width;
        this.bg.height = Laya.stage.height;

        this.contentBox.scale(scale, scale);
        this.contentBox.y *= scale
        this.contentBox.x = this.bg.width / 2;

        this.crown.scale(scale, scale);
        this.crown.y *= scale;
    }


    addScore(num: number) {
        (this.scoreBox.getComponent(ScoreController) as ScoreController).setTextImg(num);
    }
}