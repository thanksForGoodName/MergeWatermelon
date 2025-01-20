import { EventDef } from "../define/EventDefine";
import Box = Laya.Box;
import Image = Laya.Image;
import Sprite = Laya.Sprite;
import { propIconSize } from "../define/UIDefine";
import PropsManager from "../manager/PropsManager";
export default class PropBoxController extends Laya.Script {
    public propBox: Box;
    public spaceArr: Box[];
    public isMouseDown = false;
    public isOutBox = false;

    public touchingImg: Image;

    onAwake(): void {
        this.propBox = this.owner as Box;
        this.registEvent();
        this.refreshRegister();
    }

    registEvent() {
        this.propBox.on(Laya.Event.MOUSE_MOVE, this, () => {
            this.isOutBox = false
            //console.log('isOutBoxfalse');
        })
        Laya.stage.on(EventDef.REFRESH_PROP_BOX_UI, this, this.refreshPropsBar);

        for (let i = 0; i < this.propBox.numChildren; i++) {
            if (this.propBox.getChildAt(i).name.split('_')[0] === 'space') {
                const spaceBox = this.propBox.getChildAt(i) as Box;
                if (!this.spaceArr) {
                    this.spaceArr = [];
                }
                this.spaceArr.push(spaceBox);
            }
        }
    }

    refreshRegister() {
        for (let i = 0; i < this.spaceArr.length; i++) {
            const spaceBox = this.spaceArr[i];
            if (spaceBox.numChildren !== 0) {
                const prop = spaceBox.getChildAt(0) as Image;
                prop.offAllCaller(this);
                prop.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDownProp, [i]);
            }
        }
    }

    /**
     * 获得道具栏
     */
    refreshPropsBar(propIcon: Image) {
        if (!propIcon.parent) {
            const space = this.getPropSpace();
            if (!space) {
                console.log('道具已满，请及时处理');
            } else {
                space.addChild(propIcon);
                propIcon.width = propIconSize[propIcon.name].width;
                propIcon.height = propIconSize[propIcon.name].height;
                propIcon.centerX = 0;
                propIcon.centerY = 0;
            }

            this.refreshRegister();
        }
    }

    getPropSpace() {
        if (!this.spaceArr) {
            return null;
        }
        for (let i = 0; i < this.spaceArr.length; i++) {
            const spaceBox = this.spaceArr[i];
            if (spaceBox.numChildren === 0) {
                return spaceBox;
            }
        }
        return null;
    }

    /**
     * 触碰道具
     */
    onMouseDownProp(index: number) {
        this.isMouseDown = true;
        const propIcon = ((this.spaceArr[index] as Box).getChildAt(0) as Image);
        if (propIcon) {
            PropsManager.instance(PropsManager).chooseProp(propIcon.name);
            if (PropsManager.instance(PropsManager).getLeftPropNum(propIcon.name) === 0) {
                propIcon.visible = false;
            }
            this.touchingImg = new Image(propIcon.skin);
            this.touchingImg.width = propIconSize[propIcon.name].width;
            this.touchingImg.height = propIconSize[propIcon.name].height;
            this.touchingImg.pivot(this.touchingImg.width / 2, this.touchingImg.height / 2);

            this.touchingImg.x = (this.spaceArr[index] as Box).mouseX;
            this.touchingImg.y = (this.spaceArr[index] as Box).mouseY;


            Laya.stage.addChild(this.touchingImg);
            this.touchingImg.x = Laya.stage.mouseX;
            this.touchingImg.y = Laya.stage.mouseY;

            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUpProp, [index]);
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMoveProp, [index]);
        }
    }

    registePropsOutBox(bottleArea: Sprite) {
        bottleArea.on(Laya.Event.MOUSE_MOVE, this, () => {
            this.isOutBox = true
            //console.log('isOutBoxtrue');
        })
    }


    /**
     * 当手指从道具上抬起
     * @param index 
     */
    onMouseUpProp(index: number): void {
        if (!this.isMouseDown) {
            return;
        }

        this.isMouseDown = false;
        const propIcon = ((this.spaceArr[index] as Box).getChildAt(0) as Image);
        if (!this.isOutBox) {
            if (propIcon) {
                propIcon.visible = true;
                PropsManager.instance(PropsManager).unchooseProp(propIcon.name);
            }
        } else {
            console.log('使用道具');
            const pos = { x: this.touchingImg.x, y: this.touchingImg.y }
            PropsManager.instance(PropsManager).useProp(propIcon.name, pos);
        }
        if (this.touchingImg) {
            this.touchingImg.removeSelf();
            this.touchingImg.offAllCaller(this);
            this.touchingImg = null;
        }
    }

    onMouseMoveProp(index: number): void {
        if (!this.isMouseDown) return;
        const propIcon = ((this.spaceArr[index] as Box).getChildAt(0) as Image);
        if (propIcon) {
            if (this.touchingImg) {
                this.touchingImg.x = Laya.stage.mouseX;
                this.touchingImg.y = Laya.stage.mouseY;
            }
        }
    }

}