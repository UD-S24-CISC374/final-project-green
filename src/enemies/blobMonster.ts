import Phaser from "phaser";
import { sceneEvents } from "../events/eventsCenter";

enum HealthState {
    IDLE,
    DAMAGE,
    DEAD,
}

enum DamageState {
    IDLE,
    ICE,
    FIRE,
    POISON,
}

export default class BlobMonster extends Phaser.Physics.Arcade.Sprite {
    private target?: Phaser.Physics.Arcade.Sprite;

    private healthState = HealthState.IDLE;
    private currentState = DamageState.IDLE;

    private damageTime = 0;
    private effectTime = 0;
    private decreaseTime = 0;

    private _health = 10;
    private maxHealth = 10;
    private speed = 50;
    private isEasyMode: boolean;

    private healthBar: Phaser.GameObjects.Graphics;

    get health() {
        return this._health;
    }

    set setEasyMode(isEasyMode: boolean) {
        this.isEasyMode = isEasyMode;
    }

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        frame?: string | number
    ) {
        super(scene, x, y, texture, frame);
        this.anims.play("blob_monster_moving");
        this.createHealthBar();
    }

    setTarget(target: Phaser.Physics.Arcade.Sprite) {
        this.target = target;
    }

    updateStatus(speed: number, maxHealth: number) {
        this.speed = speed;
        this._health = maxHealth;
        this.maxHealth = maxHealth;
        this.updateHealthBarSize();
    }

    handleDamage(damage: number, attackType: string) {
        if (this._health <= 0) {
            return;
        }
        if (this.healthState === HealthState.DAMAGE) {
            return;
        }

        this._health -= damage;

        if (this._health <= 0) {
            this.healthState = HealthState.DEAD;
            this._health = 0;
            this.setVelocity(0, 0);
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    this.healthBar.destroy();
                    this.destroy();
                },
            });
            sceneEvents.emit("enemy-destroyed", this.x, this.y);
        } else {
            this.setTint(0xff0000);
            this.healthState = HealthState.DAMAGE;
            this.damageTime = 0;
        }

        if (attackType === "ice") {
            this.currentState = DamageState.ICE;
            this.effectTime = 0;
            this.speed = this.isEasyMode ? 30 : 40;

            this.setTint(0x0000ff);
        } else if (attackType === "fire") {
            this.currentState = DamageState.FIRE;
            this.effectTime = 0;
            this.setTint(0xffff00);
        }
        if (attackType === "poison") {
            this.currentState = DamageState.POISON;
            this.effectTime = 0;
            this.setTint(0x00ff00);
        }
    }

    handleEffectDamage(damage: number) {
        if (this._health <= 0) {
            return;
        }

        this._health -= damage;

        if (this._health <= 0) {
            this.healthState = HealthState.DEAD;
            this._health = 0;
            this.setVelocity(0, 0);
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    this.healthBar.destroy();
                    this.destroy();
                },
            });
            sceneEvents.emit("enemy-destroyed", this.x, this.y);
        }
    }

    createHealthBar() {
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBarPosition();
        this.updateHealthBarSize();
    }

    updateHealthBarPosition() {
        this.healthBar.x = this.x - 15;
        this.healthBar.y = this.y - 20;
    }

    updateHealthBarSize() {
        this.healthBar.clear();

        this.healthBar.fillStyle(0x000000, 0.8);
        this.healthBar.fillRect(0, 0, 25, 3);

        const width = (this.health / this.maxHealth) * 25;

        this.healthBar.fillStyle(0xff0000, 1);
        this.healthBar.fillRect(0, 0, width, 3);
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

        switch (this.currentState) {
            case DamageState.IDLE:
                break;
            case DamageState.ICE:
                this.effectTime += dt;
                if (this.effectTime > 250) {
                    this.setTint(0x0000ff);
                }
                if (this.effectTime >= 2000) {
                    this.currentState = DamageState.IDLE;
                    this.speed = this.isEasyMode ? 40 : 50;
                    this.setTint(0xffffff);
                    this.effectTime = 0;
                }
                break;
            case DamageState.FIRE:
                this.effectTime += dt;
                this.decreaseTime += dt;
                if (this.effectTime > 250) {
                    this.setTint(0xffff00);
                }
                if (this.decreaseTime >= 200) {
                    this.setTint(0xffffff);
                }
                if (this.decreaseTime >= 400) {
                    this.handleEffectDamage(0.5);
                    this.setTint(0xffff00);

                    console.log(this._health);
                    this.decreaseTime = 0;
                }
                if (this.effectTime >= 1600) {
                    this.currentState = DamageState.IDLE;
                    this.setTint(0xffffff);
                    this.effectTime = 0;
                }
                break;
            case DamageState.POISON:
                this.effectTime += dt;
                this.decreaseTime += dt;
                if (this.effectTime > 250) {
                    this.setTint(0x00ff00);
                }
                if (this.decreaseTime >= 200) {
                    this.setTint(0xffffff);
                }
                if (this.decreaseTime >= 400) {
                    this.handleEffectDamage(0.25);
                    this.setTint(0x00ff00);
                    this.decreaseTime = 0;
                }
                if (this.effectTime >= 1600) {
                    this.currentState = DamageState.IDLE;
                    this.setTint(0xffffff);
                    this.effectTime = 0;
                }
                break;
        }

        if (!this.target || !this.body) {
            return;
        }

        if (this.x <= this.target.x && Math.abs(this.x - this.target.x) > 30) {
            this.anims.play("blob_monster_moving", true);
            this.scaleX = 1;
            this.body.offset.x = 0;
        } else if (
            this.x > this.target.x &&
            Math.abs(this.x - this.target.x) > 30
        ) {
            this.anims.play("blob_monster_moving", true);
            this.scaleX = -1;
            this.body.offset.x = 20;
        } else if (this.y <= this.target.y) {
            this.anims.play("blob_monster_moving", true);
            this.body.offset.y = 12;
        } else if (this.y > this.target.y) {
            this.anims.play("blob_monster_moving", true);
            this.body.offset.y = 12;
        }
        this.scene.physics.moveTo(
            this,
            this.target.x,
            this.target.y,
            this.speed
        );
    }

    update() {
        this.updateHealthBarPosition();
        this.updateHealthBarSize();
    }
}
