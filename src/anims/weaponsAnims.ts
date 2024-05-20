import Phaser from "phaser";

const createWeaponsAnims = (anims: Phaser.Animations.AnimationManager) => {
    anims.create({
        key: "sword_attack",
        frames: anims.generateFrameNames("swordSlash", {
            start: 13,
            end: 18,
            prefix: "Classic_",
            suffix: ".png",
        }),
        frameRate: 20,
    });

    anims.create({
        key: "sword_attack_ice",
        frames: anims.generateFrameNames("swordSlash-ice", {
            start: 13,
            end: 18,
            prefix: "Alternative_2_",
            suffix: ".png",
        }),
        frameRate: 20,
    });

    anims.create({
        key: "sword_attack_fire",
        frames: anims.generateFrameNames("swordSlash-fire", {
            start: 13,
            end: 18,
            prefix: "Alternative_3_",
            suffix: ".png",
        }),
        frameRate: 20,
    });

    anims.create({
        key: "bow-idle",
        frames: [{ key: "bow", frame: "Bow-1.png" }],
    });

    anims.create({
        key: "bow_attack",
        frames: anims.generateFrameNames("bow", {
            start: 1,
            end: 8,
            prefix: "Bow-",
            suffix: ".png",
        }),
        frameRate: 20,
    });
};

export { createWeaponsAnims };
