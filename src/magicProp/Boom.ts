import { AniNames, AniSize } from "../define/UIDefine";
import ResourceManager from "../manager/ResourceManager";
import BaseProp from "./BaseProp";
import BoomPhysicComp from "./BoomPhysicComp";

export default class Boom extends BaseProp {

    useProp(x: number, y: number): void {
        super.useProp(x, y);
        const boomAni = ResourceManager.instance(ResourceManager).playAnimationOnce({
            aniName: AniNames.boom,
            parent: Laya.stage,
            playName: 'boom',
            pos: { x, y },
            size: { width: AniSize.boom, height: AniSize.boom },
            pivot: { pivotX: AniSize.boom / 2, pivotY: AniSize.boom / 2 }
        });

        if (!boomAni.getComponent(BoomPhysicComp)) {
            boomAni.addComponent(BoomPhysicComp) as BoomPhysicComp;
        }

    }
}