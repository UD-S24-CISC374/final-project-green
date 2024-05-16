import Phaser from "phaser";
import { debugDraw } from "../utils/debug";
import { createRedEyesSkeletonAnims } from "../anims/enemyAnims";
import { createTheseusAnims } from "../anims/theseusAnims";
import { createWeaponsAnims } from "../anims/weaponsAnims";
import RedEyesSkeleton from "../enemies/redEyesSkeleton";
import "../player/theseus";
import Theseus from "../player/theseus";
import { sceneEvents } from "../events/eventsCenter";

//blue star increases speed of the weapons
//orange star increases the damage of the weapon

export type Collidable =
    | Phaser.Types.Physics.Arcade.GameObjectWithBody
    | Phaser.Tilemaps.Tile;

export default class MainScene extends Phaser.Scene {
    private theseus?: Theseus;
    private map: Phaser.Tilemaps.Tilemap;
    private doorLayer: Phaser.Tilemaps.TilemapLayer;
    private doorOpened: Phaser.Tilemaps.TilemapLayer;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private redEyesSkeletons?: Phaser.Physics.Arcade.Group;
    private playerEnemyCollider?: Phaser.Physics.Arcade.Collider;
    private hp: number;
    private threads: number;
    private weapon: string;
    private itemList: string[];
    private updateCodeList: string[] | undefined;
    private upgrades = 0;
    private swordStatus: string[];
    private bowStatus: string[];
    private isEasyMode: boolean;

    private dropList = [
        { item: "sword-damage-up", weight: 14 },
        { item: "sword-speed-up", weight: 14 },
        { item: "sword-fire", weight: 10 },
        { item: "sword-ice", weight: 12 },
        { item: "bow-damage-up", weight: 14 },
        { item: "bow-speed-up", weight: 14 },
        { item: "bow-poison", weight: 10 },
        { item: "bow-triple", weight: 12 },
    ];

    constructor() {
        super({ key: "mainScene" });
        this.swordStatus = [];
        this.bowStatus = [];
    }

    init(data: {
        hp: number;
        threads: number;
        weaponType: string;
        itemList: string[];
        updateCodeList: string[];
        swordStatus: string[];
        bowStatus: string[];
        isEasyMode: boolean;
    }) {
        this.hp = data.hp;
        this.threads = data.threads;
        this.weapon = data.weaponType;
        this.itemList = data.itemList;
        this.updateCodeList = data.updateCodeList;
        this.swordStatus = data.swordStatus;
        this.bowStatus = data.bowStatus;
        this.isEasyMode = data.isEasyMode;
    }

