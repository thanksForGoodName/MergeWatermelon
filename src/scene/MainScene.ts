import ScoreController from "../component/ScoreController";
import { DESIGN_SCREEN_HEIGHT } from "../define/ConstDefine";
import { ui } from "../ui/layaMaxUI";
import Image = Laya.Image;
import { FRUITE_IMG_URL } from "../define/UIDefine";
import FruitesController from "../control/FruitesController";
import { EventDef } from "../define/EventDefine";
import PropsManager from "../manager/PropsManager";
import PropBoxController from "../component/PropBoxController";

export default class MainScene extends ui.scenes.MainSceneUI {
    onAwake(): void {
        this.screenAdapter();
        this.registEvent();
        PropsManager.instance(PropsManager).init();
    }

    registEvent() {
        Laya.stage.on(EventDef.ADD_SCORE, this, this.addScore);
        Laya.stage.on(EventDef.SET_NEXT_FUITE, this, this.setNextFruite);
        Laya.stage.on(EventDef.OVER_GAME, this, this.overGame);
        Laya.stage.on(EventDef.RESET_GAME, this, this.resetGame);

        (this.propBox.getComponent(PropBoxController) as PropBoxController).registePropsOutBox(this.touchArea);
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

        this.propBox.scale(scale, scale);
        this.propBox.y *= scale
        this.propBox.x = this.bg.width / 2;

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

    resetScore() {
        (this.scoreBox.getComponent(ScoreController) as ScoreController).resetScore();
    }

    resetNextFruite() {
        (this.nextImg as Image).skin = '';
        this.nextImg.visible = false;
    }

    resetFruiteController() {
        (this.contentBox.getComponent(FruitesController) as FruitesController).resetGame();
    }

    overGame() {
        (this.contentBox.getComponent(FruitesController) as FruitesController).overGame();
    }

    resetGame() {
        this.resetFruiteController();
        this.resetScore();
        this.resetNextFruite();
    }
}