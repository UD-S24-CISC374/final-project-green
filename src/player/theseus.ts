import Phaser from "phaser";
import { sceneEvents } from "../events/eventsCenter";
import "../weapons/sword";
import Sword from "../weapons/sword";
import "../weapons/bow";
import Bow from "../weapons/bow";

declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            theseus(
                x: number,
                y: number,
                texture: string,
                frame?: string | number
            ): Theseus;
        }
    }
}

enum HealthState {
    IDLE,
    DAMAGE,
    DEAD,
}

export default class Theseus extends Phaser.Physics.Arcade.Sprite {
    private healthState = HealthState.IDLE;
    private damageTime = 0;

    private _health = 3;

    private weapon: Sword | Bow;
    private _weaponType = "sword";
    private sword: Sword;
    private bow: Bow;
    private mouse?: Phaser.Input.Pointer;

    private canAttack = true;
    private invincibility = false;
    private _gameOver = false;

    private shiftKeyPressed = false;

    private _canUseBow = true;

    get health() {
        return this._health;
    }

    set health(newHealth: number) {
        this._health = newHealth;
    }

    get gameOVer() {
        return this._gameOver;
    }

    get getWeapon() {
        return this.weapon;
    }

    get weaponType() {
        return this._weaponType;
    }

    set weaponType(newWeapon: string) {
        this._weaponType = newWeapon;
    }

    set canUseBow(flag: boolean) {
        this._canUseBow = flag;
    }

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        frame?: string | number
    ) {
        super(scene, x, y, texture, frame);
        this.anims.play("faune-idle-down");

        this.mouse = this.scene.input.mousePointer;

        this.sword = this.scene.add.sword(this.x + 5, this.y + 7, "sword");
        this.bow = this.scene.add.bow(this.x + 5, this.y + 7, "bow");

        this.canAttack = true;
        this.setDepth(500);
    }

    handleDamage(dir: Phaser.Math.Vector2) {
        if (this._health <= 0) {
            return;
        }
        if (this.healthState === HealthState.DAMAGE) {
            return;
        }
        if (this.invincibility) {
            return;
        }

        --this._health;

        if (this._health <= 0) {
            this.healthState = HealthState.DEAD;
            this.anims.play("faune-faint");
            this.setVelocity(0, 0);
            sceneEvents.emit("gameOver");
            this.scene.physics.pause();
            this._gameOver = true;
        } else {
            this.setVelocity(dir.x, dir.y);
            this.setTint(0xff0000);
            this.healthState = HealthState.DAMAGE;
            this.damageTime = 0;
            this.alpha = 0.5;
            this.invincibility = true;
            this.scene.time.delayedCall(1000, () => {
                this.alpha = 1;
                this.invincibility = false;
            });
        }
    }

    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt);
        switch (this.healthState) {
            case HealthState.IDLE:
                break;
            case HealthState.DAMAGE:
                this.damageTime += dt;
                if (this.damageTime >= 250) {
                    this.healthState = HealthState.IDLE;
                    this.setTint(0xffffff);
                    this.damageTime = 0;
                }
                break;
        }
        if (this._weaponType === "sword") {
            this.weapon = this.sword;
            this.bow.setVisible(false);
        } else if (this._weaponType === "bow") {
            this.weapon = this.bow;
            this.sword.setVisible(false);
        }
    }

    private handleAttack(angle: number) {
        this.canAttack = false;

        if (this.weapon instanceof Sword) {
            this.weapon.handleSwordSlash(angle);
            this.scene.time.delayedCall(600, () => {
                this.canAttack = true;
            });
        } else if (this.weapon instanceof Bow) {
            this.weapon.handleArrow(angle);
            this.scene.time.delayedCall(400, () => {
                this.canAttack = true;
            });
        }
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (
            this.healthState === HealthState.DAMAGE ||
            this.healthState === HealthState.DEAD
        ) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!cursors || !this.body) {
            return;
        }

        const speed = 100;

        this.weapon.setY(this.y + 7);

        const keyA = this.scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.A,
            false
        );
        const keyS = this.scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.S,
            false
        );
        const keyD = this.scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.D,
            false
        );
        const keyW = this.scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.W,
            false
        );

        if (keyA?.isDown) {
            this.anims.play("faune-run-side", true);
            this.setVelocity(-speed, 0);
            this.scaleX = -1;
            this.body.offset.x = 24;
            this.weapon.setX(this.x - 5);
            if (this.weaponType === "bow") {
                this.weapon.setX(this.x - 8);
            }
            this.weapon.setDepth(1000);
        } else if (keyD?.isDown) {
            this.anims.play("faune-run-side", true);
            this.setVelocity(speed, 0);
            this.scaleX = 1;
            this.body.offset.x = 8;
            this.weapon.setX(this.x + 5);
            this.weapon.setDepth(1000);
        } else if (keyW?.isDown) {
            this.anims.play("faune-run-up", true);
            this.setVelocity(0, -speed);
            this.body.offset.y = 4;
            this.weapon.setX(this.x + 5);
            this.weapon.setY(this.y);
            this.weapon.setDepth(0);
        } else if (keyS?.isDown) {
            this.anims.play("faune-run-down", true);
            this.setVelocity(0, speed);
            this.weapon.setX(this.x + 5);
            if (this.weaponType === "bow") {
                this.weapon.setY(this.y + 15);
            }
            this.weapon.setDepth(1000);
        } else {
            const parts = this.anims.currentAnim?.key.split("-") as string[];
            parts[1] = "idle";
            this.anims.play(parts.join("-"));
            this.setVelocity(0, 0);
            this.weapon.setX(this.x + 5);
        }

        const keyShift = this.scene.input.keyboard?.addKey(
            Phaser.Input.Keyboard.KeyCodes.SHIFT
        );

        if (keyShift?.isDown) {
            if (!this.shiftKeyPressed && this._canUseBow) {
                this.shiftKeyPressed = true;
                if (this._weaponType === "sword") {
                    this._weaponType = "bow";
                    this.weapon.setVisible(false);
                    this.weapon = this.bow!;
                    this.weapon.setVisible(true);
                    sceneEvents.emit("player-weapon-changed", this._weaponType);
                } else if (this._weaponType === "bow") {
                    this._weaponType = "sword";
                    this.weapon.setVisible(false);
                    this.weapon = this.sword!;
                    this.weapon.setVisible(true);
                    sceneEvents.emit("player-weapon-changed", this._weaponType);
                }
            }
        }
        if (keyShift?.isUp) {
            this.shiftKeyPressed = false;
        }

        let angle = Phaser.Math.Angle.Between(
            this.weapon.x!,
            this.weapon.y!,
            this.scene.input.x,
            this.scene.input.y
        );

        if (this._weaponType === "sword") {
            this.weapon.setRotation(angle + Math.PI / 4);
        } else if (this._weaponType === "bow") {
            this.weapon.setRotation(angle + (Math.PI * 4) / 5);
        }

        if (this.mouse?.isDown && this.canAttack) {
            this.handleAttack(angle);
        }
    }
}

Phaser.GameObjects.GameObjectFactory.register(
    "theseus",
    function (
        this: Phaser.GameObjects.GameObjectFactory,
        x: number,
        y: number,
        texture: string,
        frame?: string | number
    ) {
        var sprite = new Theseus(this.scene, x, y, texture, frame);

        this.displayList.add(sprite);
        this.updateList.add(sprite);

        this.scene.physics.world.enableBody(
            sprite,
            Phaser.Physics.Arcade.DYNAMIC_BODY
        );

        sprite.body?.setSize(sprite.width * 0.5, sprite.height * 0.8);

        return sprite;
    }
);
