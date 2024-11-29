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
    const FRUITE_SPEED = 10;

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
            this.deadline.zOrder = Number.MAX_SAFE_INTEGER;
        }
        screenAdapter() {
            const scaleX = Laya.stage.height / DESIGN_SCREEN_HEIGHT >= 1 ? 1 : Laya.stage.height / DESIGN_SCREEN_HEIGHT;
            this.bg.width = Laya.stage.width;
            this.bg.height = Laya.stage.height;
            this.contentBox.scale(scaleX, scaleX);
            this.contentBox.y *= scaleX;
            this.contentBox.x = this.bg.width / 2;
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
    var Handler = Laya.Handler;
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
            const pos = this.calculateTriggerPoint(other, self, radius);
            const level = (LEVEL_MAP[label] + 1) < LEVEL_ARRAY.length ? LEVEL_MAP[label] + 1 : LEVEL_MAP[label];
            Laya.Tween.to(other, { x: pos.x, y: pos.y }, 50, Ease.expoOut, Handler.create(this, () => {
                other.removeSelf();
                Laya.stage.event('createFruite', [level, pos, false]);
            }));
            Laya.Tween.to(self, { x: pos.x, y: pos.y }, 50, Ease.expoOut, Handler.create(this, () => {
                self.removeSelf();
            }));
        }
        calculateTriggerPoint(other, self, radius) {
            if (!other || !self) {
                return;
            }
            const vector = new Point(other.x - self.x, other.y - self.y);
            vector.normalize();
            const pos = { x: self.x + radius * vector.x, y: self.y + radius * vector.y };
            return pos;
        }
    }

    class Singleton {
        static instance(c) {
            if (!this.ins) {
                this.ins = new c();
            }
            return this.ins;
        }
    }

    var Loader = Laya.Loader;
    var Handler$1 = Laya.Handler;
    class ResourceManager extends Singleton {
        constructor() {
            super();
            this.loadedCount = 0;
        }
        loadFruitesPre(success) {
            if (!this.prefabsMap) {
                this.prefabsMap = new Map();
                for (let i = 0; i < LEVEL_ARRAY.length; i++) {
                    const url = `${FRUITES_PRE_URL}${LEVEL_ARRAY[i]}.prefab`;
                    Laya.loader.load(url, Handler$1.create(this, (prefab) => {
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
            const fruitePre = Singleton.instance(ResourceManager).prefabsMap.get(LEVEL_ARRAY[level]);
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
        registFruitesEvent() {
            this.touchArea.on(Laya.Event.MOUSE_DOWN, this, this.onAreaMouseDown);
            this.touchArea.on(Laya.Event.MOUSE_MOVE, this, this.onAreaMouseMove);
            this.touchArea.on(Laya.Event.MOUSE_UP, this, this.onAreaMouseUp);
            this.touchArea.on(Laya.Event.MOUSE_OUT, this, this.onAreaMouseUp);
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
                this.controllingObj.rigidbody.gravityScale = LEVEL_MAP[this.controllingObj.collider.label] + 1;
                this.controllingObj.rigidbody.applyForce({ x: 0, y: 0 }, { x: 0, y: 10 });
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
