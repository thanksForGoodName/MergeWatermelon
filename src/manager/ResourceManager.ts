import Singleton from "../util/Single";
import Prefab = Laya.Prefab;
import Loader = Laya.Loader;
import Handler = Laya.Handler;
import Animation = Laya.Animation;
import Sprite = Laya.Sprite;
import { LEVEL_ARRAY } from "../define/ConstDefine";
import { AnimAtlasArr, AniNames, AtlasArr, FRUITES_PRE_URL, JSONArr } from "../define/UIDefine";

export default class ResourceManager extends Singleton<ResourceManager> {
    public prefabsMap: Map<string, Prefab>;
    private loadedCount: number = 0;
    private aniMap: Map<string, Animation[]> = new Map<string, Animation[]>();
    constructor() {
        super();
    }

    public async loadAnimationsAsync(): Promise<boolean> {
        return new Promise((resolve) => {
            let aniCount = 0;
            for (let name in AniNames) {
                //创建动画实例
                const ani = new Animation();
                //加载动画图集，加载成功后执行回调方法
                ani.loadAtlas(`res/atlas/anim/${AniNames[name]}.atlas`, Handler.create(this, () => {
                    this.aniMap.set(AniNames[name], [ani]);
                    aniCount++;
                    if (aniCount === AnimAtlasArr.length) {
                        resolve(true);
                    }
                }));
            }
        })
    }

    /**
     * 加载某个特定动画
     * @param aniName 
     */
    public async loadSpecificAnimationAsync(aniName: string): Promise<boolean> {
        return new Promise((resolve) => {
            //创建动画实例
            const ani = new Animation();
            //加载动画图集，加载成功后执行回调方法
            ani.loadAtlas(`res/atlas/anim/${aniName}.atlas`, Handler.create(this, () => {
                if (this.aniMap.get(aniName)) {
                    this.aniMap.get(aniName).push(ani);
                } else {
                    this.aniMap.set(aniName, [ani]);
                }
                resolve(true);
            }));
        })
    }

    /**
     * 播放一次动画
     * @param aniName 
     * @param parent 
     * @param playName 
     */
    public playAnimationOnce(aniName: string, parent: Sprite, playName: string, pos: { x: number, y: number }) {
        const ani = this.getAnimation(aniName);
        if (!ani) {
            return;
        }
        ani.size(80, 80);
        ani.scale(2, 2)
        ani.pos(pos.x, pos.y);
        ani.zOrder = Number.MAX_SAFE_INTEGER;
        parent.addChild(ani);
        ani.play(0, false);
        ani.on(Laya.Event.COMPLETE, this, this.recoverAnimation, [ani, aniName])
    }

    public getAnimation(aniName: string) {
        const ani = this.aniMap.get(aniName).pop();
        if (!ani) {
            this.loadSpecificAnimationAsync(aniName);
            return;
        }
        return ani;
    }


    public recoverAnimation(ani: Animation, aniName: string) {
        ani.stop();
        ani.removeSelf();
        this.aniMap.get(aniName).push(ani);
    }

    public async loadFruitesPreAsync(): Promise<boolean> {
        return new Promise((resolve) => {
            if (!this.prefabsMap) {
                this.prefabsMap = new Map<string, Prefab>();

                if (LEVEL_ARRAY.length > 0) {
                    for (let i = 0; i < LEVEL_ARRAY.length; i++) {
                        const url = `${FRUITES_PRE_URL}${LEVEL_ARRAY[i]}.prefab`;
                        Laya.loader.load(url, Handler.create(this, (prefab: Prefab) => {
                            this.prefabsMap.set(LEVEL_ARRAY[i], prefab)
                            this.loadedCount += 1;
                            if (this.loadedCount === LEVEL_ARRAY.length) {
                                resolve(true);
                            }
                        }), null, Loader.PREFAB)
                    }
                } else {
                    resolve(true);
                }
            } else {
                resolve(true);
            }
        })
    }

    public async loadJson(): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                Laya.loader.load(JSONArr, Laya.Handler.create(this, () => {
                    resolve(true);
                }))
            } catch {
                resolve(false);
            }
        })
    }

    public async loadAtlasAsync(): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                Laya.loader.load(AtlasArr, Laya.Handler.create(this, () => {
                    resolve(true);
                }))
            } catch {
                resolve(false);
            }
        })
    }
}