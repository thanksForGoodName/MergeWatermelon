(function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

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
        guideLine: 'main/redline.png',
    };
    const JsonResDef = {
        overGameDialog: 'dialogs/OverGameDialog.json'
    };
    const JSONArr = [
        'dialogs/OverGameDialog.json'
    ];
    const AtlasArr = [
        'res/atlas/fruite.atlas',
        'res/atlas/main.atlas',
        'res/atlas/score.atlas',
        'res/atlas/overGame.atlas',
    ];
    const AniNames = {
        mergeLight: 'light2',
        bloom_1: 'bloom_1',
        bloom_2: 'bloom_2',
        bloom_3: 'bloom_3',
        bloom_4: 'bloom_4',
        bloom_5: 'bloom_5',
        bloom_6: 'bloom_6',
        bloom_7: 'bloom_7',
        bloom_8: 'bloom_8',
    };
    const AniSize = {
        bloom_1: 161,
        bloom_2: 183,
        bloom_3: 183,
        bloom_4: 246,
        bloom_5: 340,
        bloom_6: 340,
        bloom_7: 431,
        bloom_8: 431,
    };
    const AnimAtlasArr = [
        'res/atlas/anim/light2.atlas',
        'res/atlas/anim/bloom_1.atlas',
        'res/atlas/anim/bloom_2.atlas',
        'res/atlas/anim/bloom_3.atlas',
        'res/atlas/anim/bloom_4.atlas',
        'res/atlas/anim/bloom_5.atlas',
        'res/atlas/anim/bloom_6.atlas',
        'res/atlas/anim/bloom_7.atlas',
        'res/atlas/anim/bloom_8.atlas',
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
    class ResourceManager extends Singleton {
        constructor() {
            super();
            this.loadedCount = 0;
            this.aniMap = new Map();
        }
        loadAnimationsAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve) => {
                    let aniCount = 0;
                    for (let name in AniNames) {
                        const ani = new Animation();
                        ani.loadAtlas(`res/atlas/anim/${AniNames[name]}.atlas`, Handler.create(this, () => {
                            this.aniMap.set(AniNames[name], [ani]);
                            aniCount++;
                            if (aniCount === AnimAtlasArr.length) {
                                resolve(true);
                            }
                        }));
                    }
                });
            });
        }
        loadSpecificAnimationAsync(aniName) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve) => {
                    const ani = new Animation();
                    ani.loadAtlas(`res/atlas/anim/${aniName}.atlas`, Handler.create(this, () => {
                        if (this.aniMap.get(aniName)) {
                            this.aniMap.get(aniName).push(ani);
                        }
                        else {
                            this.aniMap.set(aniName, [ani]);
                        }
                        resolve(true);
                    }));
                });
            });
        }
        playAnimationOnce(param) {
            const ani = this.getAnimation(param.aniName);
            if (!ani) {
                return;
            }
            if (param.size) {
                ani.size(param.size.width, param.size.height);
            }
            ani.size(80, 80);
            if (param.scale) {
                ani.scale(param.scale.scaleX, param.scale.scaleY);
            }
            if (param.pivot) {
                ani.pivot(param.pivot.pivotX, param.pivot.pivotY);
            }
            ani.scale(2, 2);
            ani.pos(param.pos.x, param.pos.y);
            ani.zOrder = Number.MAX_SAFE_INTEGER;
            param.parent.addChild(ani);
            ani.play(0, false);
            ani.on(Laya.Event.COMPLETE, this, this.recoverAnimation, [ani, param.aniName]);
        }
        getAnimation(aniName) {
            const ani = this.aniMap.get(aniName).pop();
            if (!ani) {
                this.loadSpecificAnimationAsync(aniName);
                return;
            }
            return ani;
        }
        recoverAnimation(ani, aniName) {
            ani.stop();
            ani.removeSelf();
            this.aniMap.get(aniName).push(ani);
        }
        loadFruitesPreAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve) => {
                    if (!this.prefabsMap) {
                        this.prefabsMap = new Map();
                        if (LEVEL_ARRAY.length > 0) {
                            for (let i = 0; i < LEVEL_ARRAY.length; i++) {
                                const url = `${FRUITES_PRE_URL}${LEVEL_ARRAY[i]}.prefab`;
                                Laya.loader.load(url, Handler.create(this, (prefab) => {
                                    this.prefabsMap.set(LEVEL_ARRAY[i], prefab);
                                    this.loadedCount += 1;
                                    if (this.loadedCount === LEVEL_ARRAY.length) {
                                        resolve(true);
                                    }
                                }), null, Loader.PREFAB);
                            }
                        }
                        else {
                            resolve(true);
                        }
                    }
                    else {
                        resolve(true);
                    }
                });
            });
        }
        loadJson() {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve) => {
                    try {
                        Laya.loader.load(JSONArr, Laya.Handler.create(this, () => {
                            resolve(true);
                        }));
                    }
                    catch (_a) {
                        resolve(false);
                    }
                });
            });
        }
        loadAtlasAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve) => {
                    try {
                        Laya.loader.load(AtlasArr, Laya.Handler.create(this, () => {
                            resolve(true);
                        }));
                    }
                    catch (_a) {
                        resolve(false);
                    }
                });
            });
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
            ResourceManager.instance(ResourceManager).playAnimationOnce({
                aniName: AniNames.mergeLight,
                parent: this.scoreBox,
                playName: 'glow',
                pos: { x: this.scoreBox.pivotX - 80, y: this.scoreBox.pivotY - 80 },
                size: { width: 80, height: 80 },
                scale: { scaleX: 2, scaleY: 2 }
            });
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
            Laya.stage.event('addBloomAni', [level, { x: pos.x, y: pos.y }]);
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

    const EventDef = {
        CREATE_FRUITE: 'CREATE_FRUITE',
        MARK_IN_BOTTLE: 'MARK_IN_BOTTLE',
        RELEASE_CONTROLING_OBJ: 'RELEASE_CONTROLING_OBJ',
        ADD_BLOOM_ANI: 'ADD_BLOOM_ANI',
        ADD_SCORE: 'ADD_SCORE',
        SET_NEXT_FUITE: 'SET_NEXT_FUITE',
        OVER_GAME: 'OVER_GAME',
        RESET_GAME: 'RESET_GAME'
    };

    var Script$1 = Laya.Script;
    var Image$1 = Laya.Image;
    class FruitesController extends Script$1 {
        constructor() {
            super(...arguments);
            this.isMouseDown = false;
            this.nextFruiteLevel = null;
            this.inBottleArr = [];
            this.canCreate = true;
        }
        onAwake() {
            this.box = this.owner;
            this.touchArea = this.box.getChildByName('touchArea');
            this.bottleImg = this.box.getChildByName('bottleImg');
            this.registEvent();
            this.registTouchEvent();
        }
        registEvent() {
            Laya.stage.on(EventDef.CREATE_FRUITE, this, this.createFruite);
            Laya.stage.on(EventDef.MARK_IN_BOTTLE, this, this.markAsInBottle);
            Laya.stage.on(EventDef.RELEASE_CONTROLING_OBJ, this, this.releaseControllingObj);
            Laya.stage.on(EventDef.ADD_BLOOM_ANI, this, this.addBloomAni);
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
        readyLoadFruite() {
            if (this.nextFruiteLevel === null) {
                const curFruite = this.randomAFruiteLevel();
                this.createFruite(curFruite);
            }
            else {
                this.createFruite(this.nextFruiteLevel);
            }
            this.nextFruiteLevel = this.randomAFruiteLevel();
            Laya.stage.event('setNextFruite', this.nextFruiteLevel);
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
                fruit.x = this.touchArea.mouseX;
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
        addBloomAni(level, pos) {
            ResourceManager.instance(ResourceManager).playAnimationOnce({
                aniName: `bloom_${level}`,
                playName: 'bloom',
                parent: this.box,
                pos,
                size: { width: AniSize[`bloom_${level}`], height: AniSize[`bloom_${level}`] },
                pivot: { pivotX: AniSize[`bloom_${level}`] / 2, pivotY: AniSize[`bloom_${level}`] / 2 }
            });
        }
        registTouchEvent() {
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onAreaMouseDown);
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onAreaMouseMove);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onAreaMouseUp);
            Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.onAreaMouseUp);
        }
        onAreaMouseDown() {
            this.isMouseDown = true;
            if (!this.controllingObj && this.canCreate) {
                this.canCreate = false;
                this.readyLoadFruite();
            }
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
            }
            Laya.timer.once(300, this, this.setCanCreate, [true]);
        }
        setCanCreate(isCan) {
            this.canCreate = isCan;
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
        }
    }

    class MainScene extends ui.scenes.MainSceneUI {
        onAwake() {
            this.screenAdapter();
            this.registEvent();
        }
        registEvent() {
            Laya.stage.on(EventDef.ADD_SCORE, this, this.addScore);
            Laya.stage.on(EventDef.SET_NEXT_FUITE, this, this.setNextFruite);
            Laya.stage.on(EventDef.OVER_GAME, this, this.overGame);
            Laya.stage.on(EventDef.RESET_GAME, this, this.resetGame);
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
            return __awaiter(this, void 0, void 0, function* () {
                yield ResourceManager.instance(ResourceManager).loadAnimationsAsync();
                yield ResourceManager.instance(ResourceManager).loadAtlasAsync();
                yield ResourceManager.instance(ResourceManager).loadFruitesPreAsync();
                yield ResourceManager.instance(ResourceManager).loadJson();
                GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
            });
        }
    }
    new Main();

}());
