import { LEVEL_ARRAY, LEVEL_MAP, POSSIBILITY_MAP, zOdersEnum } from "../define/ConstDefine";
import Script = Laya.Script;
import Image = Laya.Image;
import Sprite = Laya.Sprite;
import Box = Laya.Box;
import FruitePhysicsComp from "../component/FruitePhysicsComp";
import ResourceManager from "../manager/ResourceManager";
import { AniNames, UrlResDef } from "../define/UIDefine";

/**
 * 水果掉落控制器
 */
export default class FruitesController extends Script {
    private box: Box;
    private touchArea: Sprite
    private controllingObj: FruitePhysicsComp;

    public bottleImg: Image;
    public guideLine: Image;
    public isMouseDown = false;
    public nextFruiteLevel: number = null;

    private inBottleArr = [];
    private canCreate = true;


    onAwake() {
        this.box = this.owner as Box;
        this.touchArea = this.box.getChildByName('touchArea') as Sprite;
        this.bottleImg = this.box.getChildByName('bottleImg') as Image;
        this.registEvent();
        this.registTouchEvent();
    }

    registEvent() {
        Laya.stage.on('createFruite', this, this.createFruite);
        Laya.stage.on('markAsInBottle', this, this.markAsInBottle);
        Laya.stage.on('releaseControllingObj', this, this.releaseControllingObj);
        Laya.stage.on('addMergeGlow', this, this.addMergeGlow);
    }

    randomAFruiteLevel(): number {
        const rate = Math.random();
        let sum = 0;
        for (let fruite in POSSIBILITY_MAP) {
            sum += POSSIBILITY_MAP[fruite]
            if (rate <= sum) {
                const level = LEVEL_MAP[fruite];
                return level
            }
        }
    }

    readyLoadFruite() {
        if (this.nextFruiteLevel === null) {
            const curFruite = this.randomAFruiteLevel();
            this.createFruite(curFruite);
        } else {
            this.createFruite(this.nextFruiteLevel);
        }
        this.nextFruiteLevel = this.randomAFruiteLevel();
        Laya.stage.event('setNextFruite', this.nextFruiteLevel);
    }

    createFruite(level: number, pos?: { x: number, y: number }, needControl = true) {
        const fruitePre = ResourceManager.instance(ResourceManager).prefabsMap.get(LEVEL_ARRAY[level])
        const fruit = fruitePre.create() as Image;
        this.box.addChild(fruit);
        fruit.zOrder = zOdersEnum.fruite;
        if (pos) {
            fruit.pos(pos.x, pos.y);
        } else {
            fruit.x = this.touchArea.mouseX;
            fruit.y = this.bottleImg.y - fruit.height
        }
        if (needControl) {
            this.controllingObj = fruit.getComponent(FruitePhysicsComp) as FruitePhysicsComp;
            this.controllingObj.rigidbody.gravityScale = 0;
        }

        if (this.isMouseDown) {
            this.drawGuideLine();
        }
    }

    addMergeGlow(pos: { x: number, y: number }) {
        ResourceManager.instance(ResourceManager).playAnimationOnce(AniNames.mergeLight, this.box, 'glow', pos);
    }

    registTouchEvent() {
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onAreaMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onAreaMouseMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onAreaMouseUp);
        Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.onAreaMouseUp);
    }

    onAreaMouseDown(): void {
        this.isMouseDown = true;
        if (!this.controllingObj && this.canCreate) {
            this.canCreate = false;
            this.readyLoadFruite();
        }
    }

    drawGuideLine() {
        if (this.controllingObj && this.inBottleArr.indexOf(this.controllingObj.owner) === -1) {
            const posX = (this.controllingObj.owner as Image).x;
            const posY = (this.controllingObj.owner as Image).y;
            if (!this.guideLine) {
                this.guideLine = new Image(UrlResDef.guideLine);
                this.box.addChild(this.guideLine);
                this.guideLine.zOrder = zOdersEnum.guideLine;
            }
            this.guideLine.visible = true;
            this.guideLine.pos(posX, posY);
        }
    }

    onAreaMouseMove() {
        if (this.controllingObj && this.inBottleArr.indexOf(this.controllingObj.owner) === -1) {
            (this.controllingObj.owner as Image).x = this.touchArea.mouseX;
            if (this.guideLine && this.guideLine.visible) {
                this.guideLine.x = this.touchArea.mouseX;
            }
        }
    }

    onAreaMouseUp() {
        this.isMouseDown = false;
        if (this.controllingObj && this.inBottleArr.indexOf(this.controllingObj.owner) === -1) {
            this.controllingObj.owner.offAllCaller(this);
            if (this.guideLine) {
                this.guideLine.visible = false;
            }
            if (this.controllingObj && this.controllingObj.rigidbody) {
                this.controllingObj.rigidbody.gravityScale = LEVEL_MAP[this.controllingObj.collider.label] + 1;
            }
            if (this.controllingObj && this.controllingObj.rigidbody) {
                if (this.controllingObj.rigidbody.setVelocity) {
                    this.controllingObj.rigidbody.setVelocity({ x: 0, y: 10 });
                }
            }
            this.controllingObj = null;
        }
        Laya.timer.once(300, this, this.setCanCreate, [true])
    }

    /**
     * 设置是否可以创建水果，防止过快速度地创建水果
     */
    setCanCreate(isCan: boolean) {
        this.canCreate = isCan;
    }

    releaseControllingObj(fruite: Sprite) {
        if (this.controllingObj && fruite.getComponent(FruitePhysicsComp) === this.controllingObj) {
            this.controllingObj = null;
        }
    }

    markAsInBottle(fruit: Image) {
        this.inBottleArr.push(fruit);
    }

    overGame() {
        Laya.stage.offAllCaller(this);
        Laya.timer.clearAll(this);
        Laya.physicsTimer.scale = 0;
        this.isMouseDown = false;
        if (this.guideLine) {
            this.guideLine.removeSelf();
            this.guideLine = null;
        }
        this.controllingObj = null;
    }

    resetGame() {
        this.inBottleArr = [];
        for (let i = this.box.numChildren - 1; i >= 0; i--) {
            if (this.box.getChildAt(i).name !== 'bottleImg' && this.box.getChildAt(i).name !== 'touchArea') {
                this.box.getChildAt(i).removeSelf();
            }
        }
        this.nextFruiteLevel = null;
        Laya.physicsTimer.scale = 1;
        this.registEvent();
        this.registTouchEvent();
    }
}