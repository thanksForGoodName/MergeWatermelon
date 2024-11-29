import { FRUITE_SPEED, FRUITES_PRE_URL, LEVEL_ARRAY, LEVEL_MAP, POSSIBILITY_MAP } from "../define/ConstDefine";
import Script = Laya.Script;
import Prefab = Laya.Prefab;
import Handler = Laya.Handler;
import Image = Laya.Image;
import Sprite = Laya.Sprite;
import Loader = Laya.Loader;
import DrawLineCmd = Laya.DrawLineCmd;
import Box = Laya.Box;
import FruitePhysicsComp from "../component/FruitePhysicsComp";
import ResourceManager from "../manager/ResourceManager";
import Singleton from "../util/Single";

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

    public redLine: DrawLineCmd;

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
        Laya.stage.on('loadFruite', this, this.loadFruite);
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
                    this.loadFruite(level);
                    break;
                }
            }
        })

    }

    loadFruite(level: number, pos?: { x: number, y: number }, needControl = true) {
        const fruitePre = Singleton.instance(ResourceManager).prefabsMap.get(LEVEL_ARRAY[level])
        const fruit = fruitePre.create() as Image;
        this.box.addChild(fruit);
        if (needControl) {
            this.controllingObj = fruit.getComponent(FruitePhysicsComp) as FruitePhysicsComp;
            this.controllingObj.rigidbody.gravityScale = 0;
            this.registFruitesEvent();
        }
        if (pos) {
            fruit.pos(pos.x, pos.y);
        } else {
            fruit.x = this.bottleImg.x + (Math.random() * this.bottleImg.width);
            fruit.y = this.bottleImg.y - fruit.height
        }
    }

    registFruitesEvent() {
        this.touchArea.on(Laya.Event.MOUSE_DOWN, this, this.drawLine);
        this.touchArea.on(Laya.Event.MOUSE_MOVE, this, this.rightOrLeftMove);
        this.touchArea.on(Laya.Event.MOUSE_UP, this, this.stopRL);
        this.touchArea.on(Laya.Event.MOUSE_OUT, this, this.stopRL);
    }

    drawLine() {
        if (this.controllingObj && this.inBottleArr.indexOf(this.controllingObj.owner) === -1) {
            const fromX = (this.controllingObj.owner as Image).width / 2;
            const fromY = (this.controllingObj.owner as Image).height;
            const toY = this.bottleImg.height;
            this.redLine = (this.controllingObj.owner as Image).graphics.drawLine(fromX, fromY, fromX, toY, '#ff0000', 2);
        }
    }

    rightOrLeftMove() {
        if (this.controllingObj && this.inBottleArr.indexOf(this.controllingObj.owner) === -1) {
            (this.controllingObj.owner as Image).x = this.touchArea.mouseX;
            if (!this.redLine) {
                this.drawLine();
            }
        }
    }

    stopRL() {
        if (this.controllingObj && this.inBottleArr.indexOf(this.controllingObj.owner) === -1) {
            this.controllingObj.owner.offAllCaller(this);
            if (this.redLine) {
                this.redLine.lineWidth = 0;
                this.redLine = null;
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