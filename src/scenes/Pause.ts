import Phaser from "phaser";
import { sceneEvents } from "../events/eventsCenter";

export default class Pause extends Phaser.Scene {
    private previous: string;

    constructor() {
        super({ key: "pause" });
    }

    init(data: { currentScene: string }) {
        this.previous = data.currentScene;
    }

    create() {
        this.add
            .rectangle(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                this.cameras.main.width,
                this.cameras.main.height,
                0x000000,
                0.7
            )
            .setOrigin(0.5)
            .setDepth(999);

        this.add
            .text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 3,
                "Paused",
                {
                    fontSize: "35px",
                    fontFamily: "Academy Engraved LET",
                    strokeThickness: 6,
                    stroke: "0xffffff",
                }
            )
            .setOrigin(0.5)
            .setDepth(1000);

        const resume = this.add
            .text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 1.5 - 40,
                "Resume",
                {
                    fontSize: "15px",
                    fontFamily: "Academy Engraved LET",
                    strokeThickness: 4,
                    stroke: "0xffffff",
                }
            )
            .setOrigin(0.5)
            .setDepth(1000);

        resume.setInteractive();
        resume.on("pointerover", () => {
            resume.setFontSize("17px");
            resume.setShadow(1, 1, "#FFD300", 3, false, true);
        });
        resume.on("pointerout", () => {
            resume.setFontSize("15px");
            resume.setShadow(undefined);
        });
        resume.on("pointerdown", () => {
            this.scene.stop();
            this.scene.resume(this.previous, { previous: "pause" });
        });

        const restart = this.add
            .text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 1.5,
                "Quit the Game",
                {
                    fontSize: "15px",
                    fontFamily: "Academy Engraved LET",
                    strokeThickness: 4,
                    stroke: "0xffffff",
                }
            )
            .setOrigin(0.5)
            .setDepth(1000);

        restart.setInteractive();
        restart.on("pointerover", () => {
            restart.setFontSize("17px");
            restart.setShadow(1, 1, "#FFD300", 3, false, true);
        });
        restart.on("pointerout", () => {
            restart.setFontSize("15px");
            restart.setShadow(undefined);
        });
        restart.on("pointerdown", () => {
            this.scene.stop();
            if (this.previous === "mainScene") {
                this.scene.stop("mainScene");
            } else if (this.previous === "tutorial") {
                this.scene.stop("tutorial");
            } else if (this.previous === "minotaur") {
                this.scene.stop("minotaur");
            }
            this.scene.stop("game-ui");
            this.scene.start("TitleScene");
            sceneEvents.emit("gameRetry");
        });

        this.input.keyboard?.on("keydown-ESC", () => {
            this.scene.stop();
            this.scene.resume(this.previous, { previous: "pause" });
        });
    }
}
