import { LEVEL_ARRAY, LEVEL_MAP, SCORE_ARRAY } from "../define/ConstDefine";
import CircleCollider = Laya.CircleCollider;
import RigidBody = Laya.RigidBody;
import Script = Laya.Script;
import Image = Laya.Image;
import Box = Laya.Box;
import Point = Laya.Point;
import Handler = Laya.Handler;
import Ease = Laya.Ease;
import ResourceManager, { aniNames } from "../manager/ResourceManager";


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

    onUpdate(): void {
        this.checkOutStatus();
    }

    checkOutStatus() {
        if (this.fruite.y >= Laya.stage.height) {
            this.fruite.removeSelf();
            this.fruite.destroy();
            console.log('水果掉出瓶子之外了，销毁');
        }
    }

    onTriggerEnter(other: CircleCollider, self: CircleCollider, contact: any): void {
        if (other.label === self.label) {
            if (!other.owner || !self.owner) {
                return;
            }
            Laya.stage.event('releaseControllingObj', self.owner);
            Laya.stage.event('releaseControllingObj', other.owner);
            const otherFruite = other.owner as Image;
            const selfFruite = self.owner as Image;
            const label = other.label.slice(0, other.label.length);
            const radius = self.radius;
            other.owner.getComponent(RigidBody).destroy();
            self.owner.getComponent(RigidBody).destroy();
            other.owner.getComponent(CircleCollider).destroy();
            self.owner.getComponent(CircleCollider).destroy();
            this.mergeFruite(otherFruite, selfFruite, label, radius);
        }
    }

    mergeFruite(other: Image, self: Image, label: string, radius: number) {
        if (!other || !self) {
            return;
        }
        const pos = this.calculateTriggerPoint(other, self, radius);
        const level = (LEVEL_MAP[label] + 1) < LEVEL_ARRAY.length ? LEVEL_MAP[label] + 1 : LEVEL_MAP[label];
        Laya.stage.event('addMergeGlow', pos);

        Laya.Tween.to(other, { x: pos.x, y: pos.y }, 50, Ease.expoOut, Handler.create(this, () => {
            other.removeSelf();
            Laya.stage.event('createFruite', [level, pos, false]);
            Laya.stage.event('addScore', SCORE_ARRAY[level]);
        }))
        Laya.Tween.to(self, { x: pos.x, y: pos.y }, 50, Ease.expoOut, Handler.create(this, () => {
            self.removeSelf();
        }))
    }

    calculateTriggerPoint(other: Image, self: Image, radius: number): { x: number, y: number } {
        if (!other || !self) {
            return;
        }
        const vector = new Point(
            other.x - self.x, other.y - self.y
        );
        vector.normalize();

        const pos = { x: self.x + radius * vector.x, y: self.y + radius * vector.y }
        return pos;
    }
}