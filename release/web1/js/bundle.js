(function () {
    'use strict';

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
    const FRUITES_PRE_URL = 'prefabs/fruites/';
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
    const SCORE_IMG_URL = 'score/z';

    class Singleton {
        static instance(c) {
            if (!this.ins) {
                this.ins = new c();
            }
            return this.ins;
        }
    }

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
                console.log('动画需要加载');
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
                    this.textImgs.push(new Image(url));
                    this.textImgs[i].pos(i * numWidth, 0);
                    this.scoreBox.addChild(this.textImgs[i]);
                    this.scoreBox.width = this.textImgs.length * numWidth;
                    this.scoreBox.pivot(this.scoreBox.width / 2, this.scoreBox.height / 2);
                }
            }
        }
    }

    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
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

    class MainScene extends ui.scenes.MainSceneUI {
        onAwake() {
            this.screenAdapter();
            this.registEvent();
            this.deadline.zOrder = Number.MAX_SAFE_INTEGER;
            ResourceManager.instance(ResourceManager).loadAnimations();
        }
        registEvent() {
            Laya.stage.on('addScore', this, this.addScore);
        }
        screenAdapter() {
            const scale = Laya.stage.height / DESIGN_SCREEN_HEIGHT >= 1 ? 1 : Laya.stage.height / DESIGN_SCREEN_HEIGHT;
            this.bg.width = Laya.stage.width;
            this.bg.height = Laya.stage.height;
            this.contentBox.scale(scale, scale);
            this.contentBox.y *= scale;
            this.contentBox.x = this.bg.width / 2;
            this.crown.scale(scale, scale);
            this.crown.y *= scale;
        }
        addScore(num) {
            this.scoreBox.getComponent(ScoreController).setTextImg(num);
        }
    }

    var BoxCollider = Laya.BoxCollider;
    var Script = Laya.Script;
    class BottlePhysicsComp extends Script {
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
    }

    var BoxCollider$1 = Laya.BoxCollider;
    var RigidBody = Laya.RigidBody;
    var Script$1 = Laya.Script;
    class DeadlinePhysicsComp extends Script$1 {
        onAwake() {
            this.collider = this.owner.getComponent(BoxCollider$1);
            this.rigidbody = this.owner.getComponent(RigidBody);
        }
        onTriggerExit(other, self, contact) {
            if (LEVEL_ARRAY.indexOf(other.label) !== -1) {
                Laya.stage.event('markAsInBottle', other.owner);
            }
        }
    }

    var CircleCollider = Laya.CircleCollider;
    var RigidBody$1 = Laya.RigidBody;
    var Script$2 = Laya.Script;
    var Point = Laya.Point;
    var Handler$1 = Laya.Handler;
    var Ease = Laya.Ease;
    class FruitePhysicsComp extends Script$2 {
        onAwake() {
            this.fruite = this.owner;
            this.collider = this.owner.getComponent(CircleCollider);
            this.rigidbody = this.owner.getComponent(RigidBody$1);
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
                other.owner.getComponent(RigidBody$1).destroy();
                self.owner.getComponent(RigidBody$1).destroy();
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

    var Script$3 = Laya.Script;
    var Sprite = Laya.Sprite;
    class FruitesController extends Script$3 {
        constructor() {
            super(...arguments);
            this.guideLine = new Sprite();
            this.inBottleArr = [];
        }
        onAwake() {
            this.box = this.owner;
            this.touchArea = this.box.getChildByName('touchArea');
            this.bottleImg = this.box.getChildByName('bottleImg');
            this.registEvent();
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
            Laya.timer.once(1000, this, () => {
                const rate = Math.random();
                let sum = 0;
                for (let fruite in POSSIBILITY_MAP) {
                    sum += POSSIBILITY_MAP[fruite];
                    if (rate <= sum) {
                        const level = LEVEL_MAP[fruite];
                        this.createFruite(level);
                        break;
                    }
                }
            });
        }
        createFruite(level, pos, needControl = true) {
            const fruitePre = ResourceManager.instance(ResourceManager).prefabsMap.get(LEVEL_ARRAY[level]);
            const fruit = fruitePre.create();
            this.box.addChild(fruit);
            if (pos) {
                fruit.pos(pos.x, pos.y);
            }
            else {
                fruit.x = this.bottleImg.x + (Math.random() * this.bottleImg.width);
                fruit.y = this.bottleImg.y - fruit.height;
            }
            if (needControl) {
                this.controllingObj = fruit.getComponent(FruitePhysicsComp);
                this.controllingObj.rigidbody.gravityScale = 0;
                this.registFruitesEvent();
            }
            if (this.isMouseDown) {
                this.drawGuideLine();
            }
        }
        addMergeGlow(pos) {
            ResourceManager.instance(ResourceManager).playAnimationOnce(aniNames.mergeLight, this.box, 'glow', pos);
        }
        registFruitesEvent() {
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
                const posX = this.controllingObj.owner.width / 2;
                const posY = this.controllingObj.owner.height;
                const toY = this.bottleImg.height;
                if (this.guideLine) {
                    this.guideLine.removeSelf();
                    this.guideLine.graphics.clear();
                }
                this.guideLine.graphics.drawLine(0, 0, 0, toY, '#ff0000', 2);
                this.controllingObj.owner.addChild(this.guideLine);
                this.guideLine.pos(posX, posY);
            }
        }
        onAreaMouseMove() {
            if (this.controllingObj && this.inBottleArr.indexOf(this.controllingObj.owner) === -1) {
                this.controllingObj.owner.x = this.touchArea.mouseX;
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
                if (this.controllingObj && this.controllingObj.rigidbody) {
                    this.controllingObj.rigidbody.gravityScale = LEVEL_MAP[this.controllingObj.collider.label] + 1;
                }
                if (this.controllingObj && this.controllingObj.rigidbody) {
                    if (this.controllingObj.rigidbody.applyForce) {
                        this.controllingObj.rigidbody.applyForce({ x: 0, y: 0 }, { x: 0, y: 10 });
                    }
                }
                this.controllingObj = null;
                this.regularAddFruite();
            }
        }
        releaseControllingObj(fruite) {
            if (this.controllingObj && fruite.getComponent(FruitePhysicsComp) === this.controllingObj) {
                this.controllingObj = null;
                this.regularAddFruite();
            }
        }
        markAsInBottle(fruit) {
            this.inBottleArr.push(fruit);
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("scene/MainScene.ts", MainScene);
            reg("component/BottlePhysicsComp.ts", BottlePhysicsComp);
            reg("component/DeadlinePhysicsComp.ts", DeadlinePhysicsComp);
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
