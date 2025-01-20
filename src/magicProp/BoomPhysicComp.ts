import { AniSize } from "../define/UIDefine";
import Sprite = Laya.Sprite;
import Image = Laya.Image;
import RigidBody = Laya.RigidBody;
import CircleCollider = Laya.CircleCollider;
import { LEVEL_ARRAY } from "../define/ConstDefine";
import { EventDef } from "../define/EventDefine";

export default class BoomPhysicComp extends Laya.Script {
    private circleCollider: CircleCollider;
    private rigidBody: RigidBody;
    onAwake(): void {
        this.circleCollider = (this.owner as Sprite).getComponent(CircleCollider) ?
            (this.owner as Sprite).getComponent(CircleCollider) :
            (this.owner as Sprite).addComponent(CircleCollider) as CircleCollider;
        this.circleCollider.radius = AniSize.boom / 2;
        this.circleCollider.label = 'props';
        this.rigidBody = (this.owner as Sprite).getComponent(RigidBody) ?
            (this.owner as Sprite).getComponent(RigidBody) as RigidBody :
            (this.owner as Sprite).addComponent(RigidBody) as RigidBody;
    }

    onTriggerEnter(other: any, self: any, contact: any): void {
        //如果炸弹炸上了水果
        if (LEVEL_ARRAY.indexOf(other.label) !== -1) {
            other.owner.removeSelf();
            Laya.stage.event(EventDef.REMOVE_FROM_BOTTLE, other.owner as Image)
        }
    }
}