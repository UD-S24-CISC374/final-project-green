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
    private defaultCode: Phaser.GameObjects.Text;

    private codeList: Phaser.GameObjects.Group;
    private itemBox: Phaser.GameObjects.Group;

    private holdingItem: Phaser.GameObjects.Image;

    private previous: string;
    private itemList: string[];

    private upgradeList: string[];
    private updatedItemList: string[];
    private updateCodeList: string[];

    private dropZones: Phaser.GameObjects.Zone[];
    private inputField: HTMLInputElement;

    private inputEntered = false;

    constructor() {
        super({ key: "weapon-design" });
        this.dropZones = [];
        this.upgradeList = [];
    }

    init(data: { from: string; itemList: string[]; updateCodeList: string[] }) {
        this.previous = data.from;
        this.itemList = data.itemList;
        this.updateCodeList = data.updateCodeList;
    }

    create() {
        this.updatedItemList = [];
        this.input.setDefaultCursor("default");

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

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this.updateCodeList) {
            this.updateCodeList.forEach((text: string, index: number) => {
                let textY = this.cameras.main.height * 0.25;
                this.add
                    .text(
                        this.cameras.main.width * 0.1,
                        textY + 20 * index,
                        text,
                        {
                            fontSize: "12px",
                            fontFamily: "Academy Engraved LET",
                            strokeThickness: 3,
                            stroke: "0xffffff",
                        }
                    )
                    .setOrigin(0)
                    .setDepth(1000)
                    .setVisible(true);
            });
        }

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

            itemImage.on("pointerover", () => {
                itemImage.setScale(1.6);
                this.input.setDefaultCursor("pointer");
            });

            itemImage.on("pointerout", () => {
                itemImage.setScale(1.5);
                this.input.setDefaultCursor("default");
            });

            // Drag and Drop for items
            let initialPosition: { x: number; y: number } | null = null;

            this.input.on(
                "dragstart",
                (
                    pointer: Phaser.Input.Pointer,
                    gameObject: Phaser.GameObjects.Image
                ) => {
                    if (gameObject.x >= this.cameras.main.width * 0.9) {
                        initialPosition = { x: gameObject.x, y: gameObject.y };
                    }
                }
            );

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
                        if (initialPosition) {
                            gameObject.x = initialPosition.x;
                            gameObject.y = initialPosition.y;
                        }
                    }
                }
            );
        };

        // List up the items that player collected
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
        this.itemBox = this.add.group({
            classType: Phaser.GameObjects.Graphics,
        });

        let itemBoxX = this.cameras.main.width * 0.1 - 5;
        let itemBoxY = this.cameras.main.height * 0.83;

        const itemBoxWidth = this.cameras.main.height * 0.08;
        const itemBoxHeight = this.cameras.main.height * 0.08;

        const zone = this.add
            .zone(
                itemBoxX + itemBoxWidth / 2,
                itemBoxY + itemBoxHeight / 2,
                itemBoxWidth,
                itemBoxHeight
            )
            .setRectangleDropZone(itemBoxWidth, itemBoxHeight)
            .setDepth(1700)
            .setOrigin(0.5);

        this.dropZones.push(zone);

        const box = this.itemBox.get(itemBoxX, itemBoxY);

        box.fillStyle(0xffffff, 1);
        box.fillRect(itemBoxX, itemBoxY, itemBoxWidth, itemBoxHeight);
        box.lineStyle(2, 0x000000);
        box.strokeRect(itemBoxX, itemBoxY, itemBoxWidth, itemBoxHeight);
        box.setDepth(1500);

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

        this.defaultCode = this.add
            .text(
                this.cameras.main.width * 0.05 + 90,
                this.cameras.main.height * 0.86 + 2,
                "\ttheseus",
                {
                    fontSize: "12px",
                    fontFamily: "Academy Engraved LET",
                    strokeThickness: 3,
                    stroke: "0xffffff",
                }
            )
            .setOrigin(0.5)
            .setDepth(1000)
            .setVisible(false);

        this.input.on(
            "drop",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: Phaser.GameObjects.Image,
                dropZone: Phaser.GameObjects.Zone
            ) => {
                if (this.current === "Main") {
                    gameObject.x = dropZone.x - itemBoxWidth / 2 + 15;
                    gameObject.y = dropZone.y;

                    if (this.dropZones.includes(dropZone)) {
                        this.holdingItem = gameObject;
                        this.defaultCode.setVisible(true);

                        this.inputField = document.createElement("input");
                        this.inputField.type = "text";
                        this.inputField.style.border = "none";
                        this.inputField.style.outline = "none";
                        this.inputField.style.width = `${
                            this.cameras.main.width * 0.5
                        }px`;
                        this.inputField.style.height = `${itemBoxHeight - 5}px`;
                        document.body.appendChild(this.inputField);

                        this.inputField.focus();

                        this.add.dom(
                            itemBoxX + this.defaultCode.width + 180,
                            dropZone.y,
                            this.inputField
                        );
                    }
                }
            }
        );

        this.input.on(
            "dragend",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: Phaser.GameObjects.Image,
                dropped: boolean
            ) => {
                if (!dropped) {
                    if (this.defaultCode.visible) {
                        this.inputField.style.visibility = "hidden";
                        this.inputField.disabled = true;
                        this.inputField.remove();
                    }
                    this.defaultCode.setVisible(false);
                }
            }
        );

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
            this.codeList
                .getChildren()
                .forEach((image: Phaser.GameObjects.GameObject) => {
                    if (image instanceof Phaser.GameObjects.Image) {
                        this.updatedItemList.push(image.texture.key);
                    }
                });
            this.scene.resume(this.previous, {
                previous: "weapon-design",
                updatedList: this.updatedItemList,
                updateCodeList: this.updateCodeList,
                upgradeList: this.upgradeList,
            });
            console.log(this.updateCodeList);
            this.scene.stop();
        });
    }

    private handleFileChange() {
        this.mainFile.setVisible(this.current === "Main");
        this.theseusFile.setVisible(this.current === "Theseus");
        this.swordFile.setVisible(this.current === "Sword");
        this.bowFile.setVisible(this.current === "Bow");
        this.itemBox.setVisible(this.current === "Main");
        if (this.current === "Main") {
            this.defaultCode.setVisible(true);
            this.inputField.style.visibility = "visible";
            this.inputField.disabled = false;
            this.holdingItem.setVisible(true);
        } else {
            this.defaultCode.setVisible(false);
            this.inputField.style.visibility = "hidden";
            this.inputField.disabled = true;
            this.holdingItem.setVisible(false);
        }
        console.log(this.upgradeList);
    }

    update() {
        const keyEnter = this.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );

        if (keyEnter?.isDown) {
            if (!this.inputEntered) {
                this.inputEntered = true;

                const inputValue = this.inputField.value;
                const inputParts = inputValue.split(".");
                const itemParts = this.holdingItem.texture.key.split("-");

                let isCorrect = false;

                const completeText = this.add
                    .text(
                        this.cameras.main.width * 0.1,
                        this.cameras.main.height * 0.25,
                        "",
                        {
                            fontSize: "12px",
                            fontFamily: "Academy Engraved LET",
                            strokeThickness: 3,
                            stroke: "0xffffff",
                        }
                    )
                    .setOrigin(0)
                    .setDepth(1000)
                    .setVisible(false);

                // Check player's input
                if (itemParts[0] === "sword") {
                    if (inputParts[1] === "getSword()") {
                        if (itemParts[1] === "fire") {
                            if (inputParts[2] === 'setType("fire")') {
                                isCorrect = true;
                                completeText.setText(
                                    'theseus.getSword().setType("fire");'
                                );
                            }
                        } else if (itemParts[1] === "ice") {
                            if (inputParts[2] === 'setType("ice")') {
                                isCorrect = true;
                                completeText.setText(
                                    'theseus.getSword().setType("ice");'
                                );
                            }
                        } else if (itemParts[1] === "damage") {
                            if (inputParts[2] === "incDamage()") {
                                isCorrect = true;
                                completeText.setText(
                                    "theseus.getSword().incDamage();"
                                );
                            }
                        } else if (itemParts[1] === "speed") {
                            if (inputParts[2] === "incSpeed()") {
                                isCorrect = true;
                                completeText.setText(
                                    "theseus.getSword().incSpeed();"
                                );
                            }
                        }
                    }
                } else if (itemParts[0] === "bow") {
                    if (inputParts[1] === "getBow()") {
                        if (itemParts[1] === "poison") {
                            if (inputParts[2] === 'setType("poison")') {
                                isCorrect = true;
                                completeText.setText(
                                    'theseus.getBow().setType("poison");'
                                );
                            }
                        } else if (itemParts[1] === "triple") {
                            if (inputParts[2] === 'setType("triple")') {
                                isCorrect = true;
                                completeText.setText(
                                    'theseus.getBow().setType("triple");'
                                );
                            }
                        } else if (itemParts[1] === "damage") {
                            if (inputParts[2] === "incDamage()") {
                                isCorrect = true;
                                completeText.setText(
                                    "theseus.getBow().incDamage();"
                                );
                            }
                        } else if (itemParts[1] === "speed") {
                            if (inputParts[2] === "incSpeed()") {
                                isCorrect = true;
                                completeText.setText(
                                    "theseus.getBow().incSpeed();"
                                );
                            }
                        }
                    }
                }

                if (isCorrect) {
                    this.inputField.remove();
                    this.defaultCode.setVisible(false);
                    this.codeList.remove(this.holdingItem);
                    this.upgradeList.push(this.holdingItem.texture.key);
                    this.holdingItem.destroy();
                    completeText.setY(
                        this.cameras.main.height * 0.25 +
                            20 * this.updateCodeList.length
                    );
                    completeText.setVisible(true);
                    this.updateCodeList.push(completeText.text);
                    this.events.emit("weapon-updated", this.upgradeList);
                }
            }
        }
        if (keyEnter?.isUp) {
            this.inputEntered = false;
        }
    }
}
