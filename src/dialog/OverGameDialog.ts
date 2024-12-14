import { ui } from "../ui/layaMaxUI";

export default class OverGameDialog extends ui.dialogs.OverGameDialogUI {
    onAwake(): void {
        Laya.stage.event('overGame')
        this.registBtnEvent();
    }

    registBtnEvent() {
        this.restartBtn.on(Laya.Event.CLICK, this, this.onClickRestartBtn);
    }

    onClickRestartBtn() {
        Laya.stage.event('resetGame');
        this.close();
    }
}