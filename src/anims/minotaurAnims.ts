import Phaser from "phaser";

const createMinotaurAnims = (anims: Phaser.Animations.AnimationManager) => {
    anims.create({
        key: "minotaur-idle-down",
        frames: [{ key: "minotaur", frame: "minotaur_black_01.png" }],
    });
    anims.create({
        key: "minotaur-idle-up",
        frames: [{ key: "minotaur", frame: "minotaur_black_07.png" }],
    });
    anims.create({
        key: "minotaur-idle-side",
        frames: [{ key: "minotaur", frame: "minotaur_black_04.png" }],
    });

    anims.create({
        key: "minotaur-run-down",
        frames: anims.generateFrameNames("minotaur", {
            start: 0,
            end: 2,
            prefix: "minotaur_black_0",
            suffix: ".png",
        }),
        repeat: -1,
        frameRate: 3,
    });
    anims.create({
        key: "minotaur-run-up",
        frames: anims.generateFrameNames("minotaur", {
            start: 6,
            end: 8,
            prefix: "minotaur_black_0",
            suffix: ".png",
        }),
        repeat: -1,
        frameRate: 3,
    });
    anims.create({
        key: "minotaur-run-side",
        frames: anims.generateFrameNames("minotaur", {
            start: 3,
            end: 5,
            prefix: "minotaur_black_0",
            suffix: ".png",
        }),
        repeat: -1,
        frameRate: 3,
    });
};

export { createMinotaurAnims };
