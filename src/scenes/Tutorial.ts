//https://despairparty.itch.io/rpgmaker-spriteface
//https://pogutatar.itch.io/pixel-button-pack-by-pogutatar
import Phaser from "phaser";
import { debugDraw } from "../utils/debug";
import { createTheseusAnims } from "../anims/theseusAnims";
import { createWeaponsAnims } from "../anims/weaponsAnims";
import "../player/theseus";
import Theseus from "../player/theseus";
import "../weapons/bow";

import { sceneEvents } from "../events/eventsCenter";

export default class Tutorial extends Phaser.Scene {
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private theseus?: Theseus;
    private doorOpened: Phaser.Tilemaps.TilemapLayer;
    private doorLayer: Phaser.Tilemaps.TilemapLayer;
    private swordStatus: string[];
    private bowStatus: string[];

    private itemList: string[];
    private updateCodeList: string[] | undefined;
    private upgrades = 0;

    private ariadne: Phaser.GameObjects.Image;
    private textBox: Phaser.GameObjects.Rectangle;
    private currentIndex: number;
    private ariadneText: Phaser.GameObjects.Text;
    private ariadneTextOptions: string[];
    private nextButton: Phaser.GameObjects.Image;
    private prevButton: Phaser.GameObjects.Image;

    constructor() {
        super({ key: "tutorial" });
        this.swordStatus = [];
        this.bowStatus = [];
        this.itemList = [];
        this.updateCodeList = [];
        this.ariadneTextOptions = [
            "Thank goodness you came Theseus!",
            "The minotaur at the center of the maze has been plaguing my people for years.",
            "If you were able to make it to the center of the maze and defeat the minotaur, you would be the hero of Crete!",
            "I got this bow and item for you.",
            "Oh, you don't know how to use it?\nDon't worry it's not that hard.",
            "I gave you an item that can increase the damage of bow, so let's try using it.",
            "Try pressing E once to see what you have!",
            "If you put item in the box, it will require you to write some code to upgrade your weapon.",
            "First, we should get bow from theseus file to upgrade it.",
            "Try clicking the arrow button on the top so that you can look through theseus file.",
            "We can find lots of code, but we need only one, getBow(), to use our item.",
            "Okay! Then we need another code that can access to the damage of the bow.",
            "Let's move to bow file.",
            "As you can see, there is incDamage() code that will increase the damage of the bow.",
            "Let's return to main file and write the code.\nDon't forget you need a dot before to use code.",
            "If you press ENTER key.... item should be successfully used!",
            "If it did not, try going back the dialogues and write it again",
            "And here is the list of the items you can find. You can also always look at it using I key.",
            "It seems you're ready... Good Luck Theseus!",
        ];
    }

