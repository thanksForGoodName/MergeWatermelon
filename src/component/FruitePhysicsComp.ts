import { FRUITE_SPEED, LEVEL_ARRAY, LEVEL_MAP } from "../define/ConstDefine";
import CircleCollider = Laya.CircleCollider;
import RigidBody = Laya.RigidBody;
import Script = Laya.Script;
import Image = Laya.Image;
import Box = Laya.Box;
import Point = Laya.Point;

export default class FruitePhysicsComp extends Script {

    public collider: CircleCollider;
    public rigidbody: RigidBody;
    private fruite: Image;

    onAwake(): void {
        this.fruite = this.owner as Image;
        this.collider = this.owner.getComponent(CircleCollider);
        this.rigidbody = this.owner.getComponent(RigidBody);
        this.collider.radius *= (this.fruite.parent as Box).scaleX;
    }


    onTriggerEnter(other: any, self: any, contact: any): void {
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

    calculateTriggerPoint(other, self): { x: number, y: number } {
        if (!other.owner || !self.owner) {
            return;
        }
        const vector = new Point(
            other.owner.x - self.owner.x, other.owner.y - self.owner.y
        );
        vector.normalize();

        const pos = { x: self.owner.x + self.radius * vector.x, y: self.owner.y + self.radius * vector.y }
        return pos;
    }
}