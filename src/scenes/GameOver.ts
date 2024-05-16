import Phaser from "phaser";
import FpsText from "../objects/fpsText";
import { sceneEvents } from "../events/eventsCenter";

export default class GameOver extends Phaser.Scene {
    fpsText: FpsText;

    constructor() {
        super({ key: "GameOver" });
    }

    create() {
        this.scene.stop("game-ui");

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
                0.8
            )
            .setOrigin(0.5)
            .setDepth(999);

        this.add
            .text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 3,
                "Game Over",
                {
                    fontSize: "35px",
                    fontFamily: "Academy Engraved LET",
                    strokeThickness: 6,
                    stroke: "0xffffff",
                    shadow: {
                        color: "#FF0000",
                        fill: true,
                        offsetX: 3,
                        offsetY: 3,
                        blur: 4,
                        stroke: false,
                    },
                    //strokeAlpha: 1
                }
            )
            .setOrigin(0.5)
            .setDepth(1000);

        const retry = this.add
            .text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 1.5 - 40,
                "Retry",
                {
                    fontSize: "22px",
                    fontFamily: "Academy Engraved LET",
                    strokeThickness: 4,
                    stroke: "0xffffff",
                }
            )
            .setOrigin(0.5)
            .setDepth(1000);

        retry.setInteractive();
        retry.on("pointerover", () => {
            retry.setFontSize("25px");
            retry.setShadow(1, 1, "#FFD300", 3, false, true);
        });
        retry.on("pointerout", () => {
            retry.setFontSize("22px");
            retry.setShadow(undefined);
        });
        retry.on("pointerdown", () => {
            this.scene.start("tutorial");
            sceneEvents.emit("gameRetry");
        });

        const goTitle = this.add
            .text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 1.5,
                "Return to Title",
                {
                    fontSize: "22px",
                    fontFamily: "Academy Engraved LET",
                    strokeThickness: 4,
                    stroke: "0xffffff",
                }
            )
            .setOrigin(0.5)
            .setDepth(1000);

        goTitle.setInteractive();
        goTitle.on("pointerover", () => {
            goTitle.setFontSize("25px");
            goTitle.setShadow(1, 1, "#FFD300", 3, false, true);
        });
        goTitle.on("pointerout", () => {
            goTitle.setFontSize("22px");
            goTitle.setShadow(undefined);
        });
        goTitle.on("pointerdown", () => {
            this.scene.stop();
            this.scene.stop("mainScene");
            this.scene.stop("game-ui");
            this.scene.start("TitleScene");
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
        map.createLayer("door", tileset) as Phaser.Tilemaps.TilemapLayer;
    }

    update() {
        this.fpsText.update();
    }
}
