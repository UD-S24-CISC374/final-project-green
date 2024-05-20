import Phaser from "phaser";
//import PhaserLogo from "../objects/phaserLogo";
import FpsText from "../objects/fpsText";
//import PreloadScene from "./preloadScene";
//background image by rawpixel.com
//audio for title scene by Darren Curtis
//Music by <a href="https://pixabay.com/users/ob-lix-17147719/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=8009">OB-LIX</a> from <a href=
//"https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=8009">Pixabay</a>
export default class TitleScene extends Phaser.Scene {
    fpsText: FpsText;

    constructor() {
        super({ key: "TitleScene" });
    }

    create() {
        this.fpsText = new FpsText(this);
        const background = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            "background"
        );
        let X = this.cameras.main.width / background.width;
        let Y = this.cameras.main.height / background.height;
        let scale = Math.max(X, Y);
        background.setScale(scale).setScrollFactor(0);
        background.setDepth(0);

        this.add
            .rectangle(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                this.cameras.main.width,
                this.cameras.main.height,
                0x000000,
                0.4
            )
            .setOrigin(0.5)
            .setDepth(999);

        this.add
            .text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 3,
                "Infamia di Creti",
                {
                    fontSize: "35px",
                    fontFamily: "Academy Engraved LET",
                    strokeThickness: 6,
                    stroke: "0xffffff",
                    //strokeAlpha: 1
                }
            )
            .setOrigin(0.5)
            .setDepth(1000);

        const easyMode = this.add
            .text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 1.5 - 20,
                "Easy Mode",
                {
                    fontSize: "20px",
                    fontFamily: "Academy Engraved LET",
                    strokeThickness: 4,
                    stroke: "0xffffff",
                    //strokeAlpha: 1
                }
            )
            .setOrigin(0.5)
            .setDepth(1000);

        easyMode.setInteractive();
        easyMode.on("pointerdown", () =>
            this.scene.start("tutorial", { isEasyMode: true })
        );

        easyMode.on("pointerover", () => {
            easyMode.setScale(1.1);
        });
        easyMode.on("pointerout", () => {
            easyMode.setScale();
        });

        const hardMode = this.add
            .text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 1.5 + 20,
                "Hard Mode",
                {
                    fontSize: "20px",
                    fontFamily: "Academy Engraved LET",
                    strokeThickness: 4,
                    stroke: "0xffffff",
                    //strokeAlpha: 1
                }
            )
            .setOrigin(0.5)
            .setDepth(1000);

        hardMode.setInteractive();
        hardMode.on("pointerdown", () =>
            this.scene.start("tutorial", { isEasyMode: false })
        );

        hardMode.on("pointerover", () => {
            hardMode.setScale(1.1);
        });
        hardMode.on("pointerout", () => {
            hardMode.setScale();
        });

        this.add.image(0, 0, "base_tiles");
        const map = this.make.tilemap({ key: "tilemap" });
        const tileset = map.addTilesetImage(
            "dungeon",
            "base_tiles",
            16,
            16
        ) as Phaser.Tilemaps.Tileset;

        map.createLayer("ground", tileset);
        map.createLayer("wall", tileset) as Phaser.Tilemaps.TilemapLayer;
        map.createLayer("door-open", tileset) as Phaser.Tilemaps.TilemapLayer;

        let music = this.sound.add("titleScene");
        music.loop = true;
        music.play();
        music.setVolume(1);
    }

    update() {
        this.fpsText.update();
    }
}
