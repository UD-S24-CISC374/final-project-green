import Phaser from "phaser";
import { sceneEvents } from "../events/eventsCenter";

enum HealthState {
    IDLE,
    DAMAGE,
    DEAD,
}

export default class RedEyesSkeleton extends Phaser.Physics.Arcade.Sprite {
    private target?: Phaser.Physics.Arcade.Sprite;

    private healthState = HealthState.IDLE;
    private damageTime = 0;
    private _health = 20;
    private maxHealth = 20;
    private speed = 50;
    private healthBar: Phaser.GameObjects.Graphics;

    get health() {
        return this._health;
    }

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        frame?: string | number
    ) {
        super(scene, x, y, texture, frame);
        this.anims.play("redEyesSkeleton-idle-down");
        this.createHealthBar();
    }

    setTarget(target: Phaser.Physics.Arcade.Sprite) {
        this.target = target;
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
            this.speed = 40;
            this.setTint(0x0000ff);
            this.scene.time.delayedCall(6000, () => {
                this.speed = 50;
                this.clearTint();
            });
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

        if (!this.target || !this.body) {
            return;
        }

        if (this.x <= this.target.x && Math.abs(this.x - this.target.x) > 30) {
            this.anims.play("redEyesSkeleton-run-side", true);
            this.scaleX = -1;
            this.body.offset.x = 16;
        } else if (
            this.x > this.target.x &&
            Math.abs(this.x - this.target.x) > 30
        ) {
            this.anims.play("redEyesSkeleton-run-side", true);
            this.scaleX = 1;
            this.body.offset.x = 0;
        } else if (this.y <= this.target.y) {
            this.anims.play("redEyesSkeleton-run-down", true);
            this.body.offset.y = 4;
        } else if (this.y > this.target.y) {
            this.anims.play("redEyesSkeleton-run-up", true);
            this.body.offset.y = 4;
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
