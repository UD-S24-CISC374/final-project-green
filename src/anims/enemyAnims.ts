import Phaser from "phaser";

const createRedEyesSkeletonAnims = (
    anims: Phaser.Animations.AnimationManager
) => {
    anims.create({
        key: "redEyesSkeleton-idle-down",
        frames: [
            { key: "skeleton_red_eyes", frame: "skeleton_red_eyes_01.png" },
        ],
    });
    anims.create({
        key: "redEyesSkeleton-idle-up",
        frames: [
            { key: "skeleton_red_eyes", frame: "skeleton_red_eyes_07.png" },
        ],
    });
    anims.create({
        key: "redEyesSkeleton-idle-side",
        frames: [
            { key: "skeleton_red_eyes", frame: "skeleton_red_eyes_04.png" },
        ],
    });

    anims.create({
        key: "redEyesSkeleton-run-down",
        frames: anims.generateFrameNames("skeleton_red_eyes", {
            start: 0,
            end: 2,
            prefix: "skeleton_red_eyes_0",
            suffix: ".png",
        }),
        repeat: -1,
        frameRate: 10,
    });
    anims.create({
        key: "redEyesSkeleton-run-up",
        frames: anims.generateFrameNames("skeleton_red_eyes", {
            start: 6,
            end: 8,
            prefix: "skeleton_red_eyes_0",
            suffix: ".png",
        }),
        repeat: -1,
        frameRate: 10,
    });
    anims.create({
        key: "redEyesSkeleton-run-side",
        frames: anims.generateFrameNames("skeleton_red_eyes", {
            start: 3,
            end: 5,
            prefix: "skeleton_red_eyes_0",
            suffix: ".png",
        }),
        repeat: -1,
        frameRate: 10,
    });
};

const createFlyingBatAnims = (anims: Phaser.Animations.AnimationManager) => {
    anims.create({
        key: "flying_bat_flapping",
        frames: anims.generateFrameNames("flying_bat", {
            start: 1,
            end: 7,
            prefix: "fly0",
            suffix: ".png",
        }),
        frameRate: 10,
        repeat: -1,
    });
};

const createBlobMonsterAnims = (anims: Phaser.Animations.AnimationManager) => {
    anims.create({
        key: "blob_monster_moving",
        frames: anims.generateFrameNames("blob_monster", {
            start: 1,
            end: 8,
            prefix: "walk0",
            suffix: ".png",
        }),
        frameRate: 10,
        repeat: -1,
    });
};

export { createFlyingBatAnims };
export { createRedEyesSkeletonAnims };
export { createBlobMonsterAnims };