    create() {
        createTheseusAnims(this.anims);
        createWeaponsAnims(this.anims);

        this.cursors =
            this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys;

        this.input.setDefaultCursor("crosshair");

        this.add.image(0, 0, "base_tiles");
        const map = this.make.tilemap({ key: "tilemap" });
        const tileset = map.addTilesetImage(
            "dungeon",
            "base_tiles",
            16,
            16
        ) as Phaser.Tilemaps.Tileset;

        map.createLayer("ground", tileset);
        const wallsLayer = map.createLayer(
            "wall",
            tileset
        ) as Phaser.Tilemaps.TilemapLayer;
        map.createLayer("objects", tileset);
        this.doorOpened = map.createLayer(
            "door-open",
            tileset
        ) as Phaser.Tilemaps.TilemapLayer;
        this.doorLayer = map.createLayer(
            "door",
            tileset
        ) as Phaser.Tilemaps.TilemapLayer;

        wallsLayer.setCollisionByProperty({ collides: true }, true);
        this.doorLayer.setCollisionByProperty({ collides: true }, true);

        debugDraw(wallsLayer, this, false);
        debugDraw(this.doorLayer, this, false);

        this.theseus = this.add.theseus(
            this.cameras.main.width * 0.5,
            this.cameras.main.height * 0.7,
            "faune"
        );
        this.theseus.canUseBow = false;

        this.physics.add.overlap(
            this.theseus,
            this.doorOpened,
            this.handleEnterDoor,
            undefined,
            this
        );

        this.physics.add.collider(this.theseus, wallsLayer);
        this.physics.add.collider(this.theseus, this.doorLayer);

        this.swordStatus.push(this.theseus.getSword.damage.toString());
        this.swordStatus.push(this.theseus.getSword.speed.toString());
        this.swordStatus.push(this.theseus.getSword.attackType);
        this.bowStatus.push(this.theseus.getBow.damage.toString());
        this.bowStatus.push(this.theseus.getBow.speed.toString());
        this.bowStatus.push(this.theseus.getBow.attackType);

        this.currentIndex = 0;

        //this.scene.run("maze-map");

        this.time.delayedCall(1000, () => {
            if (!this.theseus) {
                return;
            }
            this.swordStatus = [];
            this.bowStatus = [];
            this.swordStatus.push(this.theseus.getSword.damage.toString());
            this.swordStatus.push(this.theseus.getSword.speed.toString());
            this.swordStatus.push(this.theseus.getSword.attackType);
            this.bowStatus.push(this.theseus.getBow.damage.toString());
            this.bowStatus.push(this.theseus.getBow.speed.toString());
            this.bowStatus.push(this.theseus.getBow.attackType);
            this.scene.run("game-ui", {
                hp: this.theseus.health,
                threads: 5,
                weaponType: this.theseus.weaponType,
                swordStatus: this.swordStatus,
                bowStatus: this.bowStatus,
            });
        });

        this.nextButton = this.add
            .image(
                this.cameras.main.width * 0.8,
                this.cameras.main.height * 0.9,
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
                this.cameras.main.height * 0.9,
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

        let bowGet = false;
        let itemGet = false;

        this.events.once("bowAndItem", () => {
            if (!this.theseus) {
                return;
            }
            this.nextButton.setActive(false).setVisible(false);
            this.prevButton.setActive(false).setVisible(false);

            const bow = this.add.bow(
                this.cameras.main.width * 0.45,
                this.cameras.main.height * 0.5,
                "bow"
            );
            bow.setScale(1);
            this.tweens.add({
                targets: bow,
                y: "-=10",
                duration: 1000,
                yoyo: true,
                repeat: -1,
            });
            this.physics.add.overlap(
                this.theseus,
                bow,
                () => {
                    if (!this.theseus) {
                        return;
                    }
                    this.theseus.canUseBow = true;
                    bow.destroy();
                    bowGet = true;
                    if (itemGet) {
                        this.nextButton.setActive(true).setVisible(true);
                        this.prevButton.setActive(true).setVisible(true);
                    }
                },
                undefined,
                this
            );

            const sampleItem = this.physics.add.image(
                this.cameras.main.width * 0.55,
                this.cameras.main.height * 0.5,
                "bow-damage-up"
            );
            sampleItem.setScale(1.5);
            this.tweens.add({
                targets: sampleItem,
                y: "-=10",
                duration: 1000,
                yoyo: true,
                repeat: -1,
            });
            this.physics.add.overlap(
                this.theseus,
                sampleItem,
                () => {
                    this.itemList.push("bow-damage-up");
                    sampleItem.destroy();
                    itemGet = true;
                    if (bowGet) {
                        this.nextButton.setActive(true).setVisible(true);
                        this.prevButton.setActive(true).setVisible(true);
                    }
                },
                undefined,
                this
            );
        });

        this.ariadne = this.add
            .image(
                this.cameras.main.width - 50,
                this.cameras.main.height - 60,
                "Ariadne"
            )
            .setDepth(1000);

        this.textBox = this.add
            .rectangle(
                this.cameras.main.width / 2,
                this.cameras.main.height * 0.85,
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
                this.cameras.main.height * 0.8,
                this.ariadneTextOptions[this.currentIndex],
                {
                    fontSize: "12px",
                    color: "#fff",
                    wordWrap: { width: this.cameras.main.width * 0.7 },
                }
            )
            .setDepth(1000);

        this.input.keyboard?.on("keydown-ESC", () => {
            this.scene.pause();
            this.scene.run("pause", { currentScene: "tutorial" });
        });

        this.input.keyboard?.on("keydown-E", () => {
            let tempList: string[] = [];
            if (this.updateCodeList != undefined) {
                tempList = this.updateCodeList;
            }
            this.scene.pause();
            this.scene.run("weapon-design", {
                from: "tutorial",
                itemList: this.itemList,
                updateCodeList: tempList,
            });
        });

        this.input.keyboard?.on("keydown-M", () => {
            this.scene.pause();
            this.scene.run("maze-map", { currentScene: "tutorial" });
        });

        this.events.on("weapon-updated", this.handleWeaponUpdated, this);

        this.events.on(
            "resume",
            (
                scene: this,
                data: {
                    previous: string;
                    updatedList: string[];
                    updateCodeList: string[];
                    upgradeList: string[];
                }
            ) => {
                if (data.previous === "pause") {
                    return;
                }
                this.itemList = data.updatedList;
                this.updateCodeList = data.updateCodeList;
                if (this.upgrades < data.upgradeList.length) {
                    this.handleWeaponUpdated(data.upgradeList);
                }
            }
        );

        // this.input.keyboard?.on("keydown-I", () => {
        //     this.scene.pause();
        //     this.scene.run("instructions", { currentScene: "tutorial" });
        // });

        this.add
            .image(
                this.cameras.main.width * 0.2,
                this.cameras.main.height * 0.6,
                "tuto-move"
            )
            .setOrigin(0.5)
            .setScale(0.4);

        this.add
            .image(
                this.cameras.main.width * 0.8,
                this.cameras.main.height * 0.6,
                "tuto-attack"
            )
            .setOrigin(0.5)
            .setScale(0.4);

        this.add
            .image(
                this.cameras.main.width * 0.2,
                this.cameras.main.height * 0.4,
                "tuto-weapon-change"
            )
            .setOrigin(0.5)
            .setScale(0.4);

        this.add
            .image(
                this.cameras.main.width * 0.5 + 80,
                this.cameras.main.height * 0.2,
                "tuto-enter-door"
            )
            .setOrigin(0.5)
            .setScale(0.4);

        this.add
            .image(
                this.cameras.main.width * 0.8,
                this.cameras.main.height * 0.4,
                "tuto-weapon-design"
            )
            .setOrigin(0.5)
            .setScale(0.4);

        this.add
            .image(
                this.cameras.main.width * 0.3,
                this.cameras.main.height * 0.2,
                "tuto-pause"
            )
            .setOrigin(0.5)
            .setScale(0.4);
    }

    private handleEnterDoor() {
        if (!this.theseus) {
            return;
        }
        const tile = this.doorOpened.getTileAtWorldXY(
            this.theseus.x,
            this.theseus.y,
            true
        );
        //if (this.cursors?.space.isDown && tile.index != -1) {
        //this.scene.start("maze-map")

        this.swordStatus = [];
        this.bowStatus = [];

        let pushComplete = false;

        if (this.cursors?.space.isDown && tile.index != -1) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!pushComplete) {
                this.swordStatus.push(this.theseus.getSword.damage.toString());
                this.swordStatus.push(this.theseus.getSword.speed.toString());
                this.swordStatus.push(this.theseus.getSword.attackType);
                this.bowStatus.push(this.theseus.getBow.damage.toString());
                this.bowStatus.push(this.theseus.getBow.speed.toString());
                this.bowStatus.push(this.theseus.getBow.attackType);

                pushComplete = true;
            }
            this.scene.pause();
            //this.scene.run("maze-map", { currentScene: "tutorial" });
            this.scene.start("mainScene", {
                hp: this.theseus.health,
                threads: 4,
                weaponType: this.theseus.weaponType,
                itemList: this.itemList,
                updateCodeList: this.updateCodeList,
                swordStatus: this.swordStatus,
                bowStatus: this.bowStatus,
            });
        }
    }

    private handleNextText() {
        this.currentIndex++;
        if (this.currentIndex === 3) {
            this.events.emit("bowAndItem");
        }
        if (this.currentIndex < this.ariadneTextOptions.length) {
            this.ariadneText.setText(
                this.ariadneTextOptions[this.currentIndex]
            );
        } else {
            if (this.theseus?.getBow.damage === 3) {
                this.doorLayer.setCollisionByProperty(
                    { collides: true },
                    false
                );
                this.doorLayer.setVisible(false);
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

    private handleWeaponUpdated(upgradeList: string[]) {
        if (!this.theseus) {
            return;
        }
        upgradeList.forEach((text: string, index: number) => {
            if (!this.theseus) {
                return;
            }
            if (index >= this.upgrades) {
                if (text === "sword-fire") {
                    this.theseus.getSword.attackType = "fire";
                } else if (text === "sword-ice") {
                    this.theseus.getSword.attackType = "ice";
                } else if (text === "sword-damage-up") {
                    this.theseus.getSword.incDamage();
                } else if (text === "sword-speed-up") {
                    this.theseus.getSword.incSpeed();
                } else if (text === "bow-poison") {
                    this.theseus.getBow.attackType = "poison";
                } else if (text === "bow-triple") {
                    this.theseus.getBow.attackType = "triple";
                } else if (text === "bow-damage-up") {
                    this.theseus.getBow.incDamage();
                } else if (text === "bow-speed-up") {
                    this.theseus.getBow.incSpeed();
                }
                this.upgrades++;
            }
        });
        this.swordStatus = [];
        this.bowStatus = [];
        this.swordStatus.push(this.theseus.getSword.damage.toString());
        this.swordStatus.push(this.theseus.getSword.speed.toString());
        this.swordStatus.push(this.theseus.getSword.attackType);
        this.bowStatus.push(this.theseus.getBow.damage.toString());
        this.bowStatus.push(this.theseus.getBow.speed.toString());
        this.bowStatus.push(this.theseus.getBow.attackType);
        sceneEvents.emit("weapon-status-update", {
            swordStatus: this.swordStatus,
            bowStatus: this.bowStatus,
        });
        // this.doorLayer.setCollisionByProperty({ collides: true }, false);
        // this.doorLayer.setVisible(false);
    }

    update() {
        if (this.theseus) {
            this.theseus.update(this.cursors!);
        }
    }
}
