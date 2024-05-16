import Phaser from "phaser";
import { sceneEvents } from "../events/eventsCenter";

export default class MazeMap extends Phaser.Scene {
    private ariadne: Phaser.GameObjects.Image;
    private textBox: Phaser.GameObjects.Rectangle;
    private currentIndex: number;
    private ariadneText: Phaser.GameObjects.Text;
    private ariadneTextOptions: string[];
    private nextButton: Phaser.GameObjects.Image;
    private prevButton: Phaser.GameObjects.Image;
    private bowAndItemGet = false;
    private instructionEnd = false;

    constructor() {
        super({ key: "instructions" });
    }

    init(data: { currentIndex: number }) {
        this.currentIndex = data.currentIndex;
    }

    create() {
        this.ariadneTextOptions = [
            "Thank goodness you came Theseus!",
            "The minotaur at the center of the maze has been plaguing my people for years.",
            "If you were able to make it to the center of the maze and defeat the minotaur, you would be the hero of Crete!",
            "I got this bow and item for you.",
            "Oh, you don't know how to use it?\nDon't worry it's not that hard.",
            "I gave you an item that can increase the damage of bow, so let's try using it.",
            "Try pressing E once to see what you have!",
            "If you drag item in the box below, it will show you a box where you can write some code to upgrade your weapon.",
            "First, we should get bow from theseus file to upgrade it.",
            "Try clicking the arrow button on the top so that you can look through theseus file.",
            "We can find lots of code, but we need only one, getBow(), to use our item.",
            "Let's type it to the box!\nDon't forget you need a dot before to use code.",
            "Okay! Then we need another code that can access to the damage of the bow.",
            "Let's move to bow file.",
            "As you can see, there is incDamage() code that will increase the damage of the bow.",
            "Let's return to main file and write the code.\nAgain, don't forget you need a dot before to use code.",
            "If you press ENTER key.... \nitem should be successfully used!",
            "If it did not, try going back the dialogues and write it again.",
            "It seems you're ready... Good Luck Theseus!",
        ];

        this.ariadne = this.add
            .image(
                this.cameras.main.width - 50,
                this.cameras.main.height - 120,
                "Ariadne"
            )
            .setDepth(1000);

        this.textBox = this.add
            .rectangle(
                this.cameras.main.width / 2,
                this.cameras.main.height * 0.85 - 60,
                this.cameras.main.width * 0.9,
                this.cameras.main.height * 0.2,
                0x000000,
                0.7
            )
            .setOrigin(0.5)
            .setDepth(999);

        this.ariadneText = this.add
            .text(
                this.cameras.main.width * 0.1,
                this.cameras.main.height * 0.8 - 60,
                this.ariadneTextOptions[this.currentIndex],
                {
                    fontSize: "12px",
                    color: "#fff",
                    wordWrap: { width: this.cameras.main.width * 0.7 },
                }
            )
            .setDepth(1000);

        this.nextButton = this.add
            .image(
                this.cameras.main.width * 0.8,
                this.cameras.main.height * 0.9 - 60,
                "ArrowButton"
            )
            .setDepth(1000);

        this.nextButton.setInteractive();

        this.nextButton.on("pointerdown", this.handleNextText, this);

        this.nextButton.on("pointerover", () => {
            this.nextButton.setScale(1.2);
        });
        this.nextButton.on("pointerout", () => {
            this.nextButton.setScale();
        });

        this.prevButton = this.add
            .image(
                this.cameras.main.width * 0.77,
                this.cameras.main.height * 0.9 - 60,
                "ArrowButton"
            )
            .setDepth(1000);
        this.prevButton.scaleX = -1;

        this.prevButton.setInteractive();

        this.prevButton.on("pointerdown", this.handlePrevText, this);

        this.prevButton.on("pointerover", () => {
            this.prevButton.setScale(1.2);
            this.prevButton.scaleX = -1;
        });
        this.prevButton.on("pointerout", () => {
            this.prevButton.setScale();
            this.prevButton.scaleX = -1;
        });

        this.events.on("shutdown", () => {
            sceneEvents.emit("update-index", this.currentIndex);
        });

        this.events.once("item-setup", () => {
            this.nextButton
                .setActive(this.bowAndItemGet)
                .setVisible(this.bowAndItemGet);
            this.prevButton
                .setActive(this.bowAndItemGet)
                .setVisible(this.bowAndItemGet);
        });

        sceneEvents.on("bowItemGet", () => {
            this.nextButton.setActive(true).setVisible(true);
            this.prevButton.setActive(true).setVisible(true);
            this.bowAndItemGet = true;
        });

        sceneEvents.on("ready", () => {
            this.instructionEnd = true;
        });

        sceneEvents.on("not-main", this.handleTextbox, this);
        sceneEvents.on("in-main", this.handleMainTextbox, this);
    }

    private handleNextText() {
        if (this.currentIndex === 2) {
            sceneEvents.emit("bowAndItem");
            this.events.emit("item-setup");
        }
        this.currentIndex++;
        if (this.currentIndex < this.ariadneTextOptions.length) {
            this.ariadneText.setText(
                this.ariadneTextOptions[this.currentIndex]
            );
        } else {
            if (this.instructionEnd) {
                this.ariadneText.setVisible(false);
                this.ariadne.setVisible(false);
                this.textBox.setVisible(false);
                this.prevButton.setActive(false).setVisible(false);
                this.nextButton.setActive(false).setVisible(false);
            }
            this.currentIndex = this.ariadneTextOptions.length - 1;
        }
    }

    private handlePrevText() {
        this.currentIndex--;
        if (this.currentIndex >= 0) {
            this.ariadneText.setText(
                this.ariadneTextOptions[this.currentIndex]
            );
        } else {
            this.currentIndex = 0;
        }
    }

    private handleTextbox() {
        this.ariadne.setPosition(
            this.cameras.main.width - 50,
            this.cameras.main.height - 260
        );
        this.textBox
            .setPosition(
                (this.cameras.main.width * 3) / 5 + 50,
                this.cameras.main.height * 0.85 - 200
            )
            .setSize(
                this.cameras.main.width * 0.5,
                this.cameras.main.height * 0.4
            );
        this.ariadneText
            .setPosition(
                this.cameras.main.width * 0.5 - 10,
                this.cameras.main.height * 0.8 - 220
            )
            .setStyle({
                wordWrap: { width: this.cameras.main.width * 0.4 - 20 },
            });
        this.nextButton.setPosition(
            this.ariadne.x + 8,
            this.cameras.main.height * 0.9 - 180
        );
        this.prevButton.setPosition(
            this.ariadne.x - 12,
            this.cameras.main.height * 0.9 - 180
        );
    }

    private handleMainTextbox() {
        this.ariadne.setPosition(
            this.cameras.main.width - 50,
            this.cameras.main.height - 120
        );
        this.textBox
            .setPosition(
                this.cameras.main.width / 2,
                this.cameras.main.height * 0.85 - 60
            )
            .setSize(
                this.cameras.main.width * 0.9,
                this.cameras.main.height * 0.2
            );
        this.ariadneText
            .setPosition(
                this.cameras.main.width * 0.1,
                this.cameras.main.height * 0.8 - 60
            )
            .setStyle({ wordWrap: { width: this.cameras.main.width * 0.7 } });
        this.nextButton.setPosition(
            this.cameras.main.width * 0.8,
            this.cameras.main.height * 0.9 - 60
        );
        this.prevButton.setPosition(
            this.cameras.main.width * 0.77,
            this.cameras.main.height * 0.9 - 60
        );
    }
}
