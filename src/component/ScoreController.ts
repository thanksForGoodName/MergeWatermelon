import { SCORE_IMG_URL } from "../define/ConstDefine";
import Box = Laya.Box;
import Image = Laya.Image;
import ResourceManager, { aniNames } from "../manager/ResourceManager";
const numWidth = 39;
export default class ScoreController extends Laya.Script {
    private scoreBox: Box;
    private textImgs: Image[] = [];
    private totalScore: number = 0;
    onAwake(): void {
        this.scoreBox = this.owner as Box;
        const url = `${SCORE_IMG_URL}0.png`;
        this.addNewNumChar(url, 0);
    }

    public setTextImg(num: number) {
        ResourceManager.instance(ResourceManager).playAnimationOnce(aniNames.mergeLight, this.scoreBox, 'glow', { x: this.scoreBox.pivotX - 80, y: this.scoreBox.pivotY - 80 });
        this.totalScore += num;
        const numStr = this.totalScore.toString();
        for (let i = 0; i < numStr.length; i++) {
            const url = `${SCORE_IMG_URL}${numStr[i]}.png`;
            if (this.textImgs[i]) {
                if (this.textImgs[i].skin !== url) {
                    this.textImgs[i].skin = url;
                }
            } else {
                this.addNewNumChar(url, i)
            }
        }
    }

    addNewNumChar(url: string, index: number) {
        this.textImgs.push(new Image(url));
        this.textImgs[index].pos(index * numWidth, 0);
        this.scoreBox.addChild(this.textImgs[index]);
        this.scoreBox.width = this.textImgs.length * numWidth;
        this.scoreBox.pivot(this.scoreBox.width / 2, this.scoreBox.height / 2)
    }
}