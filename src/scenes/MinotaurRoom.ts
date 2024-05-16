import Phaser from "phaser";
import { debugDraw } from "../utils/debug";
import { createMinotaurAnims } from "../anims/minotaurAnims";
import { createTheseusAnims } from "../anims/theseusAnims";
import { createWeaponsAnims } from "../anims/weaponsAnims";
import minotaur from "../enemies/minotaur";
import Minotaur from "../enemies/minotaur";
import "../enemies/minotaur";
import "../player/theseus";
import Theseus from "../player/theseus";
import { sceneEvents } from "../events/eventsCenter";

export type Collidable =
    | Phaser.Types.Physics.Arcade.GameObjectWithBody
    | Phaser.Tilemaps.Tile;

export default class MinotaurRoom extends Phaser.Scene {
    private theseus?: Theseus;
    private map: Phaser.Tilemaps.Tilemap;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private minotaur?: Phaser.Physics.Arcade.Group;
    private playerEnemyCollider?: Phaser.Physics.Arcade.Collider;
    private hp: number;
    private threads: number;
    private weapon: string;
    private itemList: string[];
    private updateCodeList: string[] | undefined;
    private upgrades = 0;
    private isEasyMode: boolean;
    private swordStatus: string[];
    private bowStatus: string[];

    // private healthBar: Phaser.GameObjects.Graphics;

    private dropList = [
        { item: "sword-damage-up", weight: 15 },
        { item: "sword-speed-up", weight: 15 },
        { item: "sword-fire", weight: 10 },
        { item: "sword-ice", weight: 10 },
        { item: "bow-damage-up", weight: 15 },
        { item: "bow-speed-up", weight: 15 },
        { item: "bow-poison", weight: 10 },
        { item: "bow-triple", weight: 10 },
    ];

    constructor() {
        super({ key: "minotaur" });
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
        this.scene.run("game-ui", {
            hp: this.theseus?.health,
            threads: this.threads,
            weaponType: this.theseus?.weaponType,
            swordStatus: this.swordStatus,
            bowStatus: this.bowStatus,
        });
        createTheseusAnims(this.anims);
        createMinotaurAnims(this.anims);
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
            "minotaur-wall",
            tileset
        ) as Phaser.Tilemaps.TilemapLayer;
        this.map.createLayer("minotaur-objects", tileset);

        wallsLayer.setCollisionByProperty({ collides: true }, true);

        debugDraw(wallsLayer, this, false);

        this.theseus = this.add.theseus(
            this.cameras.main.width * 0.5,
            this.cameras.main.height * 0.9,
            "faune"
        );
        this.theseus.health = this.hp;
        this.theseus.weaponType = this.weapon;
        this.theseus.anims.play("faune-idle-up");

        this.theseus.getSword.damage = parseInt(this.swordStatus[0]);
        this.theseus.getSword.speed = parseInt(this.swordStatus[1]);
        this.theseus.getSword.attackType = this.swordStatus[2];

        this.theseus.getBow.damage = parseInt(this.bowStatus[0]);
        this.theseus.getBow.speed = parseInt(this.bowStatus[1]);
        this.theseus.getBow.attackType = this.bowStatus[2];

        this.minotaur = this.physics.add.group({
            classType: Minotaur,
        });

        this.minotaur.get(
            this.cameras.main.width * 0.5,
            this.cameras.main.height * 0.3,
            "minotaur"
        );

        this.minotaur.children.iterate((c) => {
            const minotaur = c as Minotaur;
            minotaur.setTarget(this.theseus!);
            minotaur.setEasyMode = this.isEasyMode;
            if (this.isEasyMode) {
                minotaur.updateStatus(50, 300);
            }
            minotaur.body?.setSize(minotaur.width * 0.3, minotaur.height * 0.7);
            minotaur.setOrigin(0.5);
            return true;
        });

        // this.createHealthBar();

        this.physics.add.collider(this.theseus, wallsLayer);

        this.physics.add.collider(this.minotaur, wallsLayer);

        this.physics.add.collider(this.minotaur, this.minotaur);

        this.playerEnemyCollider = this.physics.add.collider(
            this.minotaur,
            this.theseus,
            this.handlePlayerEnemyCollision,
            undefined,
            this
        );

        this.events.on(
            "swordSlashCreated",
            (swordSlash: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
                if (this.minotaur) {
                    this.physics.add.collider(
                        swordSlash,
                        this.minotaur,
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
                if (this.minotaur) {
                    this.physics.add.collider(
                        arrow,
                        this.minotaur,
                        this.handleEnemyBowAttacked,
                        undefined,
                        this
                    );
                }
            }
        );

        sceneEvents.on("gameRetry", () => {
            if (!this.theseus) {
                return;
            }
            this.theseus.health = this.hp;
            this.threads = 5;
        });

        this.input.keyboard?.on("keydown-ESC", () => {
            this.scene.pause();
            this.scene.run("pause", { currentScene: "minotaur" });
        });

        this.input.keyboard?.on("keydown-E", () => {
            let tempList: string[] = [];
            if (this.updateCodeList != undefined) {
                tempList = this.updateCodeList;
            }
            this.scene.pause();
            this.scene.run("weapon-design", {
                from: "minotaur",
                itemList: this.itemList,
                updateCodeList: tempList,
            });
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

    private handlePlayerEnemyCollision(
        obj1:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile,
        obj2:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile
    ) {
        const minotaur = obj2 as Minotaur;

        const dx = this.theseus!.x - minotaur.x;
        const dy = this.theseus!.y - minotaur.y;

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
        const minotaur = obj2 as Minotaur;
        const swordSlash =
            obj1 as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        this.events.emit("swordSlashHit", swordSlash);

        if (this.theseus?.getWeapon) {
            minotaur.handleDamage(
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
        const minotaur = obj2 as minotaur;
        const arrow = obj1 as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        this.events.emit("arrowHit", arrow);

        if (this.theseus?.getWeapon) {
            minotaur.handleDamage(
                this.theseus.getWeapon.damage,
                this.theseus.getWeapon.attackType
            );
        }
    }

    private handleWeaponUpdated(upgradeList: string[]) {
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
        console.log(
            "sword",
            this.theseus?.getSword.damage,
            this.theseus?.getSword.attackType,
            this.theseus?.getSword.speed,
            "\nbow",
            this.theseus?.getBow.damage,
            this.theseus?.getBow.attackType,
            this.theseus?.getBow.speed,
            "\nupgrades",
            this.upgrades,
            upgradeList
        );
    }

    update() {
        const enemyRemained = this.minotaur?.getChildren();
        if (enemyRemained!.length === 0) {
            this.time.delayedCall(1000, () => {
                this.scene.start("GameClear");
            });
        }

        if (this.theseus) {
            this.theseus.update(this.cursors!);
        }

        if (this.minotaur) {
            this.minotaur.children.iterate((c) => {
                const minotaur = c as minotaur;
                minotaur.update();
                return true;
            });
        }
    }
}
