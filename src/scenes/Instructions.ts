import Phaser from "phaser";

export default class MazeMap extends Phaser.Scene {
    private usedThreads: number;
    private previous: string;

    constructor() {
        super({ key: "instructions" });
    }

    init(data: { threads: number; currentScene: string }) {
        this.usedThreads = 5 - data.threads;
        this.previous = data.currentScene;
    }

    create() {
        //Shape of instructions
        this.add
            .rectangle(
                this.cameras.main.width - 485,
                this.cameras.main.height - 20,
                this.cameras.main.width * 0.9,
                this.cameras.main.height * 0.9,
                0xffffff,
                0.8
            )
            .setOrigin(0, 1)
            .setDepth(1005);

        // instructionButton.text(
        //     this.cameras.main.width / 2,
        //     this.cameras.main.height / 1.5,
        //     "I",
        //     {
        //         fontSize: "20px",
        //         fontFamily: "Academy Engraved LET",
        //         strokeThickness: 4,
        //         stroke: "0xffffff",
        //         //strokeAlpha: 1
        //     }
        // )
        // .setOrigin(0.5)
        // .setDepth(1000);

        this.add
            .text(
                this.cameras.main.width - 250,
                this.cameras.main.height / 10,
                "Instructions",
                {
                    fontSize: "30px",
                    fontFamily: "Academy Engraved LET",
                    strokeThickness: 6,
                    stroke: "0xffffff",
                    //strokeAlpha: 1
                }
            )
            .setOrigin(0.5)
            .setDepth(1008);

        const instructionTextOptions = [
            "When an skeleton dies, it may drop one of eight items.",
            // "Four of the items change the type of bow or sword you have.",
            "Sword with fire: Changes sword to fire type | Sword with ice: Changes sword to ice type.",
            "Bow with a green mask: Changes bow to poison type. | Bow with a E: Changes bow to triple type.",
            "The other four items increase the speed or strength of your bow or sword.",
            "A sword with a blue star: Increases the speed of the sword.",
            "A sword with a orange star: Increases the damage dealt by the sword.",
            "A bow with a blue star: Increases the speed of the bow.",
            "A bow with a orange star: Increases the damage dealt by the bow.",
            "Once you have collected an item, it will show up in your weapon design (press E). ",
            "The item will appear on the right hand side, and you must drag it into the box on the main.java.",
            "This will cause a text box to appear and using the classes provided for Theseus, Bow",
            "and the Sword you must write a line of code that executes the item.",
            "For instance, if you collected a sword with a fire item, you would write in",
            "the text box - .getSword().getType('fire');",
            "Please use double quotes instead of single quotes though.",
        ];

        this.add
            .text(
                this.cameras.main.width - 250,
                this.cameras.main.height - 180,
                instructionTextOptions,
                {
                    fontSize: "8 px",
                    fontFamily: "American Typewriter",
                    strokeThickness: 3,
                    stroke: "0xffffff",
                    align: "left", // Or 'center' or 'right' for alignment
                    lineSpacing: 6,
                }
            )
            .setOrigin(0.5)
            .setDepth(1008);

        // Close button that will return to the game screen
        const close = this.add
            .text(this.cameras.main.width - 50, 40, "X", {
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
            this.scene.start(this.previous);
        });

        this.input.keyboard?.on("keydown-I", () => {
            this.scene.stop();
            this.scene.resume(this.previous);
        });
    }
}
