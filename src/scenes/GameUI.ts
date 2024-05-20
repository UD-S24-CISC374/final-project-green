import Phaser from "phaser";
import { sceneEvents } from "../events/eventsCenter";

export default class GameUI extends Phaser.Scene {
    private hp: number;
    private threads: number;
    private weaponType: string;

    private hearts: Phaser.GameObjects.Group;
    private weaponBox: Phaser.GameObjects.Image;
    private sword: Phaser.GameObjects.Image;
    private bow: Phaser.GameObjects.Sprite;

    private swordStatus: string[];
    private bowStatus: string[];

    private swordDamage: Phaser.GameObjects.Text;
    private swordSpeed: Phaser.GameObjects.Text;
    private swordType: Phaser.GameObjects.Text;
    private bowDamage: Phaser.GameObjects.Text;
    private bowSpeed: Phaser.GameObjects.Text;
    private bowType: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "game-ui" });
        this.swordStatus = [];
        this.bowStatus = [];
    }

    init(data: {
        hp: number;
        threads: number;
        weaponType: string;
        swordStatus: string[];
        bowStatus: string[];
    }) {
        this.hp = data.hp;
        this.threads = data.threads;
        this.weaponType = data.weaponType;
        this.swordStatus = data.swordStatus;
        this.bowStatus = data.bowStatus;
    }

    create() {
        this.hearts = this.add.group({ classType: Phaser.GameObjects.Image });
        this.hearts.createMultiple({
            key: "heart-full",
            setXY: {
                x: 30,
                y: 30,
                stepX: 16,
            },
            quantity: 3,
        });

        if (this.hp < 3) {
            this.hearts.children.each((go, idx) => {
                const heart = go as Phaser.GameObjects.Image;
                if (idx < this.hp) {
                    heart.setTexture("heart-full");
                } else {
                    heart.setTexture("heart-empty");
                }
                return true;
            });
        }

        this.add.image(30, 50, "threads");
        this.add.text(40, 41, `${this.threads}`, {
            fontSize: "12px",
            fontFamily: "Academy Engraved LET",
            strokeThickness: 2,
            stroke: "0xffffff",
        });

        this.weaponBox = this.add.image(
            this.cameras.main.width - 40,
            38,
            "weaponBox"
        );
        this.weaponBox.setScale(0.01, 0.01);

        this.sword = this.add.image(this.cameras.main.width - 40, 38, "sword");
        this.bow = this.add.sprite(
            this.cameras.main.width - 38,
            39,
            "bow",
            "Bow-1.png"
        );

        this.swordDamage = this.add.text(
            this.cameras.main.width - 135,
            15,
            `Damage: ${this.swordStatus[0]}`,
            {
                fontSize: "12px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 2,
                stroke: "0xffffff",
            }
        );

        this.swordSpeed = this.add.text(
            this.cameras.main.width - 135,
            30,
            `Speed: ${this.swordStatus[1]}`,
            {
                fontSize: "12px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 2,
                stroke: "0xffffff",
            }
        );

        this.swordType = this.add.text(
            this.cameras.main.width - 135,
            45,
            `Type: ${this.swordStatus[2]}`,
            {
                fontSize: "12px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 2,
                stroke: "0xffffff",
            }
        );

        this.bowDamage = this.add.text(
            this.cameras.main.width - 135,
            15,
            `Damage: ${this.bowStatus[0]}`,
            {
                fontSize: "12px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 2,
                stroke: "0xffffff",
            }
        );

        this.bowSpeed = this.add.text(
            this.cameras.main.width - 135,
            30,
            `Speed: ${this.bowStatus[1]}`,
            {
                fontSize: "12px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 2,
                stroke: "0xffffff",
            }
        );

        this.bowType = this.add.text(
            this.cameras.main.width - 135,
            45,
            `Type: ${this.bowStatus[2]}`,
            {
                fontSize: "12px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 2,
                stroke: "0xffffff",
            }
        );

        if (this.weaponType === "sword") {
            this.sword.setVisible(true);
            this.bow.setVisible(false);

            this.swordDamage.setVisible(true);
            this.swordSpeed.setVisible(true);
            this.swordType.setVisible(true);
            this.bowDamage.setVisible(false);
            this.bowSpeed.setVisible(false);
            this.bowType.setVisible(false);
        } else if (this.weaponType === "bow") {
            this.bow.setVisible(true);
            this.sword.setVisible(false);

            this.swordDamage.setVisible(false);
            this.swordSpeed.setVisible(false);
            this.swordType.setVisible(false);
            this.bowDamage.setVisible(true);
            this.bowSpeed.setVisible(true);
            this.bowType.setVisible(true);
        }

        sceneEvents.on(
            "player-health-changed",
            this.handlePlayerHealthChanged,
            this
        );

        sceneEvents.on(
            "player-weapon-changed",
            this.handlePlayerWeaponChanged,
            this
        );

        sceneEvents.on(
            "weapon-status-update",
            (data: { swordStatus: string[]; bowStatus: string[] }) => {
                this.handleWeaponUpdated(data.swordStatus, data.bowStatus);
            },
            this
        );
    }

    private handlePlayerHealthChanged(health: number) {
        this.hearts.children.each((go, idx) => {
            const heart = go as Phaser.GameObjects.Image;
            if (idx < health) {
                heart.setTexture("heart-full");
            } else {
                heart.setTexture("heart-empty");
            }
            return true;
        });
    }

    private handlePlayerWeaponChanged(weaponType: string) {
        if (weaponType === "sword") {
            this.sword.setVisible(true);
            this.bow.setVisible(false);
            this.swordDamage.setVisible(true);
            this.swordSpeed.setVisible(true);
            this.swordType.setVisible(true);
            this.bowDamage.setVisible(false);
            this.bowSpeed.setVisible(false);
            this.bowType.setVisible(false);
        } else if (weaponType === "bow") {
            this.bow.setVisible(true);
            this.sword.setVisible(false);
            this.swordDamage.setVisible(false);
            this.swordSpeed.setVisible(false);
            this.swordType.setVisible(false);
            this.bowDamage.setVisible(true);
            this.bowSpeed.setVisible(true);
            this.bowType.setVisible(true);
        }
    }
    private handleWeaponUpdated(swordStatus: string[], bowStatus: string[]) {
        this.swordDamage.setText(`Damage: ${swordStatus[0]}`);
        this.swordSpeed.setText(`Speed: ${swordStatus[1]}`);
        this.swordType.setText(`Type: ${swordStatus[2]}`);
        this.bowDamage.setText(`Damage: ${bowStatus[0]}`);
        this.bowSpeed.setText(`Speed: ${bowStatus[1]}`);
        this.bowType.setText(`Type: ${bowStatus[2]}`);
    }
}
