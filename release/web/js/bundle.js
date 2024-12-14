(function () {
    'use strict';

    var Dialog = Laya.Dialog;
    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var dialogs;
        (function (dialogs) {
            class OverGameDialogUI extends Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("dialogs/OverGameDialog");
                }
            }
            dialogs.OverGameDialogUI = OverGameDialogUI;
            REG("ui.dialogs.OverGameDialogUI", OverGameDialogUI);
        })(dialogs = ui.dialogs || (ui.dialogs = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var scenes;
        (function (scenes) {
            class MainSceneUI extends Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("scenes/MainScene");
                }
            }
            scenes.MainSceneUI = MainSceneUI;
            REG("ui.scenes.MainSceneUI", MainSceneUI);
        })(scenes = ui.scenes || (ui.scenes = {}));
    })(ui || (ui = {}));

    class OverGameDialog extends ui.dialogs.OverGameDialogUI {
        onAwake() {
            Laya.stage.event('overGame');
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

    const FRUITES_PRE_URL = 'prefabs/fruites/';
    const SCORE_IMG_URL = 'score/z';
    const FRUITE_IMG_URL = 'fruite/';
    const UrlResDef = {
        guideLine: 'main/redline.png'
    };
    const JsonResDef = {
        overGameDialog: 'dialogs/OverGameDialog.json'
    };
    const JSONArr = [
        'dialogs/OverGameDialog.json'
    ];

    class Singleton {
        static instance(c) {
            if (!this.ins) {
                this.ins = new c();
            }
            return this.ins;
        }
    }

    const DESIGN_SCREEN_WIDTH = 750;
    const DESIGN_SCREEN_HEIGHT = 1624;
    const LEVEL_MAP = {
        kiwifruitePre: 0,
        orangePre: 1,
        watermelonPre: 2,
        megranatePre: 3,
        cucumberPre: 4,
        pepperPre: 5,
        applePre: 6,
        tomatoPre: 7
    };
    const LEVEL_ARRAY = ['kiwifruitePre', 'orangePre', 'watermelonPre', 'megranatePre', 'cucumberPre', 'pepperPre', 'applePre', 'tomatoPre'];
    const POSSIBILITY_MAP = {
        tomatoPre: 0,
        applePre: 0,
        pepperPre: 0,
        cucumberPre: 0,
        megranatePre: 0,
        watermelonPre: 0.2,
        orangePre: 0.3,
        kiwifruitePre: 0.5,
    };
    const SCORE_ARRAY = [2, 4, 8, 16, 32, 64, 128, 256];
    const FRUITE_SPEED = 10;
    var zOdersEnum;
    (function (zOdersEnum) {
        zOdersEnum[zOdersEnum["tool"] = 1000] = "tool";
        zOdersEnum[zOdersEnum["fruite"] = 999] = "fruite";
        zOdersEnum[zOdersEnum["guideLine"] = 998] = "guideLine";
    })(zOdersEnum || (zOdersEnum = {}));

    var Loader = Laya.Loader;
    var Handler = Laya.Handler;
    var Animation = Laya.Animation;
    const aniNames = {
        mergeLight: 'light2'
    };
    class ResourceManager extends Singleton {
        constructor() {
            super();
            this.loadedCount = 0;
            this.aniMap = new Map();
        }
        loadAnimations() {
            for (let name in aniNames) {
                const ani = new Animation();
                ani.loadAtlas(`res/atlas/anim/${aniNames[name]}.atlas`, Handler.create(this, () => {
                    this.aniMap.set(aniNames[name], [ani]);
                }));
            }
        }
        loadSpecificAnimation(aniName) {
            const ani = new Animation();
            ani.loadAtlas(`res/atlas/anim/${aniName}.atlas`, Handler.create(this, () => {
                if (this.aniMap.get(aniName)) {
                    this.aniMap.get(aniName).push(ani);
                }
                else {
                    this.aniMap.set(aniName, [ani]);
                }
            }));
        }
        playAnimationOnce(aniName, parent, playName, pos) {
            const ani = this.getAnimation(aniName);
            if (!ani) {
                return;
            }
            ani.size(80, 80);
            ani.scale(2, 2);
            ani.pos(pos.x, pos.y);
            ani.zOrder = Number.MAX_SAFE_INTEGER;
            parent.addChild(ani);
            ani.play(0, false);
            ani.on(Laya.Event.COMPLETE, this, this.recoverAnimation, [ani, aniName]);
        }
        getAnimation(aniName) {
            const ani = this.aniMap.get(aniName).pop();
            if (!ani) {
                this.loadSpecificAnimation(aniName);
                return;
            }
            return ani;
        }
        recoverAnimation(ani, aniName) {
            ani.stop();
            ani.removeSelf();
            this.aniMap.get(aniName).push(ani);
        }
        loadFruitesPre(success) {
            if (!this.prefabsMap) {
                this.prefabsMap = new Map();
                for (let i = 0; i < LEVEL_ARRAY.length; i++) {
                    const url = `${FRUITES_PRE_URL}${LEVEL_ARRAY[i]}.prefab`;
                    Laya.loader.load(url, Handler.create(this, (prefab) => {
                        this.prefabsMap.set(LEVEL_ARRAY[i], prefab);
                        this.loadedCount += 1;
                        if (this.loadedCount === LEVEL_ARRAY.length) {
                            if (success) {
                                success();
                            }
                        }
                    }), null, Loader.PREFAB);
                }
            }
        }
        loadJson() {
            Laya.loader.load(JSONArr);
        }
    }

    var Image = Laya.Image;
    const numWidth = 39;
    class ScoreController extends Laya.Script {
        constructor() {
            super(...arguments);
            this.textImgs = [];
            this.totalScore = 0;
        }
        onAwake() {
            this.scoreBox = this.owner;
            const url = `${SCORE_IMG_URL}0.png`;
            this.addNewNumChar(url, 0);
        }
        resetScore() {
            this.textImgs = [];
            this.totalScore = 0;
            if (this.scoreBox.numChildren > 0) {
                this.scoreBox.destroyChildren();
            }
            const url = `${SCORE_IMG_URL}0.png`;
            this.addNewNumChar(url, 0);
        }
        setTextImg(num) {
            ResourceManager.instance(ResourceManager).playAnimationOnce(aniNames.mergeLight, this.scoreBox, 'glow', { x: this.scoreBox.pivotX - 80, y: this.scoreBox.pivotY - 80 });
            this.totalScore += num;
            const numStr = this.totalScore.toString();
            for (let i = 0; i < numStr.length; i++) {
                const url = `${SCORE_IMG_URL}${numStr[i]}.png`;
                if (this.textImgs[i]) {
                    if (this.textImgs[i].skin !== url) {
                        this.textImgs[i].skin = url;
                    }
                }
                else {
                    this.addNewNumChar(url, i);
                }
            }
        }
        addNewNumChar(url, index) {
            this.textImgs.push(new Image(url));
            this.textImgs[index].pos(index * numWidth, 0);
            this.scoreBox.addChild(this.textImgs[index]);
            this.scoreBox.width = this.textImgs.length * numWidth;
            this.scoreBox.pivot(this.scoreBox.width / 2, this.scoreBox.height / 2);
        }
    }

    var CircleCollider = Laya.CircleCollider;
    var RigidBody = Laya.RigidBody;
    var Script = Laya.Script;
    var Point = Laya.Point;
    var Handler$1 = Laya.Handler;
    var Ease = Laya.Ease;
    class FruitePhysicsComp extends Script {
        onAwake() {
            this.fruite = this.owner;
            this.collider = this.owner.getComponent(CircleCollider);
            this.rigidbody = this.owner.getComponent(RigidBody);
            this.collider.radius *= this.fruite.parent.scaleX;
        }
        onUpdate() {
            this.checkOutStatus();
        }
        checkOutStatus() {
            if (this.fruite.y >= Laya.stage.height) {
                this.fruite.removeSelf();
                this.fruite.destroy();
                console.log('水果掉出瓶子之外了，销毁');
            }
        }
        onTriggerEnter(other, self, contact) {
            if (other.label === self.label) {
                if (!other.owner || !self.owner) {
                    return;
                }
                Laya.stage.event('releaseControllingObj', self.owner);
                Laya.stage.event('releaseControllingObj', other.owner);
                const otherFruite = other.owner;
                const selfFruite = self.owner;
                const label = other.label.slice(0, other.label.length);
                const radius = self.radius;
                other.owner.getComponent(RigidBody).destroy();
                self.owner.getComponent(RigidBody).destroy();
                other.owner.getComponent(CircleCollider).destroy();
                self.owner.getComponent(CircleCollider).destroy();
                this.mergeFruite(otherFruite, selfFruite, label, radius);
            }
        }
        mergeFruite(other, self, label, radius) {
            if (!other || !self) {
                return;
            }
            const pos = this.calculateTriggerPoint({ x: other.x, y: other.y }, { x: self.x, y: self.y }, radius);
            const level = (LEVEL_MAP[label] + 1) < LEVEL_ARRAY.length ? LEVEL_MAP[label] + 1 : LEVEL_MAP[label];
            Laya.stage.event('addMergeGlow', { x: pos.x - 80, y: pos.y - 80 });
            Laya.Tween.to(other, { x: pos.x, y: pos.y, scaleX: 0.8, scaleY: 0.8 }, 200, Ease.elasticInOut, Handler$1.create(this, () => {
                other.removeSelf();
                Laya.stage.event('createFruite', [level, pos, false]);
                Laya.stage.event('addScore', SCORE_ARRAY[level]);
            }));
            Laya.Tween.to(self, { x: pos.x, y: pos.y, scaleX: 0.8, scaleY: 0.8 }, 200, Ease.elasticInOut, Handler$1.create(this, () => {
                self.removeSelf();
            }));
        }
        calculateTriggerPoint(otherPos, selfPos, radius) {
            const vector = new Point(otherPos.x - selfPos.x, otherPos.y - selfPos.y);
            vector.normalize();
            const pos = { x: selfPos.x + radius * vector.x, y: selfPos.y + radius * vector.y };
            return pos;
        }
    }

    var Script$1 = Laya.Script;
    var Image$1 = Laya.Image;
    class FruitesController extends Script$1 {
        constructor() {
            super(...arguments);
            this.isMouseDown = false;
            this.nextFruiteLevel = null;
            this.inBottleArr = [];
        }
        onAwake() {
            this.box = this.owner;
            this.touchArea = this.box.getChildByName('touchArea');
            this.bottleImg = this.box.getChildByName('bottleImg');
            this.registEvent();
            this.registTouchEvent();
            ResourceManager.instance(ResourceManager).loadFruitesPre(() => {
                this.regularAddFruite();
            });
        }
        registEvent() {
            Laya.stage.on('createFruite', this, this.createFruite);
            Laya.stage.on('markAsInBottle', this, this.markAsInBottle);
            Laya.stage.on('releaseControllingObj', this, this.releaseControllingObj);
            Laya.stage.on('addMergeGlow', this, this.addMergeGlow);
        }
        regularAddFruite() {
            Laya.timer.once(500, this, () => {
                if (this.nextFruiteLevel === null) {
                    const curFruite = this.randomAFruiteLevel();
                    this.createFruite(curFruite);
                }
                else {
                    this.createFruite(this.nextFruiteLevel);
                }
                this.nextFruiteLevel = this.randomAFruiteLevel();
                Laya.stage.event('setNextFruite', this.nextFruiteLevel);
            });
        }
        randomAFruiteLevel() {
            const rate = Math.random();
            let sum = 0;
            for (let fruite in POSSIBILITY_MAP) {
                sum += POSSIBILITY_MAP[fruite];
                if (rate <= sum) {
                    const level = LEVEL_MAP[fruite];
                    return level;
                }
            }
        }
        createFruite(level, pos, needControl = true) {
            const fruitePre = ResourceManager.instance(ResourceManager).prefabsMap.get(LEVEL_ARRAY[level]);
            const fruit = fruitePre.create();
            this.box.addChild(fruit);
            fruit.zOrder = zOdersEnum.fruite;
            if (pos) {
                fruit.pos(pos.x, pos.y);
            }
            else {
                fruit.x = this.bottleImg.x + (0.5 * this.bottleImg.width);
                fruit.y = this.bottleImg.y - fruit.height;
            }
            if (needControl) {
                this.controllingObj = fruit.getComponent(FruitePhysicsComp);
                this.controllingObj.rigidbody.gravityScale = 0;
            }
            if (this.isMouseDown) {
                this.drawGuideLine();
            }
        }
        addMergeGlow(pos) {
            ResourceManager.instance(ResourceManager).playAnimationOnce(aniNames.mergeLight, this.box, 'glow', pos);
        }
        registTouchEvent() {
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onAreaMouseDown);
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onAreaMouseMove);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onAreaMouseUp);
            Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.onAreaMouseUp);
        }
        onAreaMouseDown() {
            this.isMouseDown = true;
            this.drawGuideLine();
        }
        drawGuideLine() {
            if (this.controllingObj && this.inBottleArr.indexOf(this.controllingObj.owner) === -1) {
                const posX = this.controllingObj.owner.x;
                const posY = this.controllingObj.owner.y;
                if (!this.guideLine) {
                    this.guideLine = new Image$1(UrlResDef.guideLine);
                    this.box.addChild(this.guideLine);
                    this.guideLine.zOrder = zOdersEnum.guideLine;
                }
                this.guideLine.visible = true;
                this.guideLine.pos(posX, posY);
            }
        }
        onAreaMouseMove() {
            if (this.controllingObj && this.inBottleArr.indexOf(this.controllingObj.owner) === -1) {
                this.controllingObj.owner.x = this.touchArea.mouseX;
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
                this.regularAddFruite();
            }
        }
        releaseControllingObj(fruite) {
            if (this.controllingObj && fruite.getComponent(FruitePhysicsComp) === this.controllingObj) {
                this.controllingObj = null;
            }
        }
        markAsInBottle(fruit) {
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
            this.regularAddFruite();
        }
    }

    class MainScene extends ui.scenes.MainSceneUI {
        onAwake() {
            this.screenAdapter();
            this.registEvent();
            ResourceManager.instance(ResourceManager).loadAnimations();
            ResourceManager.instance(ResourceManager).loadJson();
        }
        registEvent() {
            Laya.stage.on('addScore', this, this.addScore);
            Laya.stage.on('setNextFruite', this, this.setNextFruite);
            Laya.stage.on('overGame', this, this.overGame);
            Laya.stage.on('resetGame', this, this.resetGame);
        }
        screenAdapter() {
            const scale = Laya.stage.height / DESIGN_SCREEN_HEIGHT >= 1 ? 1 : Laya.stage.height / DESIGN_SCREEN_HEIGHT;
            this.bg.width = Laya.stage.width;
            this.bg.height = Laya.stage.height;
            this.contentBox.scale(scale, scale);
            this.contentBox.y *= scale;
            this.contentBox.x = this.bg.width / 2;
            this.toolBox.scale(scale, scale);
            this.toolBox.y *= scale;
            this.toolBox.x = this.bg.width / 2;
            this.topBox.scale(scale, scale);
            this.topBox.x *= scale;
            this.topBox.y *= scale;
        }
        addScore(num) {
            this.scoreBox.getComponent(ScoreController).setTextImg(num);
        }
        setNextFruite(level) {
            const skinUrl = `${FRUITE_IMG_URL}${level + 1}.png`;
            this.nextImg.skin = skinUrl;
            this.nextImg.visible = true;
        }
        resetScore() {
            this.scoreBox.getComponent(ScoreController).resetScore();
        }
        resetNextFruite() {
            this.nextImg.skin = '';
            this.nextImg.visible = false;
        }
        resetFruiteController() {
            this.contentBox.getComponent(FruitesController).resetGame();
        }
        overGame() {
            this.contentBox.getComponent(FruitesController).overGame();
        }
        resetGame() {
            this.resetFruiteController();
            this.resetScore();
            this.resetNextFruite();
        }
    }

    var BoxCollider = Laya.BoxCollider;
    var Script$2 = Laya.Script;
    class BottlePhysicsComp extends Script$2 {
        constructor() {
            super(...arguments);
            this.colliderEdges = [];
        }
        onAwake() {
            this.box = this.owner;
            this.box.scaleY = this.box.scaleX = (this.box.parent.parent).scaleX;
            const colliders = this.owner.getComponents(BoxCollider);
            for (let i = 0; i < colliders.length; i++) {
                if (colliders[i].label === 'bottleSpace') {
                    this.colliderSpace = colliders[i];
                }
                else {
                    this.colliderEdges.push(colliders[i]);
                }
            }
            this.box.y *= this.box.scaleX;
        }
        onTriggerExit(other, self, contact) {
            if (other.label === 'bottleSpace' || self.label === 'bottleSpace') {
                if (!Laya.Dialog.manager || !Laya.Dialog.manager.getChildByName('OverGameDialog')) {
                    Laya.Dialog.open(JsonResDef.overGameDialog);
                }
            }
        }
        onTriggerEnter(other, self, contact) {
            if (other.label === 'bottleSpace' || self.label === 'bottleSpace') {
                if (LEVEL_ARRAY.indexOf(other.label) !== -1) {
                    Laya.stage.event('markAsInBottle', other.owner);
                }
            }
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("dialog/OverGameDialog.ts", OverGameDialog);
            reg("scene/MainScene.ts", MainScene);
            reg("component/BottlePhysicsComp.ts", BottlePhysicsComp);
            reg("control/FruitesController.ts", FruitesController);
            reg("component/ScoreController.ts", ScoreController);
            reg("component/FruitePhysicsComp.ts", FruitePhysicsComp);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "vertical";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "scenes/MainScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
