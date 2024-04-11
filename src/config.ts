import Phaser from "phaser";
import PreloadScene from "./scenes/preloadScene";
import TitleScene from "./scenes/TitleScene";
import GameUI from "./scenes/GameUI";
import GameOver from "./scenes/GameOver";
import MainScene from "./scenes/mainScene";
import Tutorial from "./scenes/Tutorial";
import Pause from "./scenes/Pause";
import MazeMap from "./scenes/MazeMap";
import WeaponDesign from "./scenes/WeaponDesign";

const DEFAULT_WIDTH = 512;
const DEFAULT_HEIGHT = 384;

export const CONFIG = {
    title: "My Untitled Phaser 3 Game",
    version: "0.0.1",
    type: Phaser.AUTO,
    backgroundColor: "#ffffff",
    scale: {
        parent: "phaser-game",
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
    },
    scene: [
        PreloadScene,
        TitleScene,
        Tutorial,
        MainScene,
        GameUI,
        GameOver,
        Pause,
        MazeMap,
        WeaponDesign,
    ],
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
    input: {
        keyboard: true,
        mouse: true,
        touch: true,
        gamepad: false,
    },
    render: {
        pixelArt: false,
        antialias: true,
    },
};
