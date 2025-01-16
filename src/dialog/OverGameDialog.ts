import { EventDef } from "../define/EventDefine";
import { ui } from "../ui/layaMaxUI";

export default class OverGameDialog extends ui.dialogs.OverGameDialogUI {
    onAwake(): void {
        Laya.stage.event(EventDef.OVER_GAME)
        this.registBtnEvent();
    }

    registBtnEvent() {
        this.restartBtn.on(Laya.Event.CLICK, this, this.onClickRestartBtn);
    }

    onClickRestartBtn() {
        Laya.stage.event(EventDef.RESET_GAME);
        this.close();
    }
}