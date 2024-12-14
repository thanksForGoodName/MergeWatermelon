import Singleton from "../util/Single";
import Prefab = Laya.Prefab;
import Loader = Laya.Loader;
import Handler = Laya.Handler;
import Animation = Laya.Animation;
import Sprite = Laya.Sprite;
import { LEVEL_ARRAY } from "../define/ConstDefine";
import { FRUITES_PRE_URL, JSONArr } from "../define/UIDefine";

export const aniNames = {
    //合成光效
    mergeLight: 'light2'
}
export default class ResourceManager extends Singleton<ResourceManager> {
    public prefabsMap: Map<string, Prefab>;
    private loadedCount: number = 0;
    private aniMap: Map<string, Animation[]> = new Map<string, Animation[]>();
    constructor() {
        super();
    }

    public loadAnimations() {
        for (let name in aniNames) {
            //创建动画实例
            const ani = new Animation();
            //加载动画图集，加载成功后执行回调方法
            ani.loadAtlas(`res/atlas/anim/${aniNames[name]}.atlas`, Handler.create(this, () => {
                this.aniMap.set(aniNames[name], [ani]);
            }));
        }
    }

    public loadSpecificAnimation(aniName: string) {
        //创建动画实例
        const ani = new Animation();
        //加载动画图集，加载成功后执行回调方法
        ani.loadAtlas(`res/atlas/anim/${aniName}.atlas`, Handler.create(this, () => {
            if (this.aniMap.get(aniName)) {
                this.aniMap.get(aniName).push(ani);
            } else {
                this.aniMap.set(aniName, [ani]);
            }
        }));
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
            this.loadSpecificAnimation(aniName);
            return;
        }
        return ani;
    }


    public recoverAnimation(ani: Animation, aniName: string) {
        ani.stop();
        ani.removeSelf();
        this.aniMap.get(aniName).push(ani);
    }

    public loadFruitesPre(success: Function) {
        if (!this.prefabsMap) {
            this.prefabsMap = new Map<string, Prefab>();

            for (let i = 0; i < LEVEL_ARRAY.length; i++) {
                const url = `${FRUITES_PRE_URL}${LEVEL_ARRAY[i]}.prefab`;
                Laya.loader.load(url, Handler.create(this, (prefab: Prefab) => {
                    this.prefabsMap.set(LEVEL_ARRAY[i], prefab)
                    this.loadedCount += 1;
                    if (this.loadedCount === LEVEL_ARRAY.length) {
                        if (success) {
                            success();
                        }
                    }
                }), null, Loader.PREFAB)
            }
        }
    }

    public loadJson() {
        Laya.loader.load(JSONArr)
    }
}