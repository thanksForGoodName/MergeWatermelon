import { JsonResDef } from "../define/UIDefine";
import BoxCollider = Laya.BoxCollider;
import RigidBody = Laya.RigidBody;
import Script = Laya.Script;
import Box = Laya.Box;
import { LEVEL_ARRAY } from "../define/ConstDefine";

export default class BottlePhysicsComp extends Script {

    public colliderSpace: BoxCollider;
    public colliderEdges: BoxCollider[] = [];
    public rigidbody: RigidBody;
    private box: Box;

    onAwake(): void {
        this.box = this.owner as Box;
        this.box.scaleY = this.box.scaleX = ((this.box.parent.parent) as Box).scaleX;
        const colliders = this.owner.getComponents(BoxCollider) as BoxCollider[];
        for (let i = 0; i < colliders.length; i++) {
            if (colliders[i].label === 'bottleSpace') {
                this.colliderSpace = colliders[i];
            } else {
                this.colliderEdges.push(colliders[i]);
            }
        }
        this.box.y *= this.box.scaleX;
    }

    onTriggerExit(other: any, self: any, contact: any): void {
        if (other.label === 'bottleSpace' || self.label === 'bottleSpace') {
            if (!Laya.Dialog.manager || !Laya.Dialog.manager.getChildByName('OverGameDialog')) {
                Laya.Dialog.open(JsonResDef.overGameDialog)
            }
        }
    }

    onTriggerEnter(other: any, self: any, contact: any): void {
        if (other.label === 'bottleSpace' || self.label === 'bottleSpace') {
            if (LEVEL_ARRAY.indexOf(other.label) !== -1) {
                Laya.stage.event('markAsInBottle', other.owner)
            }
        }
    }

}
