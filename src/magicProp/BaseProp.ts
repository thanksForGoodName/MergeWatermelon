import { PropsName } from "../define/PropsDef";
import Image = Laya.Image;
import Label = Laya.Label;
import Sprite = Laya.Sprite;
import { PROP_IMG_URL } from "../define/UIDefine";
import PropsManager from "../manager/PropsManager";
import { EventDef } from "../define/EventDefine";

export default class BaseProp {
    //道具的UI节点
    protected static UINode: Image;
    protected static propNums: number;
    protected static numberIcon: Label;
    public propName: PropsName;

    constructor(propName: PropsName) {
        this.propName = propName;
        this.createProp();
    }


    /**
     * 获得道具的UI节点
     */
    getUINode(): Image {
        return BaseProp.UINode;
    }

    setUINode(uiNode: Image) {
        BaseProp.UINode = uiNode;
    }

    /**
     * 获得道具数量UI
     */
    getUINumber(): Label {
        return BaseProp.numberIcon;
    }

    /**
     * 设置道具数量UI
     */
    setUINumber(num: number) {
        if (num === 0) {
            return;
        } else {
            if (!BaseProp.numberIcon) {
                BaseProp.numberIcon = new Label(`${num}`);
                this.getUINode().addChild(this.getUINumber());

                this.getUINumber().fontSize = 40;
                this.getUINumber().right = 0;
                this.getUINumber().top = 0;
            }

            this.getUINode().visible = true;
            this.getUINumber().text = `${num}`;
        }
    }

    /**
     * 展示道具的UI
     * @param parent 
     */
    showUINode(num: number) {
        //如果还有道具，展示
        if (PropsManager.instance(PropsManager).getAllPropNum(this.propName)) {
            if (!this.getUINode()) {
                const url = `${PROP_IMG_URL}${this.propName}.png`;
                const uiNode = new Image(url);
                uiNode.name = `${this.propName}`;
                this.setUINode(uiNode);
            }
            this.setUINumber(num);
            Laya.stage.event(EventDef.REFRESH_PROP_BOX_UI, [this.getUINode()]);
        } else {
            if (this.getUINode()) {
                this.getUINode().removeSelf();
                this.setUINode(null);
            }
        }
    }


    createProp() {
    }

    useProp() {
    }

}