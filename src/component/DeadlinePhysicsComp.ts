import { LEVEL_ARRAY, LEVEL_MAP } from "../define/ConstDefine";
import BoxCollider = Laya.BoxCollider;
import RigidBody = Laya.RigidBody;
import Script = Laya.Script;
import Image = Laya.Image;

export default class DeadlinePhysicsComp extends Script {
    public collider: BoxCollider;
    public rigidbody: RigidBody;
    private

    onAwake(): void {
        this.collider = this.owner.getComponent(BoxCollider);
        this.rigidbody = this.owner.getComponent(RigidBody);
    }

    onTriggerExit(other: any, self: any, contact: any): void {
        if (LEVEL_ARRAY.indexOf(other.label) !== -1) {
            Laya.stage.event('markAsInBottle', other.owner)
        }
    }
}