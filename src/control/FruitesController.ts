import { FRUITE_SPEED, FRUITES_PRE_URL, LEVEL_ARRAY, LEVEL_MAP, POSSIBILITY_MAP } from "../define/ConstDefine";
import Script = Laya.Script;
import Image = Laya.Image;
import Sprite = Laya.Sprite;
import Box = Laya.Box;
import FruitePhysicsComp from "../component/FruitePhysicsComp";
import ResourceManager from "../manager/ResourceManager";
import Singleton from "../util/Single";
import DrawLineCmd = Laya.DrawLineCmd;

/**
 * 水果掉落控制器
 */
export default class FruitesController extends Script {
    private box: Box;
    private touchArea: Sprite
    private controllingObj: FruitePhysicsComp;

    public bottleImg: Image;
    public rightArrow: Image;
    public leftArrow: Image;
    public guideLine: Sprite = new Sprite();
    public isMouseDown: boolean;

    private inBottleArr = [];


    onAwake(): void {
        this.box = this.owner as Box;
        this.touchArea = this.box.getChildByName('touchArea') as Sprite;
        this.bottleImg = this.box.getChildByName('bottleImg') as Image;
        this.registerEvent();
        Singleton.instance(ResourceManager).loadFruitesPre(() => {
            this.regularAddFruite();
        });
    }

    registerEvent() {
        Laya.stage.on('createFruite', this, this.createFruite);
        Laya.stage.on('markAsInBottle', this, this.markAsInBottle);
    }

    regularAddFruite() {
        Laya.timer.once(1000, this, () => {
            const rate = Math.random();
            let sum = 0;
            for (let fruite in POSSIBILITY_MAP) {
                sum += POSSIBILITY_MAP[fruite]
                if (rate <= sum) {
                    const level = LEVEL_MAP[fruite];
                    this.createFruite(level);
                    break;
                }
            }
        })

    }

    createFruite(level: number, pos?: { x: number, y: number }, needControl = true) {
        const fruitePre = Singleton.instance(ResourceManager).prefabsMap.get(LEVEL_ARRAY[level])
        const fruit = fruitePre.create() as Image;
        this.box.addChild(fruit);
        if (pos) {
            fruit.pos(pos.x, pos.y);
        } else {
            fruit.x = this.bottleImg.x + (Math.random() * this.bottleImg.width);
            fruit.y = this.bottleImg.y - fruit.height
        }
        if (needControl) {
            this.controllingObj = fruit.getComponent(FruitePhysicsComp) as FruitePhysicsComp;
            this.controllingObj.rigidbody.gravityScale = 0;
            this.registFruitesEvent();
        }

        if (this.isMouseDown) {
            this.drawGuideLine();
        }
    }

    registFruitesEvent() {
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onAreaMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onAreaMouseMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onAreaMouseUp);
        Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.onAreaMouseUp);
    }

    onAreaMouseDown(): void {
        this.isMouseDown = true;
        this.drawGuideLine();
    }

    drawGuideLine() {
        if (this.controllingObj && this.inBottleArr.indexOf(this.controllingObj.owner) === -1) {
            const posX = (this.controllingObj.owner as Image).width / 2;
            const posY = (this.controllingObj.owner as Image).height;
            const toY = this.bottleImg.height;
            if (this.guideLine) {
                this.guideLine.removeSelf();
                this.guideLine.graphics.clear();
            }
            this.guideLine.graphics.drawLine(0, 0, 0, toY, '#ff0000', 2);
            (this.controllingObj.owner as Image).addChild(this.guideLine);
            this.guideLine.pos(posX, posY);
        }
    }

    onAreaMouseMove() {
        if (this.controllingObj && this.inBottleArr.indexOf(this.controllingObj.owner) === -1) {
            (this.controllingObj.owner as Image).x = this.touchArea.mouseX;
        }
    }

    onAreaMouseUp() {
        this.isMouseDown = false;
        if (this.controllingObj && this.inBottleArr.indexOf(this.controllingObj.owner) === -1) {
            this.controllingObj.owner.offAllCaller(this);
            if (this.guideLine) {
                this.guideLine.removeSelf();
                this.guideLine.graphics.clear();
            }
            this.controllingObj.rigidbody.gravityScale = LEVEL_MAP[this.controllingObj.collider.label] + 1;
            this.controllingObj.rigidbody.applyForce({ x: 0, y: 0 }, { x: 0, y: 10 });
            this.controllingObj = null;
            this.regularAddFruite();
        }
    }

    markAsInBottle(fruit: Image) {
        this.inBottleArr.push(fruit);
    }
}