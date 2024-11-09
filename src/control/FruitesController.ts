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
        this.regularAddFruite();
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
        const url = `${FRUITES_PRE_URL}${LEVEL_ARRAY[level]}.prefab`;
        Laya.loader.load(url, Handler.create(this, (prefab: Prefab) => {
            const fruit = prefab.create() as Image;
            this.box.addChild(fruit);
            if (needControl) {
                this.controllingObj = fruit.getComponent(FruitePhysicsComp) as FruitePhysicsComp;
                this.controllingObj.rigidbody.gravityScale = 0;
                this.registFruitesEvent();
            }
            if (pos) {
                fruit.pos(pos.x, pos.y);
                console.log('pos.x, pos.y', pos.x, pos.y);
            } else {
                fruit.x = this.bottleImg.x + (Math.random() * this.bottleImg.width);
                fruit.y = this.bottleImg.y - fruit.height
            }
        }), null, Loader.PREFAB)
    }

    registFruitesEvent() {
        this.touchArea.on(Laya.Event.MOUSE_DOWN, this, this.drawLine);
        this.touchArea.on(Laya.Event.MOUSE_MOVE, this, this.rightOrLeftMove);
        this.touchArea.on(Laya.Event.MOUSE_UP, this, this.stopRL);
    }

    drawLine() {
        const fromX = (this.controllingObj.owner as Image).width / 2;
        const fromY = (this.controllingObj.owner as Image).height;
        const toY = this.bottleImg.height;
        this.redLine = (this.controllingObj.owner as Image).graphics.drawLine(fromX, fromY, fromX, toY, '#ff0000', 2);
    }

    rightOrLeftMove() {
        if (this.controllingObj && this.inBottleArr.indexOf(this.controllingObj.owner) === -1) {
            (this.controllingObj.owner as Image).x = this.touchArea.mouseX;
        }
    }

    stopRL() {
        this.controllingObj.owner.offAllCaller(this);
        this.redLine.lineWidth = 0;
        this.controllingObj.rigidbody.gravityScale = 1;
        this.controllingObj.rigidbody.applyForce({ x: 0, y: 0 }, { x: 0, y: 10 });
        this.controllingObj = null;
        this.regularAddFruite();
    }

    markAsInBottle(fruit: Image) {
        this.inBottleArr.push(fruit);
    }
}