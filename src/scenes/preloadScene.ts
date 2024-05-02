import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.image("background", "assets/img/background.jpg");
        this.load.image("base_tiles", "assets/tileset.png");
        this.load.tilemapTiledJSON("tilemap", "assets/maze_background.json");

        this.load.atlas(
            "faune",
            "assets/characters/fauna.png",
            "assets/characters/fauna.json"
        );
        this.load.image("sword", "assets/weapons/sword_normal.png");
        this.load.atlas(
            "swordSlash",
            "assets/weapons/swordSlash.png",
            "assets/weapons/swordSlash.json"
        );

        this.load.atlas(
            "skeleton_red_eyes",
            "assets/characters/skeleton_red_eyes.png",
            "assets/characters/skeleton_red_eyes.json"
        );
        this.load.atlas(
            "minotaur",
            "assets/characters/minotaur_black.png",
            "assets/characters/minotaur_black.json"
        );

        this.load.atlas(
            "flying_bat",
            "assets/characters/flying_bat.png",
            "assets/characters/flying_bat.json"
        );

        this.load.image("heart-empty", "assets/ui_heart_empty.png");
        this.load.image("heart-full", "assets/ui_heart_full.png");

        //Load the music for the titleScene
        this.load.audio("titleScene", ["assets/Music/titleScene.mp3"]);

        //Load the image of Ariadne
        this.load.image("Ariadne", "assets/characters/Ariadne.png");

        //Load the image of the next button
        this.load.image("ArrowButton", "assets/Buttons/ArrowButton.png");

        //Load the image of the map frame
        this.load.image("BlackFrame", "assets/img/BlackFrame.png");

        this.load.image("threads", "assets/threads.png");
        this.load.image("weaponBox", "assets/weaponBox.png");
        this.load.atlas(
            "bow",
            "assets/weapons/bow.png",
            "assets/weapons/bow.json"
        );
        this.load.image("arrow", "assets/weapons/arrow.png");
        this.load.image("next-button", "assets/next_button.png");

        this.load.image("sword-damage-up", "assets/items/sword_damage_up.png");
        this.load.image("sword-speed-up", "assets/items/sword_speed_up.png");
        this.load.image("sword-fire", "assets/items/sword_fire.png");
        this.load.image("sword-ice", "assets/items/sword_ice.png");
        this.load.image("bow-damage-up", "assets/items/bow_damage_up.png");
        this.load.image("bow-speed-up", "assets/items/bow_speed_up.png");
        this.load.image("bow-poison", "assets/items/bow_poison.png");
        this.load.image("bow-triple", "assets/items/bow_triple.png");

        this.load.image("tuto-move", "assets/tuto_move.png");
        this.load.image("tuto-attack", "assets/tuto_attack.png");
        this.load.image("tuto-weapon-change", "assets/tuto_weapon_change.png");
        this.load.image("tuto-enter-door", "assets/tuto_enter_door.png");
        this.load.image("tuto-weapon-design", "assets/tuto_weapon_design.png");
        this.load.image("tuto-pause", "assets/tuto_pause.png");
    }

    create() {
        this.scene.start("TitleScene");
    }
}
