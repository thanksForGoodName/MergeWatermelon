import { SCORE_IMG_URL } from "../define/ConstDefine";
import Box = Laya.Box;
import Image = Laya.Image;
import Sprite = Laya.Sprite;
import ResourceManager, { aniNames } from "../manager/ResourceManager";
const numWidth = 39;
export default class ScoreController extends Laya.Script {
    private scoreBox: Box;
    private textImgs: Image[] = [];
    private totalScore: number = 0;
    onAwake(): void {
        this.scoreBox = this.owner as Box;
    }

    public setTextImg(num: number) {
        ResourceManager.instance(ResourceManager).playAnimationOnce(aniNames.mergeLight, this.scoreBox, 'glow', { x: this.scoreBox.pivotX, y: this.scoreBox.pivotY });
        this.totalScore += num;
        const numStr = this.totalScore.toString();
        for (let i = 0; i < numStr.length; i++) {
            const url = `${SCORE_IMG_URL}${numStr[i]}.png`;
            if (this.textImgs[i]) {
                if (this.textImgs[i].skin !== url) {
                    this.textImgs[i].skin = url;
                }
            } else {
                this.textImgs.push(new Image(url));
                this.textImgs[i].pos(i * numWidth, 0);
                this.scoreBox.addChild(this.textImgs[i]);
                this.scoreBox.width = this.textImgs.length * numWidth;
                this.scoreBox.pivot(this.scoreBox.width / 2, this.scoreBox.height / 2)
            }
        }
    }
}