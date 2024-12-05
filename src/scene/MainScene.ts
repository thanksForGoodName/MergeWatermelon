import ScoreController from "../component/ScoreController";
import { DESIGN_SCREEN_HEIGHT, FRUITE_IMG_URL } from "../define/ConstDefine";
import ResourceManager from "../manager/ResourceManager";
import { ui } from "../ui/layaMaxUI";
import Image = Laya.Image;

export default class MainScene extends ui.scenes.MainSceneUI {
    onAwake(): void {
        this.screenAdapter();
        this.registEvent();
        this.deadline.zOrder = Number.MAX_SAFE_INTEGER;
        ResourceManager.instance(ResourceManager).loadAnimations()
    }

    registEvent() {
        Laya.stage.on('addScore', this, this.addScore);
        Laya.stage.on('setNextFruite', this, this.setNextFruite);
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

        this.toolBox.scale(scale, scale);
        this.toolBox.y *= scale
        this.toolBox.x = this.bg.width / 2;

        this.topBox.scale(scale, scale);
        this.topBox.x *= scale;
        this.topBox.y *= scale;
    }


    addScore(num: number) {
        (this.scoreBox.getComponent(ScoreController) as ScoreController).setTextImg(num);
    }

    setNextFruite(level: number) {
        const skinUrl = `${FRUITE_IMG_URL}${level + 1}.png`;
        (this.nextImg as Image).skin = skinUrl;
        this.nextImg.visible = true;
    }
}