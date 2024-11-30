/**屏幕设计宽 */
export const DESIGN_SCREEN_WIDTH = 750;
/**屏幕设计高 */
export const DESIGN_SCREEN_HEIGHT = 1624;

/**
 * 水果的级数
 */
export const LEVEL_MAP = {
    kiwifruitePre: 0,
    orangePre: 1,
    watermelonPre: 2,
    megranatePre: 3,
    cucumberPre: 4,
    pepperPre: 5,
    applePre: 6,
    tomatoPre: 7
}

/**
 * 级数对应的水果
 */
export const LEVEL_ARRAY = ['kiwifruitePre', 'orangePre', 'watermelonPre', 'megranatePre', 'cucumberPre', 'pepperPre', 'applePre', 'tomatoPre']

export const FRUITES_PRE_URL = 'prefabs/fruites/'

/**
 * 水果的出现几率
 */
export const POSSIBILITY_MAP = {
    tomatoPre: 0,
    applePre: 0,
    pepperPre: 0,
    cucumberPre: 0,
    megranatePre: 0,
    watermelonPre: 0.2,
    orangePre: 0.3,
    kiwifruitePre: 0.5,
}

/**
 * 水果的合成分数
 */
export const SCORE_ARRAY = [2, 4, 8, 16, 32, 64, 128, 256]

export const FRUITE_SPEED = 10

export const SCORE_IMG_URL = 'score/z'