    create() {
        createTheseusAnims(this.anims);
        createRedEyesSkeletonAnims(this.anims);
        createWeaponsAnims(this.anims);

        this.cursors =
            this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys;

        this.input.setDefaultCursor("crosshair");

        this.add.image(0, 0, "base_tiles");
        this.map = this.make.tilemap({ key: "tilemap" });
        const tileset = this.map.addTilesetImage(
            "dungeon",
            "base_tiles",
            16,
            16
        ) as Phaser.Tilemaps.Tileset;

        this.map.createLayer("ground", tileset);
        const wallsLayer = this.map.createLayer(
            "wall",
            tileset
        ) as Phaser.Tilemaps.TilemapLayer;
        this.map.createLayer("objects", tileset);
        this.doorOpened = this.map.createLayer(
            "door-open",
            tileset
        ) as Phaser.Tilemaps.TilemapLayer;
        this.doorLayer = this.map.createLayer(
            "door",
            tileset
        ) as Phaser.Tilemaps.TilemapLayer;

        wallsLayer.setCollisionByProperty({ collides: true }, true);
        this.doorLayer.setCollisionByProperty({ collides: true }, true);

        debugDraw(wallsLayer, this, false);
        debugDraw(this.doorLayer, this, false);

        this.theseus = this.add.theseus(
            this.cameras.main.width * 0.5,
            this.cameras.main.height * 0.5,
            "faune"
        );
        this.theseus.health = this.hp;
        this.theseus.weaponType = this.weapon;

        console.log("sword", this.swordStatus, "bow", this.bowStatus);

        this.theseus.getSword.damage = parseInt(this.swordStatus[0]);
        this.theseus.getSword.speed = parseInt(this.swordStatus[1]);
        this.theseus.getSword.attackType = this.swordStatus[2];

        this.theseus.getBow.damage = parseInt(this.bowStatus[0]);
        this.theseus.getBow.speed = parseInt(this.bowStatus[1]);
        this.theseus.getBow.attackType = this.bowStatus[2];

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
            threads: this.threads,
            weaponType: this.theseus.weaponType,
            swordStatus: this.swordStatus,
            bowStatus: this.bowStatus,
        });

        this.redEyesSkeletons = this.physics.add.group({
            classType: RedEyesSkeleton,
        });

        for (let i = 0; i < 7 - this.threads; i++) {
            let posX = Phaser.Math.Between(24, 488);
            let posY = Phaser.Math.Between(76, 355);
            while ((posX > 236 && posX < 276) || (posY > 172 && posY < 212)) {
                posX = Phaser.Math.Between(24, 488);
                posY = Phaser.Math.Between(76, 355);
            }
            this.redEyesSkeletons.get(posX, posY, "skeleton_red_eyes");
        }

        this.redEyesSkeletons.children.iterate((c) => {
            const redEyesSkeleton = c as RedEyesSkeleton;
            redEyesSkeleton.setTarget(this.theseus!);
            if (this.isEasyMode) {
                redEyesSkeleton.updateStatus(40, 15);
            }
            redEyesSkeleton.setEasyMode = this.isEasyMode;
            redEyesSkeleton.body?.setSize(
                redEyesSkeleton.width * 0.6,
                redEyesSkeleton.height * 0.8
            );
            return true;
        });

        this.physics.add.collider(this.theseus, wallsLayer);
        this.physics.add.collider(this.theseus, this.doorLayer);

        this.physics.add.collider(this.redEyesSkeletons, wallsLayer);
        this.physics.add.collider(this.redEyesSkeletons, this.doorLayer);

        this.physics.add.collider(this.redEyesSkeletons, this.redEyesSkeletons);

        this.playerEnemyCollider = this.physics.add.collider(
            this.redEyesSkeletons,
            this.theseus,
            this.handlePlayerEnemyCollision,
            undefined,
            this
        );

        this.physics.add.overlap(
            this.theseus,
            this.doorOpened,
            this.handleEnterDoor,
            undefined,
            this
        );

        this.events.on(
            "swordSlashCreated",
            (swordSlash: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
                if (this.redEyesSkeletons) {
                    this.physics.add.collider(
                        swordSlash,
                        this.redEyesSkeletons,
                        this.handleEnemySwordAttacked,
                        undefined,
                        this
                    );
                }
            }
        );

        this.events.on(
            "arrowCreated",
            (arrow: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
                if (this.redEyesSkeletons) {
                    this.physics.add.collider(
                        arrow,
                        this.redEyesSkeletons,
                        this.handleEnemyBowAttacked,
                        undefined,
                        this
                    );
                }
            }
        );

        this.events.on("gameRetry", () => {
            if (!this.theseus) {
                return;
            }
            this.theseus.health = this.hp;
            this.threads = 5;
        });

        this.events.once("enemyDefeated", this.handleEnemyDefeated, this);

        this.input.keyboard?.on("keydown-ESC", () => {
            this.scene.pause();
            this.scene.run("pause", { currentScene: "mainScene" });
        });

        this.input.keyboard?.on("keydown-M", () => {
            this.scene.pause();
            this.scene.run("maze-map", { currentScene: "tutorial" });
        });

        // this.input.keyboard?.on("keydown-I", () => {
        //     this.scene.pause();
        //     this.scene.run("instructions", { currentScene: "tutorial" });
        // });

        this.input.keyboard?.on("keydown-E", () => {
            let tempList: string[] = [];
            if (this.updateCodeList != undefined) {
                tempList = this.updateCodeList;
            }
            this.scene.pause();
            this.scene.run("weapon-design", {
                from: "mainScene",
                itemList: this.itemList,
                updateCodeList: tempList,
            });
        });

        sceneEvents.on("enemy-destroyed", this.handleEnemyDropItem, this);
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off("enemy-destroyed", this.handleEnemyDropItem, this);
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

            if (this.threads > 1) {
                this.scene.start("mainScene", {
                    hp: this.theseus.health,
                    threads: this.threads - 1,
                    weaponType: this.theseus.weaponType,
                    itemList: this.itemList,
                    updateCodeList: this.updateCodeList,
                    swordStatus: this.swordStatus,
                    bowStatus: this.bowStatus,
                    isEasyMode: this.isEasyMode,
                });
            } else {
                this.scene.start("minotaur", {
                    hp: this.theseus.health,
                    threads: this.threads - 1,
                    weaponType: this.theseus.weaponType,
                    itemList: this.itemList,
                    updateCodeList: this.updateCodeList,
                    swordStatus: this.swordStatus,
                    bowStatus: this.bowStatus,
                    isEasyMode: this.isEasyMode,
                });
            }
        }
    }

    private handlePlayerEnemyCollision(
        obj1:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile,
        obj2:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile
    ) {
        const redEyesSkeleton = obj2 as RedEyesSkeleton;

        const dx = this.theseus!.x - redEyesSkeleton.x;
        const dy = this.theseus!.y - redEyesSkeleton.y;

        const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(100);

        this.theseus?.handleDamage(dir);

        sceneEvents.emit("player-health-changed", this.theseus?.health);

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off(
                "player-health-changed",
                this.handlePlayerEnemyCollision,
                this
            );
        });

        if (this.theseus?.gameOVer) {
            this.time.delayedCall(1000, () => {
                this.scene.start("GameOver");
            });
        }
    }

    private handleEnemySwordAttacked(
        obj1:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile,
        obj2:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile
    ) {
        const redEyesSkeleton = obj2 as RedEyesSkeleton;
        const swordSlash =
            obj1 as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        this.events.emit("swordSlashHit", swordSlash);

        if (this.theseus?.getWeapon) {
            redEyesSkeleton.handleDamage(
                this.theseus.getWeapon.damage,
                this.theseus.getWeapon.attackType
            );
        }
    }

    private handleEnemyBowAttacked(
        obj1:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile,
        obj2:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile
    ) {
        const redEyesSkeleton = obj2 as RedEyesSkeleton;
        const arrow = obj1 as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        this.events.emit("arrowHit", arrow);

        if (this.theseus?.getWeapon) {
            redEyesSkeleton.handleDamage(
                this.theseus.getWeapon.damage,
                this.theseus.getWeapon.attackType
            );
        }
    }

    private handleEnemyDefeated() {
        this.doorLayer.setCollisionByProperty({ collides: true }, false);
        this.doorLayer.setVisible(false);
    }

    private handleEnemyDropItem(dropX: number, dropY: number) {
        const ranNum = Math.random() * 100;

        if (ranNum <= 50) {
            const randomWeight = Math.random() * 100;
            let accumulatedWeight = 0;
            let itemIdx = 0;
            for (const item of this.dropList) {
                accumulatedWeight += item.weight;
                if (randomWeight <= accumulatedWeight) {
                    itemIdx = this.dropList.indexOf(item);
                    break;
                }
            }
            // const ranIdx = Math.floor(Math.random() * this.dropList.length);
            const dropItem = this.physics.add.image(
                dropX,
                dropY,
                this.dropList[itemIdx].item
            );
            dropItem.setScale(1.5);
            this.tweens.add({
                targets: dropItem,
                y: "-=10",
                duration: 1000,
                yoyo: true,
                repeat: -1,
            });
            if (!this.theseus) {
                return;
            }
            this.physics.add.overlap(
                this.theseus,
                dropItem,
                this.handlePlayerItemGet,
                undefined,
                this
            );
        }
    }

    private handlePlayerItemGet(
        player:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile,
        item:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile
    ) {
        const dropItem =
            item as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        this.itemList.push(dropItem.texture.key);
        console.log(this.itemList);
        dropItem.destroy();
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
        console.log(
            "sword",
            this.theseus.getSword.damage,
            this.theseus.getSword.attackType,
            this.theseus.getSword.speed,
            "\nbow",
            this.theseus.getBow.damage,
            this.theseus.getBow.attackType,
            this.theseus.getBow.speed,
            "\nupgrades",
            this.upgrades,
            upgradeList
        );
    }

    update() {
        const enemyRemained = this.redEyesSkeletons?.getChildren();
        if (enemyRemained!.length === 0) {
            this.events.emit("enemyDefeated");
        }

        if (this.theseus) {
            this.theseus.update(this.cursors!);
        }

        if (this.redEyesSkeletons) {
            this.redEyesSkeletons.children.iterate((c) => {
                const redEyesSkeleton = c as RedEyesSkeleton;
                redEyesSkeleton.update();
                return true;
            });
        }
    }
}
