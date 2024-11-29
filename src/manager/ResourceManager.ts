import Singleton from "../util/Single";
import Prefab = Laya.Prefab;
import Loader = Laya.Loader;
import Handler = Laya.Handler;
import { FRUITES_PRE_URL, LEVEL_ARRAY } from "../define/ConstDefine";

export default class ResourceManager extends Singleton<ResourceManager> {
    public prefabsMap: Map<string, Prefab>;
    private loadedCount: number = 0;
    constructor() {
        super();
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
}