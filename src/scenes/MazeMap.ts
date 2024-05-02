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
        //Make black background.

        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 1); // Set fill style to black with 100% alpha
        graphics.fillRect(
            0,
            0,
            this.cameras.main.width,
            this.cameras.main.height
        );
        graphics.setDepth(1000); // Set depth to ensure it's behind other elements

        //Code to make each square tie to a room.
        const changeRooms = (sceneKey: string) => {
            console.log("Changing rooms to:", sceneKey);
            this.scene.stop();
            this.scene.start(sceneKey, {
                threads: 5 - this.usedThreads,
                currentScene: "maze-map",
                previous: this.scene.key,
            });
        };

        //Title that says Map

        this.add
            .text(
                this.cameras.main.width - 250,
                this.cameras.main.height / 5,
                "Map of the Maze",
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

        //The rectangle for the overall map.
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

        //Blue rectangle - outline
        outline.lineStyle(1.5, 0x000000, 1); // Set line style: width, color (black), and alpha (opacity)
        outline.strokeRect(
            mapRect.x + mapRect.width * 0.75,
            mapRect.y - mapRect.height * 0.45,
            mapRect.width * 0.1,
            mapRect.height * 0.1
        );

        const Room1 = this.add
            //Blue rectangle - Room1
            .rectangle(
                mapRect.x + mapRect.width * 0.8,
                mapRect.y - mapRect.height * 0.4,
                mapRect.width * 0.1,
                mapRect.height * 0.1,
                0x0033ff,
                //0xffffff, - the white hex code
                0.7
            )
            .setDepth(1008);

        const originalScale = Room1.scaleX;

        const outline1 = this.add.graphics();
        outline1.setDepth(1007);

        Room1.on("pointerdown", () => {
            if (this.previous === "mainRoom") {
                changeRooms("Room1");
            }
        });
        Room1.on("pointerdown", () => {
            if (this.previous === "Room2") {
                changeRooms("Room1");
            }
        });

        Room1.on("pointerover", () => {
            Room1.setScale(originalScale * 1.1);
        });

        Room1.on("pointerout", () => {
            Room1.setScale(originalScale);
        });

        //Red rectangle - outline
        outline1.lineStyle(1.5, 0x000000, 1); // Set line style: width, color (black), and alpha (opacity)
        outline1.strokeRect(
            mapRect.x + mapRect.width * 0.15,
            mapRect.y - mapRect.height * 0.45,
            mapRect.width * 0.1,
            mapRect.height * 0.1
        );

        const mainRoom = this.add
            //Red rectangle - MainScene
            .rectangle(
                mapRect.x + mapRect.width * 0.2,
                mapRect.y - mapRect.height * 0.4,
                mapRect.width * 0.1,
                mapRect.height * 0.1,
                0xff0000,
                //0xffffff, - white hex code
                0.7
            )
            .setDepth(1006);

        //if the user clicks on mainRoom from Room1 they can go to it.
        mainRoom.on("pointerdown", () => {
            if (this.previous === "Room1") {
                changeRooms("mainRoom");
            }
        });

        //Pink rectangle - outline
        outline1.lineStyle(1.5, 0x000000, 1); // Set line style: width, color (black), and alpha (opacity)
        outline1.strokeRect(
            mapRect.x + mapRect.width * 0.15,
            mapRect.y - mapRect.height * 0.85,
            mapRect.width * 0.1,
            mapRect.height * 0.1
        );

        const Room3 = this.add
            //Pink rectangle - Room3
            .rectangle(
                mapRect.x + mapRect.width * 0.2,
                mapRect.y - mapRect.height * 0.8,
                mapRect.width * 0.1,
                mapRect.height * 0.1,
                0xff69b4,
                //0xffffff, - white hex code
                0.7
            )
            .setDepth(1006);

        Room3.on("pointerdown", () => {
            if (this.previous === "mainRoom") {
                changeRooms("Room3");
            }
        });

        Room3.on("pointerdown", () => {
            if (this.previous === "Room2") {
                changeRooms("Room3");
            }
        });

        //Purple rectangle - outline
        outline.lineStyle(1.5, 0x000000, 1); // Set line style: width, color (black), and alpha (opacity)
        outline.strokeRect(
            mapRect.x + mapRect.width * 0.75,
            mapRect.y - mapRect.height * 0.85,
            mapRect.width * 0.1,
            mapRect.height * 0.1
        );

        const Room2 = this.add
            //Purple rectangle - Room2
            .rectangle(
                mapRect.x + mapRect.width * 0.8,
                mapRect.y - mapRect.height * 0.8,
                mapRect.width * 0.1,
                mapRect.height * 0.1,
                0x800080,
                //0xffffff, - the white hex code
                0.7
            )
            .setDepth(1006);

        Room2.on("pointerdown", () => {
            if (this.previous === "Room3") {
                changeRooms("Room2");
            }
        });

        //Black rectangle - outline
        outline.lineStyle(1.5, 0x000000, 1); // Set line style: width, color (black), and alpha (opacity)
        outline.strokeRect(
            mapRect.x + mapRect.width * 0.45,
            mapRect.y - mapRect.height * 0.65,
            mapRect.width * 0.1,
            mapRect.height * 0.1
        );

        const minotaurRoom = this.add
            //Black rectangle - Minotaur Room
            .rectangle(
                mapRect.x + mapRect.width * 0.5,
                mapRect.y - mapRect.height * 0.6,
                mapRect.width * 0.1,
                mapRect.height * 0.1,
                0x000000,
                //0xffffff, - the white hex code
                0.7
            )
            .setDepth(1006);

        minotaurRoom.on("pointerdown", () => {
            if (this.previous === "Room3") {
                changeRooms("minotaurRoom");
            }
        });

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
            this.scene.start(this.previous);
        });

        this.input.keyboard?.on("keydown-M", () => {
            this.scene.stop();
            this.scene.resume(this.previous);
        });
    }
}
