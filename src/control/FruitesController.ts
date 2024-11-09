import { FRUITE_SPEED, FRUITES_PRE_URL, LEVEL_ARRAY, LEVEL_MAP, POSSIBILITY_MAP } from "../define/ConstDefine";
import Script = Laya.Script;
import Prefab = Laya.Prefab;
import Handler = Laya.Handler;
import Image = Laya.Image;
import Loader = Laya.Loader;
import Box = Laya.Box;
import FruitePhysicsComp from "../component/FruitePhysicsComp";


export default class FruitesController extends Script {
    private box: Box;
    private controllingObj: FruitePhysicsComp;

    public bottleImg: Image;
    public rightArrow: Image;
    public leftArrow: Image;

    private inBottleArr = [];


    onAwake(): void {
        this.box = this.owner as Box;
        this.leftArrow = this.box.getChildByName('leftArrow') as Image;
        this.rightArrow = this.box.getChildByName('rightArrow') as Image;
        this.bottleImg = this.box.getChildByName('bottleImg') as Image;
        this.registerEvent();
        this.addFruites();
    }

    registerEvent() {
        Laya.stage.on('loadFruite', this, this.loadFruite);
        Laya.stage.on('markAsInBottle', this, this.markAsInBottle)
    }

    addFruites() {
        Laya.timer.loop(2000, this, this.regularAddFruite)
    }

    regularAddFruite() {
        this.offControllingObj();
        if (!this.controllingObj) {
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
        }
    }

    loadFruite(level: number, pos?: { x: number, y: number }, needControl = true) {
        const url = `${FRUITES_PRE_URL}${LEVEL_ARRAY[level]}.prefab`;
        Laya.loader.load(url, Handler.create(this, (prefab: Prefab) => {
            const fruit = prefab.create() as Image;
            this.box.addChild(fruit);
            if (pos) {
                fruit.pos(pos.x, pos.y);
            } else {
                fruit.x = this.bottleImg.x + (Math.random() * this.bottleImg.width);
            }
            if (needControl) {
                this.controllingObj = fruit.getComponent(FruitePhysicsComp) as FruitePhysicsComp;
                this.registerArrowEvent();
            }
        }), null, Loader.PREFAB)
    }

    registerArrowEvent() {
        this.leftArrow.offAll();
        this.rightArrow.offAll();
        this.leftArrow.on(Laya.Event.MOUSE_DOWN, this, this.leftMove);
        this.rightArrow.on(Laya.Event.MOUSE_DOWN, this, this.rightMove);

        this.leftArrow.on(Laya.Event.MOUSE_UP, this, this.stopMove);
        this.rightArrow.on(Laya.Event.MOUSE_UP, this, this.stopMove);
    }

    leftMove() {
        if (this.controllingObj && this.inBottleArr.indexOf(this.controllingObj.owner) === -1) {
            this.controllingObj.rigidbody.setVelocity({ x: -FRUITE_SPEED, y: 0 });
        }
    }

    rightMove() {
        if (this.controllingObj && this.inBottleArr.indexOf(this.controllingObj.owner) === -1) {
            this.controllingObj.rigidbody.setVelocity({ x: FRUITE_SPEED, y: 0 });
        }
    }

    stopMove() {
        if (this.controllingObj && this.inBottleArr.indexOf(this.controllingObj.owner) === -1) {
            this.controllingObj.rigidbody.setVelocity({ x: 0, y: FRUITE_SPEED });
        }
    }

    offControllingObj() {
        if (this.controllingObj) {
            this.controllingObj.rigidbody.setVelocity({ x: 0, y: FRUITE_SPEED });
            this.controllingObj = null;
        }
    }

    markAsInBottle(fruit: Image) {
        this.inBottleArr.push(fruit);
    }
}