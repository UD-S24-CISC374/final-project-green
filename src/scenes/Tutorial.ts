//https://despairparty.itch.io/rpgmaker-spriteface
//https://pogutatar.itch.io/pixel-button-pack-by-pogutatar
import Phaser from "phaser";
import { debugDraw } from "../utils/debug";
import { createTheseusAnims } from "../anims/theseusAnims";
import { createWeaponsAnims } from "../anims/weaponsAnims";
import "../player/theseus";
import Theseus from "../player/theseus";
import "../weapons/bow";

// import { sceneEvents } from "../events/eventsCenter";

export default class Tutorial extends Phaser.Scene {
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private theseus?: Theseus;
    private doorOpened: Phaser.Tilemaps.TilemapLayer;
    private swordStatus: string[];
    private bowStatus: string[];

    constructor() {
        super({ key: "tutorial" });
        this.swordStatus = [];
        this.bowStatus = [];
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
        const doorLayer = map.createLayer(
            "door",
            tileset
        ) as Phaser.Tilemaps.TilemapLayer;

        wallsLayer.setCollisionByProperty({ collides: true }, true);
        doorLayer.setCollisionByProperty({ collides: true }, true);

        debugDraw(wallsLayer, this, false);
        debugDraw(doorLayer, this, false);

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
        this.physics.add.collider(this.theseus, doorLayer);

        this.swordStatus.push(this.theseus.getSword.damage.toString());
        this.swordStatus.push(this.theseus.getSword.speed.toString());
        this.swordStatus.push(this.theseus.getSword.attackType);
        this.bowStatus.push(this.theseus.getBow.damage.toString());
        this.bowStatus.push(this.theseus.getBow.speed.toString());
        this.bowStatus.push(this.theseus.getBow.attackType);

        const nextButton = this.add
            .image(
                this.cameras.main.width - 80,
                this.cameras.main.height - 30,
                "ArrowButton"
            )
            .setDepth(1000);

        let currentIndex = 0;

        //Make a list of text options for Ariadne.
        const ariadneTextOptions = [
            "Thank goodness you came Theseus!",
            "The minotaur at the center of the maze has been plaguing my people for years.",
            "If you were able to make it to the center of the maze and defeat the minotaur, you would be the hero of Crete!",
            "Here is some string to help you find your way out of the maze.",
            "I have also layed out some tips for you, please read them! Also press I for more instructions.",
            "Once you feel ready, enter the maze up ahead. ",
        ];

        //this.scene.run("maze-map");

        this.time.delayedCall(1000, () => {
            doorLayer.setCollisionByProperty({ collides: true }, false);
            doorLayer.setVisible(false);
            this.scene.run("game-ui", {
                hp: this.theseus?.health,
                threads: 4,
                weaponType: this.theseus?.weaponType,
                swordStatus: this.swordStatus,
                bowStatus: this.bowStatus,
            });
            // this.add
            //     .image(
            //         this.cameras.main.width - 40,
            //         this.cameras.main.height - 60,
            //         "Ariadne"
            //     )
            //     .setDepth(999);
            // this.add.text(
            //     this.cameras.main.width / 2 - 100,
            //     this.cameras.main.height - 70,
            //     ariadneTextOptions[currentIndex],
            //     {
            //         fontSize: "12px",
            //         color: "#fff",
            //         wordWrap: { width: 300, useAdvancedWrap: true },
            //         backgroundColor: "rgba(0, 0, 0, 0.5)",
            //         padding: {
            //             x: 5,
            //             y: 5,
            //         },
            //     }
            // );
            // console.log("Before nextButton creation");
            // this.nextButton = this.add
            //     .image(
            //         this.cameras.main.width - 80,
            //         this.cameras.main.height - 40,
            //         "ArrowButton"
            //     )
            //     .setDepth(1000);
            // console.log("nextButton after creation:", this.nextButton);
        });

        const bow = this.add.bow(
            this.cameras.main.width * 0.5,
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
            },
            undefined,
            this
        );

        this.add
            .image(
                this.cameras.main.width - 40,
                this.cameras.main.height - 60,
                "Ariadne"
            )
            .setDepth(999);

        let ariadneText = this.add.text(
            this.cameras.main.width / 2 - 100,
            this.cameras.main.height - 75,
            ariadneTextOptions[currentIndex],
            {
                fontSize: "12px",
                color: "#fff",
                wordWrap: { width: 280, useAdvancedWrap: true },
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: {
                    x: 5,
                    y: 5,
                },
            }
        );

        function changeAriadneText() {
            currentIndex = (currentIndex + 1) % ariadneTextOptions.length;
            ariadneText.setText(ariadneTextOptions[currentIndex]);
        }

        nextButton.setInteractive();

        nextButton.on("pointerdown", changeAriadneText);

        nextButton.on("pointerover", () => {
            nextButton.setScale(1.5);
        });
        nextButton.on("pointerout", () => {
            nextButton.setScale();
        });

        this.input.keyboard?.on("keydown-ESC", () => {
            this.scene.pause();
            this.scene.run("pause", { currentScene: "tutorial" });
        });

        this.input.keyboard?.on("keydown-E", () => {
            this.scene.pause();
            this.scene.run("weapon-design", {
                from: "tutorial",
                itemList: [],
            });
        });

        this.input.keyboard?.on("keydown-M", () => {
            this.scene.pause();
            this.scene.run("maze-map", { currentScene: "tutorial" });
        });

        this.input.keyboard?.on("keydown-I", () => {
            this.scene.pause();
            this.scene.run("instructions", { currentScene: "tutorial" });
        });

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

        if (this.cursors?.space.isDown && tile.index != -1) {
            this.scene.pause();
            //this.scene.run("maze-map", { currentScene: "tutorial" });
            this.scene.start("mainScene", {
                hp: this.theseus.health,
                threads: 3,
                weaponType: this.theseus.weaponType,
                itemList: [],
                swordStatus: this.swordStatus,
                bowStatus: this.bowStatus,
            });
        }
    }

    update() {
        if (this.theseus) {
            this.theseus.update(this.cursors!);
        }
    }
}
