import Phaser from "phaser";

export default class MazeMap extends Phaser.Scene {
    private usedThreads: number;
    private previous: string;

    constructor() {
        super({ key: "maze-map" });
    }

    init(data: { threads: number; currentScene: string }) {
        this.usedThreads = 5 - data.threads;
        this.previous = data.currentScene;
    }

    create() {
        const mapRect = this.add
            .rectangle(
                this.cameras.main.width - 380,
                this.cameras.main.height - 100,
                this.cameras.main.width * 0.5,
                this.cameras.main.height * 0.5,
                0x333333,
                1
            )
            .setOrigin(0, 1)
            .setDepth(1005);

        const outline = this.add.graphics();
        outline.setDepth(1007);

        outline.lineStyle(1.5, 0x000000, 1); // Set line style: width, color (black), and alpha (opacity)
        outline.strokeRect(
            mapRect.x + mapRect.width * 0.2,
            mapRect.y - mapRect.height * 0.3,
            mapRect.width * 0.1,
            mapRect.height * 0.1
        );

        this.add
            .rectangle(
                mapRect.x + mapRect.width * 0.25,
                mapRect.y - mapRect.height * 0.25,
                mapRect.width * 0.1,
                mapRect.height * 0.1,
                0xffffff,
                0.7
            )
            .setDepth(1006);

        const outline1 = this.add.graphics();
        outline1.setDepth(1007);

        outline1.lineStyle(1.5, 0x000000, 1); // Set line style: width, color (black), and alpha (opacity)
        outline1.strokeRect(
            mapRect.x + mapRect.width * 0.3,
            mapRect.y - mapRect.height * 0.45,
            mapRect.width * 0.1,
            mapRect.height * 0.1
        );

        this.add
            .rectangle(
                mapRect.x + mapRect.width * 0.35,
                mapRect.y - mapRect.height * 0.4,
                mapRect.width * 0.1,
                mapRect.height * 0.1,
                0xffffff,
                0.7
            )
            .setDepth(1006);

        // Close button that will return to the game screen
        const close = this.add
            .text(this.cameras.main.width - 125, 95, "X", {
                fontSize: "22px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 6,
                stroke: "0xffffff",
                //strokeAlpha: 1
            })
            .setOrigin(0.5)
            .setDepth(1005);

        close.setInteractive();
        close.on("pointerover", () => {
            close.setFontSize("27px");
        });
        close.on("pointerout", () => {
            close.setFontSize("25px");
        });
        close.on("pointerdown", () => {
            this.scene.stop();
            this.scene.resume(this.previous);
        });

        this.input.keyboard?.on("keydown-M", () => {
            this.scene.stop();
            this.scene.resume(this.previous);
        });
    }
}
