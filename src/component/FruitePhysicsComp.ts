import { LEVEL_ARRAY, LEVEL_MAP, SCORE_ARRAY } from "../define/ConstDefine";
import CircleCollider = Laya.CircleCollider;
import RigidBody = Laya.RigidBody;
import Script = Laya.Script;
import Image = Laya.Image;
import Box = Laya.Box;
import Point = Laya.Point;
import Handler = Laya.Handler;
import Ease = Laya.Ease;
import { EventDef } from "../define/EventDefine";
import { JsonResDef } from "../define/UIDefine";


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
            Laya.Dialog.open(JsonResDef.overGameDialog)
        }
    }

    onTriggerEnter(other: CircleCollider, self: CircleCollider, contact: any): void {
        if (other.label === self.label) {
            if (!other.owner || !self.owner) {
                return;
            }
            Laya.stage.event(EventDef.RELEASE_CONTROLING_OBJ, self.owner);
            Laya.stage.event(EventDef.RELEASE_CONTROLING_OBJ, other.owner);
            const otherFruite = other.owner as Image;
            const selfFruite = self.owner as Image;
            const label = other.label.slice(0, other.label.length);
            const radius = self.radius;
            other.owner.getComponent(RigidBody).destroy();
            self.owner.getComponent(RigidBody).destroy();
            other.owner.getComponent(CircleCollider).destroy();
            self.owner.getComponent(CircleCollider).destroy();
            Laya.stage.event(EventDef.CHECK_CONTINUE_TIMES);
            this.mergeFruite(otherFruite, selfFruite, label, radius);
        }
    }

    mergeFruite(other: Image, self: Image, label: string, radius: number) {
        if (!other || !self) {
            return;
        }
        const pos = this.calculateTriggerPoint({ x: other.x, y: other.y }, { x: self.x, y: self.y }, radius);
        const level = (LEVEL_MAP[label] + 1) < LEVEL_ARRAY.length ? LEVEL_MAP[label] + 1 : LEVEL_MAP[label];
        Laya.stage.event(EventDef.ADD_BLOOM_ANI, [level, { x: pos.x, y: pos.y }]);

        Laya.Tween.to(other, { x: pos.x, y: pos.y, scaleX: 0.8, scaleY: 0.8 }, 200, Ease.elasticInOut, Handler.create(this, () => {
            other.removeSelf();
            Laya.stage.event(EventDef.REMOVE_FROM_BOTTLE, other)
            Laya.stage.event(EventDef.CREATE_FRUITE, [level, pos, false]);
            Laya.stage.event(EventDef.ADD_SCORE, SCORE_ARRAY[level]);
        }))
        Laya.Tween.to(self, { x: pos.x, y: pos.y, scaleX: 0.8, scaleY: 0.8 }, 200, Ease.elasticInOut, Handler.create(this, () => {
            self.removeSelf();
            Laya.stage.event(EventDef.REMOVE_FROM_BOTTLE, self)
        }))
    }

    calculateTriggerPoint(otherPos: { x: number, y: number }, selfPos: { x: number, y: number }, radius: number): { x: number, y: number } {
        const vector = new Point(
            otherPos.x - selfPos.x, otherPos.y - selfPos.y
        );
        vector.normalize();

        const pos = { x: selfPos.x + radius * vector.x, y: selfPos.y + radius * vector.y }
        return pos;
    }
}