import Phaser from "phaser";
import { createWeaponDesignScreen } from "../screen/weaponDesignTexts";
// import { sceneEvents } from "../events/eventsCenter";

export default class WeaponDesign extends Phaser.Scene {
    private fileList = ["Main", "Theseus", "Sword", "Bow"];
    private current = this.fileList[0];

    private theseusFile: Phaser.GameObjects.Group;
    private mainFile: Phaser.GameObjects.Group;
    private swordFile: Phaser.GameObjects.Group;
    private bowFile: Phaser.GameObjects.Group;
    private codeList: Phaser.GameObjects.Group;
    private upgradeList: Phaser.GameObjects.Group;
    private previous: string;
    private itemList: string[];
    private dropZones: Phaser.GameObjects.Zone[];
    private inputField: HTMLInputElement | null;

    constructor() {
        super({ key: "weapon-design" });
        this.dropZones = [];
        this.inputField = null;
    }

    init(data: { from: string; itemList: string[] }) {
        this.previous = data.from;
        this.itemList = data.itemList;
    }

    create() {
        this.input.setDefaultCursor("pointer");

        this.theseusFile = this.add.group();
        this.mainFile = this.add.group();
        this.swordFile = this.add.group();
        this.bowFile = this.add.group();

        createWeaponDesignScreen(
            this,
            this.theseusFile,
            this.mainFile,
            this.swordFile,
            this.bowFile
        );

        // Displaying main file by default
        this.theseusFile.setVisible(false);
        this.swordFile.setVisible(false);
        this.bowFile.setVisible(false);

        //Previous button that will switch to previous java file
        const previous = this.add
            .image(this.cameras.main.width * 0.05 + 10, 28, "next-button")
            .setOrigin(0.5)
            .setDepth(1000);
        previous.scaleX = -1;
        previous.setInteractive();

        previous.on("pointerover", () => {
            previous.setScale(1.1);
            previous.scaleX *= -1;
        });
        previous.on("pointerout", () => {
            previous.setScale(1);
            previous.scaleX *= -1;
        });
        previous.on("pointerdown", () => {
            let currIdx = this.fileList.indexOf(this.current);
            if (currIdx > 0) {
                currIdx--;
            } else {
                currIdx = this.fileList.length - 1;
            }
            this.current = this.fileList[currIdx];
            this.handleFileChange();
        });

        //Next button that will switch to next java file
        const next = this.add
            .image(this.cameras.main.width * 0.85 - 10, 28, "next-button")
            .setOrigin(0.5)
            .setDepth(1000);
        next.setInteractive();

        next.on("pointerover", () => {
            next.setScale(1.1);
        });
        next.on("pointerout", () => {
            next.setScale(1);
        });
        next.on("pointerdown", () => {
            const currIdx = this.fileList.indexOf(this.current);
            this.current = this.fileList[(currIdx + 1) % this.fileList.length];
            this.handleFileChange();
        });

        // Display list of items
        this.codeList = this.add.group();

        const addItem = (
            x: number,
            y: number,
            itemName: string,
            itemImg: string
        ) => {
            const itemImage = this.add
                .image(x, y, itemImg)
                .setOrigin(0.5)
                .setDepth(2000)
                .setScale(1.5);

            this.codeList.add(itemImage);

            itemImage.setInteractive();
            this.input.setDraggable(itemImage);

            this.input.on(
                "drag",
                (
                    pointer: Phaser.Input.Pointer,
                    gameObject: Phaser.GameObjects.Image,
                    dragX: number,
                    dragY: number
                ) => {
                    gameObject.x = dragX;
                    gameObject.y = dragY;
                }
            );

            this.input.on(
                "dragend",
                (
                    pointer: Phaser.Input.Pointer,
                    gameObject: Phaser.GameObjects.Image,
                    dropped: boolean
                ) => {
                    if (!dropped || this.current !== "Main") {
                        gameObject.x = x;
                        gameObject.y = y;
                    }
                }
            );
        };

        for (let i = 0; i < this.itemList.length; i++) {
            let textureKeyToCountMap = 0;
            this.codeList
                .getChildren()
                .forEach((image: Phaser.GameObjects.GameObject) => {
                    if (image instanceof Phaser.GameObjects.Image) {
                        if (image.texture.key === this.itemList[i]) {
                            textureKeyToCountMap++;
                        }
                    }
                });
            if (
                this.itemList[i] === "sword-fire" ||
                this.itemList[i] === "sword-ice" ||
                this.itemList[i] === "bow-poison" ||
                this.itemList[i] === "bow-triple"
            ) {
                if (textureKeyToCountMap == 0) {
                    addItem(
                        this.cameras.main.width * 0.9,
                        60 + 30 * this.codeList.getLength() - 1,
                        this.itemList[i],
                        this.itemList[i]
                    );
                }
            } else if (
                this.itemList[i] === "sword-damage-up" ||
                this.itemList[i] === "sword-speed-up" ||
                this.itemList[i] === "bow-damage-up" ||
                this.itemList[i] === "bow-speed-up"
            ) {
                addItem(
                    this.cameras.main.width * 0.9,
                    60 + 30 * this.codeList.getLength() - 1,
                    this.itemList[i],
                    this.itemList[i]
                );
            }
        }

        // box where the item will be dropped
        this.upgradeList = this.add.group({
            classType: Phaser.GameObjects.Graphics,
        });

        let boxX = this.cameras.main.width * 0.1 - 5;
        let boxY = this.cameras.main.height * 0.25;

        for (let i = 0; i < 6; i++) {
            // boxY += this.cameras.main.height * 0.08 + 11;
            this.upgradeList.get(boxX, boxY, "item-box");
        }

        this.upgradeList.getChildren().forEach((c) => {
            const boxWidth = this.cameras.main.width * 0.7 + 10;
            const boxHeight = this.cameras.main.height * 0.08;

            const box = c as Phaser.GameObjects.Graphics;

            const zone = this.add
                .zone(
                    boxX + boxWidth / 2,
                    boxY + boxHeight / 2,
                    boxWidth,
                    boxHeight
                )
                .setRectangleDropZone(boxWidth, boxHeight)
                .setDepth(1700)
                .setOrigin(0.5);

            this.dropZones.push(zone);

            box.fillStyle(0xffffff, 1);
            box.fillRect(boxX, boxY, boxWidth, boxHeight);
            box.lineStyle(2, 0x000000);
            box.strokeRect(boxX, boxY, boxWidth, boxHeight);
            box.setDepth(1500);

            boxY += boxHeight + 11;

            this.input.on(
                "dragenter",
                (
                    pointer: Phaser.Input.Pointer,
                    gameObject: Phaser.GameObjects.Image,
                    dropZone: Phaser.GameObjects.Graphics
                ) => {
                    if (this.current === "Main") {
                        box.fillStyle(0xd3d3d3, 1);
                        box.fillRect(
                            dropZone.x - dropZone.input?.hitArea.width / 2,
                            dropZone.y - dropZone.input?.hitArea.height / 2,
                            dropZone.input?.hitArea.width,
                            dropZone.input?.hitArea.height
                        );
                        box.lineStyle(2, 0x33cc33);
                        box.strokeRect(
                            dropZone.x - dropZone.input?.hitArea.width / 2,
                            dropZone.y - dropZone.input?.hitArea.height / 2,
                            dropZone.input?.hitArea.width,
                            dropZone.input?.hitArea.height
                        );
                    }
                }
            );

            this.input.on(
                "dragleave",
                (
                    pointer: Phaser.Input.Pointer,
                    gameObject: Phaser.GameObjects.Image,
                    dropZone: Phaser.GameObjects.Graphics
                ) => {
                    if (this.current === "Main") {
                        box.fillStyle(0xffffff, 1);
                        box.fillRect(
                            dropZone.x - dropZone.input?.hitArea.width / 2,
                            dropZone.y - dropZone.input?.hitArea.height / 2,
                            dropZone.input?.hitArea.width,
                            dropZone.input?.hitArea.height
                        );
                        box.lineStyle(2, 0x000000);
                        box.strokeRect(
                            dropZone.x - dropZone.input?.hitArea.width / 2,
                            dropZone.y - dropZone.input?.hitArea.height / 2,
                            dropZone.input?.hitArea.width,
                            dropZone.input?.hitArea.height
                        );
                    }
                }
            );

            this.input.on(
                "drop",
                (
                    pointer: Phaser.Input.Pointer,
                    gameObject: Phaser.GameObjects.Image,
                    dropZone: Phaser.GameObjects.Zone
                ) => {
                    if (this.current === "Main") {
                        gameObject.x = dropZone.x - boxWidth / 2 + 20;
                        gameObject.y = dropZone.y;

                        if (this.dropZones.includes(dropZone)) {
                            this.inputField = document.createElement("input");
                            this.inputField.type = "text";
                            this.inputField.style.position = "absolute";
                            this.inputField.style.left = `${gameObject.x}px`;
                            this.inputField.style.top = `${gameObject.y}px`;
                            this.inputField.style.width = `${2 * boxWidth}px`;
                            this.inputField.style.height = `${2 * boxHeight}px`;
                            this.inputField.style.zIndex = "2000";
                            document.body.appendChild(this.inputField);

                            this.inputField.focus();
                        }
                    }
                }
            );
            return true;
        });

        // Close button that will return to the game screen
        const close = this.add
            .text(this.cameras.main.width - 20, 20, "X", {
                fontSize: "25px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 6,
                stroke: "0xffffff",
                //strokeAlpha: 1
            })
            .setOrigin(0.5)
            .setDepth(1000);

        close.setInteractive();
        close.on("pointerover", () => {
            close.setFontSize("27px");
        });
        close.on("pointerout", () => {
            close.setFontSize("25px");
        });
        close.on("pointerdown", () => {
            this.input.setDefaultCursor("crosshair");
            this.scene.stop();
            this.scene.resume(this.previous, { itemList: this.itemList });
        });
        this.input.keyboard?.on("keydown-E", () => {
            this.input.setDefaultCursor("crosshair");
            this.scene.stop();
            this.scene.resume(this.previous, { itemList: this.itemList });
        });
    }

    private handleFileChange() {
        this.mainFile.setVisible(this.current === "Main");
        this.theseusFile.setVisible(this.current === "Theseus");
        this.swordFile.setVisible(this.current === "Sword");
        this.bowFile.setVisible(this.current === "Bow");
        this.upgradeList.setVisible(this.current === "Main");
    }
}
