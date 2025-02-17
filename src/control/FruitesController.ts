import { LEVEL_ARRAY, LEVEL_MAP, POSSIBILITY_MAP, zOdersEnum } from "../define/ConstDefine";
import Script = Laya.Script;
import Image = Laya.Image;
import Sprite = Laya.Sprite;
import Box = Laya.Box;
import FruitePhysicsComp from "../component/FruitePhysicsComp";
import ResourceManager from "../manager/ResourceManager";
import { AniSize, UrlResDef } from "../define/UIDefine";
import { EventDef } from "../define/EventDefine";

/**
 * 水果掉落控制器
 */
export default class FruitesController extends Script {
    private box: Box;
    private touchArea: Sprite;
    private lineLimit: Sprite;
    private controllingObj: FruitePhysicsComp;

    public bottleImg: Image;
    public guideLine: Image;
    public isMouseDown = false;
    public nextFruiteLevel: number = null;

    private inBottleArr = [];
    private canCreate = true;
    /**
     * 连击次数
     */
    private continueScore = 0;
    /**
     * 上一次相同水果撞击的时间
     */
    private lastTakeTime = 0;
    /**
     * 计时器
     */
    private curTime = 0;

    onAwake() {
        this.box = this.owner as Box;
        this.touchArea = this.box.getChildByName('touchArea') as Sprite;
        this.bottleImg = this.box.getChildByName('bottleImg') as Image;
        this.lineLimit = this.box.getChildByName('lineArea') as Sprite;
        this.registEvent();
        this.registTouchEvent();
    }

    onUpdate(): void {
        this.curTime += Laya.timer.delta;
    }

    registEvent() {
        Laya.stage.on(EventDef.CREATE_FRUITE, this, this.createFruite);
        Laya.stage.on(EventDef.MARK_IN_BOTTLE, this, this.markAsInBottle);
        Laya.stage.on(EventDef.RELEASE_CONTROLING_OBJ, this, this.releaseControllingObj);
        Laya.stage.on(EventDef.ADD_BLOOM_ANI, this, this.addBloomAni);
        Laya.stage.on(EventDef.REMOVE_FROM_BOTTLE, this, this.removeFromBottle);
        Laya.stage.on(EventDef.CHECK_CONTINUE_TIMES, this, this.checkContinueScore);
    }

    /**
     * 检查连击次数
     * @param curTime 
     */
    checkContinueScore() {
        const lastContinueScore = this.continueScore;
        if ((this.curTime - this.lastTakeTime) < 500) {
            this.continueScore++;
        } else {
            this.continueScore = 0;
        }

        if (lastContinueScore >= 3) {
            this.continueScore = 0;
            this.playBravoAni(new Image(UrlResDef.bravoImg));
        } else if (lastContinueScore >= 2) {
            this.playBravoAni(new Image(UrlResDef.greatImg));
        }

        this.lastTakeTime = this.curTime;
    }

    playBravoAni(img: Image) {
        img.pivot(img.width / 2, img.height / 2)
        img.scale(0, 0);
        img.pos(this.box.width / 2, this.box.height / 3);
        this.box.addChild(img);
        img.zOrder = zOdersEnum.animation;
        Laya.Tween.to(img, { scaleX: 1, scaleY: 1, y: img.y - 100 }, 500, null, Laya.Handler.create(this, () => {
            Laya.Tween.to(img, { scaleX: 1.5, scaleY: 1.5, alpha: 0 }, 200, null, Laya.Handler.create(this, () => {
                img.removeSelf();
                img.destroy();
            }), 200)
        }))
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
        Laya.stage.event(EventDef.SET_NEXT_FUITE, this.nextFruiteLevel);
    }

    createFruite(level: number, pos?: { x: number, y: number }, needControl = true) {
        const fruitePre = ResourceManager.instance(ResourceManager).prefabsMap.get(LEVEL_ARRAY[level])
        const fruit = fruitePre.create() as Image;
        this.box.addChild(fruit);
        fruit.zOrder = zOdersEnum.fruite;
        if (pos) {
            fruit.pos(pos.x, pos.y);
        } else {
            let x = this.touchArea.mouseX;
            x = x < this.lineLimit.x ? this.lineLimit.x : x;
            x = x > (this.lineLimit.x + this.lineLimit.width) ? (this.lineLimit.x + this.lineLimit.width) : x;
            fruit.x = x;
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

    addBloomAni(level: number, pos: { x: number, y: number }) {
        ResourceManager.instance(ResourceManager).playAnimationOnce({
            aniName: `bloom_${level}`,
            playName: 'bloom',
            parent: this.box,
            pos,
            size: { width: AniSize[`bloom_${level}`], height: AniSize[`bloom_${level}`] },
            scale: { scaleX: 2, scaleY: 2 },
            pivot: { pivotX: AniSize[`bloom_${level}`] / 2, pivotY: AniSize[`bloom_${level}`] / 2 }
        });
    }

    registTouchEvent() {
        this.touchArea.on(Laya.Event.MOUSE_DOWN, this, this.onAreaMouseDown);
        this.touchArea.on(Laya.Event.MOUSE_MOVE, this, this.onAreaMouseMove);
        this.touchArea.on(Laya.Event.MOUSE_UP, this, this.onAreaMouseUp);
        this.touchArea.on(Laya.Event.MOUSE_OUT, this, this.onAreaMouseUp);
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
            let x = this.touchArea.mouseX;
            x = x < this.lineLimit.x ? this.lineLimit.x : x;
            x = x > (this.lineLimit.x + this.lineLimit.width) ? (this.lineLimit.x + this.lineLimit.width) : x;
            (this.controllingObj.owner as Image).x = x;
            if (this.guideLine && this.guideLine.visible) {
                this.guideLine.x = x;
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

    removeFromBottle(fruite: Image) {
        const index = this.inBottleArr.indexOf(fruite);
        if (index !== -1) {
            this.inBottleArr.splice(index, 1);
        }
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
            if (this.box.getChildAt(i).name !== 'bottleImg' &&
                this.box.getChildAt(i).name !== 'touchArea' &&
                this.box.getChildAt(i).name !== 'lineArea') {
                this.box.getChildAt(i).removeSelf();
            }
        }
        this.nextFruiteLevel = null;
        Laya.physicsTimer.scale = 1;
        this.registEvent();
        this.registTouchEvent();
    }
}