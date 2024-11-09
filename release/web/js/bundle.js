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
    class FruitePhysicsComp extends Script$2 {
        onAwake() {
            this.fruite = this.owner;
            this.collider = this.owner.getComponent(CircleCollider);
            this.rigidbody = this.owner.getComponent(RigidBody$1);
            this.collider.radius *= this.fruite.parent.scaleX;
            this.rigidbody.setVelocity({ x: 0, y: FRUITE_SPEED });
        }
        onTriggerEnter(other, self, contact) {
            if (other.label === self.label) {
                const label = other.label;
                const pos = this.calculateTriggerPoint(other, self);
                const level = (LEVEL_MAP[label] + 1) < LEVEL_ARRAY.length ? LEVEL_MAP[label] + 1 : LEVEL_MAP[label];
                if (!other.owner || !self.owner) {
                    return;
                }
                (other.owner).removeSelf();
                (self.owner).removeSelf();
                other.destroy();
                self.destroy();
                Laya.stage.event('loadFruite', [level, pos, false]);
            }
        }
        calculateTriggerPoint(other, self) {
            if (!other.owner || !self.owner) {
                return;
            }
            const vector = new Point(other.owner.x - self.owner.x, other.owner.y - self.owner.y);
            vector.normalize();
            const pos = { x: self.owner.x + self.radius * vector.x, y: self.owner.y + self.radius * vector.y };
            return pos;
        }
    }

    var Script$3 = Laya.Script;
    var Handler = Laya.Handler;
    var Loader = Laya.Loader;
    class FruitesController extends Script$3 {
        constructor() {
            super(...arguments);
            this.inBottleArr = [];
        }
        onAwake() {
            this.box = this.owner;
            this.leftArrow = this.box.getChildByName('leftArrow');
            this.rightArrow = this.box.getChildByName('rightArrow');
            this.bottleImg = this.box.getChildByName('bottleImg');
            this.registerEvent();
            this.addFruites();
        }
        registerEvent() {
            Laya.stage.on('loadFruite', this, this.loadFruite);
            Laya.stage.on('markAsInBottle', this, this.markAsInBottle);
        }
        addFruites() {
            Laya.timer.loop(2000, this, this.regularAddFruite);
        }
        regularAddFruite() {
            this.offControllingObj();
            if (!this.controllingObj) {
                const rate = Math.random();
                let sum = 0;
                for (let fruite in POSSIBILITY_MAP) {
                    sum += POSSIBILITY_MAP[fruite];
                    if (rate <= sum) {
                        const level = LEVEL_MAP[fruite];
                        this.loadFruite(level);
                        break;
                    }
                }
            }
        }
        loadFruite(level, pos, needControl = true) {
            const url = `${FRUITES_PRE_URL}${LEVEL_ARRAY[level]}.prefab`;
            Laya.loader.load(url, Handler.create(this, (prefab) => {
                const fruit = prefab.create();
                this.box.addChild(fruit);
                if (pos) {
                    fruit.pos(pos.x, pos.y);
                }
                else {
                    fruit.x = this.bottleImg.x + (Math.random() * this.bottleImg.width);
                }
                if (needControl) {
                    this.controllingObj = fruit.getComponent(FruitePhysicsComp);
                    this.registerArrowEvent();
                }
            }), null, Loader.PREFAB);
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
    GameConfig.stat = true;
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
