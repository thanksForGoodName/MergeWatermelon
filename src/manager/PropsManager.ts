import { EventDef } from "../define/EventDefine";
import { PropsName } from "../define/PropsDef";
import BaseProp from "../magicProp/BaseProp";
import Singleton from "../util/Single";
import Boom from "../magicProp/Boom";

export default class PropsManager extends Singleton<PropsManager> {
    private propsMap: Map<PropsName, BaseProp[]>;
    private chosenProp: Map<PropsName, number>;


    init() {
        Laya.timer.loop(2000, this, this.createProp, [PropsName.boom, Boom])
    }

    getLeftPropNum(name: string | PropsName) {
        const choseNum = this.chosenProp ? Number(this.chosenProp.get(name as PropsName)) : 0;
        return this.propsMap.get(name as PropsName).length - choseNum;
    }

    getAllPropNum(name: string | PropsName) {
        return this.propsMap.get(name as PropsName).length;
    }

    createProp<T extends BaseProp>(name: PropsName, propType: new (name) => T) {
        if (!this.propsMap) {
            this.propsMap = new Map<PropsName, BaseProp[]>();
        }

        const prop = new propType(name);
        if (!this.propsMap.get(name)) {
            this.propsMap.set(name, []);
        }
        this.propsMap.get(name).push(prop);
        prop.showUINode(this.getLeftPropNum(name));

    }

    chooseProp(name: string | PropsName) {
        if (!this.chosenProp) {
            this.chosenProp = new Map<PropsName, number>();
        }
        this.chosenProp.set(name as PropsName, 1);

        const prop = this.propsMap.get(name as PropsName)[0];
        prop.showUINode(this.getLeftPropNum(name));

    }

    unchooseProp(name: string | PropsName) {
        if (!this.chosenProp) {
            this.chosenProp = new Map<PropsName, number>();
        }
        this.chosenProp.set(name as PropsName, 0);
        const prop = this.propsMap.get(name as PropsName)[0];
        prop.showUINode(this.getLeftPropNum(name));
    }

    useProp(name: string | PropsName) {
        const prop = this.propsMap.get(name as PropsName).pop();
        this.chosenProp.set(name as PropsName, 0);
        prop.showUINode(this.getLeftPropNum(name));
        prop.useProp();
    }

}