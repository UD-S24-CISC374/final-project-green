import Phaser from "phaser";

const createWeaponDesignScreen = (
    scene: Phaser.Scene,
    theseusFile: Phaser.GameObjects.Group,
    mainFile: Phaser.GameObjects.Group,
    swordFile: Phaser.GameObjects.Group,
    bowFile: Phaser.GameObjects.Group
) => {
    scene.add
        .rectangle(
            scene.cameras.main.width / 2,
            scene.cameras.main.height / 2,
            scene.cameras.main.width * 0.9,
            scene.cameras.main.height * 0.9,
            0xffffff,
            0.85
        )
        .setOrigin(0.5)
        .setDepth(999);

    scene.add
        .rectangle(
            scene.cameras.main.width * 0.85,
            scene.cameras.main.height / 2,
            1,
            scene.cameras.main.height * 0.9,
            0x000000
        )
        .setOrigin(0.5)
        .setDepth(1000);

    scene.add
        .rectangle(
            scene.cameras.main.width / 2,
            40,
            scene.cameras.main.width * 0.9,
            1,
            0x000000
        )
        .setOrigin(0.5)
        .setDepth(1000);

    scene.add
        .text(scene.cameras.main.width * 0.9, 28, "Items", {
            fontSize: "12px",
            fontFamily: "Academy Engraved LET",
            strokeThickness: 3,
            stroke: "0xffffff",
        })
        .setOrigin(0.5)
        .setDepth(1000);

    //Text group of Theseus.java
    const theseusTitle = scene.add
        .text(scene.cameras.main.width * 0.45, 28, "Theseus.java", {
            fontSize: "12px",
            fontFamily: "Academy Engraved LET",
            strokeThickness: 3,
            stroke: "0xffffff",
        })
        .setOrigin(0.5)
        .setDepth(1000);

    const theseusBody = scene.add
        .text(
            scene.cameras.main.width * 0.05 + 77,
            78,
            "public class Theseus {\n" +
                "\t\t\t\tprivate double speed ;\n" +
                "\t\t\t\tprivate Sword sword ;\n" +
                "\t\t\t\tprivate Bow bow ;",
            {
                fontSize: "12px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 3,
                stroke: "0xffffff",
            }
        )
        .setOrigin(0.5)
        .setDepth(1000);

    const theseusConstructor = scene.add
        .text(
            scene.cameras.main.width * 0.1 + 82,
            168,
            "public Theseus() {\n" +
                "\t\t\t\tthis.speed = 5 ;\n" +
                "\t\t\t\tthis.sword = new Sword() ; \n" +
                "\t\t\t\tthis.bow = new Bow() ;\n}",
            {
                fontSize: "12px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 3,
                stroke: "0xffffff",
            }
        )
        .setOrigin(0.5)
        .setDepth(1000);

    const theseusGetterSetter = scene.add
        .text(
            scene.cameras.main.width * 0.3 + 59,
            265,
            "public double getSpeed() { return this.speed ; }\n" +
                "public double getSword() { return this.sword ; }\n" +
                "public double getBow() { return this.bow ; }\n" +
                "public void setSpeed(double speed) { this.speed = speed ; }\n",
            {
                fontSize: "12px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 3,
                stroke: "0xffffff",
            }
        )
        .setOrigin(0.5)
        .setDepth(1000);
    const theseusClose = scene.add
        .text(scene.cameras.main.width * 0.05 + 10, 305, "}", {
            fontSize: "12px",
            fontFamily: "Academy Engraved LET",
            strokeThickness: 3,
            stroke: "0xffffff",
        })
        .setOrigin(0.5)
        .setDepth(1000);

    theseusFile.add(theseusTitle);
    theseusFile.add(theseusBody);
    theseusFile.add(theseusConstructor);
    theseusFile.add(theseusGetterSetter);
    theseusFile.add(theseusClose);

    //Text group of main.java
    const mainTitle = scene.add
        .text(scene.cameras.main.width * 0.45, 28, "main.java", {
            fontSize: "12px",
            fontFamily: "Academy Engraved LET",
            strokeThickness: 3,
            stroke: "0xffffff",
        })
        .setOrigin(0.5)
        .setDepth(1000);

    const mainBody = scene.add
        .text(
            scene.cameras.main.width * 0.05 + 110,
            60,
            "public static void main(String[] args) {\n" +
                "\t\t\t\tTheseus theseus = new Theseus() ;",
            {
                fontSize: "12px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 3,
                stroke: "0xffffff",
            }
        )
        .setOrigin(0.5)
        .setDepth(1000);
    mainFile.add(mainTitle);
    mainFile.add(mainBody);

    //Text group of Sword.java
    const swordTitle = scene.add
        .text(scene.cameras.main.width * 0.45, 28, "Sword.java", {
            fontSize: "12px",
            fontFamily: "Academy Engraved LET",
            strokeThickness: 3,
            stroke: "0xffffff",
        })
        .setOrigin(0.5)
        .setDepth(1000);

    const swordBody = scene.add
        .text(
            scene.cameras.main.width * 0.05 + 82,
            78,
            "public class Sword {\n" +
                "\t\t\t\tprivate double damage ;\n" +
                "\t\t\t\tprivate double speed ;\n" +
                "\t\t\t\tprivate string type ;",
            {
                fontSize: "12px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 3,
                stroke: "0xffffff",
            }
        )
        .setOrigin(0.5)
        .setDepth(1000);
    const swordConstructor = scene.add
        .text(
            scene.cameras.main.width * 0.1 + 63,
            168,
            "public Sword() {\n" +
                "\t\t\t\tthis.damage = 5 ;\n" +
                "\t\t\t\tthis.speed = 2 ; \n" +
                '\t\t\t\tthis.type =  "classic";\n}',
            {
                fontSize: "12px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 3,
                stroke: "0xffffff",
            }
        )
        .setOrigin(0.5)
        .setDepth(1000);

    const swordGetterSetter = scene.add
        .text(
            scene.cameras.main.width * 0.3 + 38,
            265,
            "public double getDamage() { return this.damage ; }\n" +
                "public double getSpeed() { return this.speed ; }\n" +
                "public double getType() { return this.type ; }\n" +
                "public void setType(string type) { this.type = type ; }\n",
            {
                fontSize: "12px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 3,
                stroke: "0xffffff",
            }
        )
        .setOrigin(0.5)
        .setDepth(1000);

    const swordMethods = scene.add
        .text(
            scene.cameras.main.width * 0.3 + 25,
            320,
            "public void incDamage() { this.damage += 2 ; }\n" +
                "public void incSpeed() { this.speed += 1 ; }",
            {
                fontSize: "12px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 3,
                stroke: "0xffffff",
            }
        )
        .setOrigin(0.5)
        .setDepth(1000);

    const swordClose = scene.add
        .text(scene.cameras.main.width * 0.05 + 10, 347, "}", {
            fontSize: "12px",
            fontFamily: "Academy Engraved LET",
            strokeThickness: 3,
            stroke: "0xffffff",
        })
        .setOrigin(0.5)
        .setDepth(1000);

    swordFile.add(swordTitle);
    swordFile.add(swordBody);
    swordFile.add(swordConstructor);
    swordFile.add(swordGetterSetter);
    swordFile.add(swordMethods);
    swordFile.add(swordClose);

    //Text group of Bow.java
    const bowTitle = scene.add
        .text(scene.cameras.main.width * 0.45, 28, "Bow.java", {
            fontSize: "12px",
            fontFamily: "Academy Engraved LET",
            strokeThickness: 3,
            stroke: "0xffffff",
        })
        .setOrigin(0.5)
        .setDepth(1000);

    const bowBody = scene.add
        .text(
            scene.cameras.main.width * 0.05 + 82,
            78,
            "public class Bow {\n" +
                "\t\t\t\tprivate double damage ;\n" +
                "\t\t\t\tprivate double speed ;\n" +
                "\t\t\t\tprivate string type ;",
            {
                fontSize: "12px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 3,
                stroke: "0xffffff",
            }
        )
        .setOrigin(0.5)
        .setDepth(1000);
    const bowConstructor = scene.add
        .text(
            scene.cameras.main.width * 0.1 + 63,
            168,
            "public Bow() {\n" +
                "\t\t\t\tthis.damage = 3 ;\n" +
                "\t\t\t\tthis.speed = 3 ; \n" +
                '\t\t\t\tthis.type =  "classic";\n}',
            {
                fontSize: "12px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 3,
                stroke: "0xffffff",
            }
        )
        .setOrigin(0.5)
        .setDepth(1000);

    const bowGetterSetter = scene.add
        .text(
            scene.cameras.main.width * 0.3 + 38,
            265,
            "public double getDamage() { return this.damage ; }\n" +
                "public double getSpeed() { return this.speed ; }\n" +
                "public double getType() { return this.type ; }\n" +
                "public void setType(string type) { this.type = type ; }\n",
            {
                fontSize: "12px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 3,
                stroke: "0xffffff",
            }
        )
        .setOrigin(0.5)
        .setDepth(1000);
    const bowMethods = scene.add
        .text(
            scene.cameras.main.width * 0.3 + 25,
            320,
            "public void incDamage() { this.damage += 1 ; }\n" +
                "public void incSpeed() { this.speed += 1 ; }",
            {
                fontSize: "12px",
                fontFamily: "Academy Engraved LET",
                strokeThickness: 3,
                stroke: "0xffffff",
            }
        )
        .setOrigin(0.5)
        .setDepth(1000);

    const bowClose = scene.add
        .text(scene.cameras.main.width * 0.05 + 10, 347, "}", {
            fontSize: "12px",
            fontFamily: "Academy Engraved LET",
            strokeThickness: 3,
            stroke: "0xffffff",
        })
        .setOrigin(0.5)
        .setDepth(1000);

    bowFile.add(bowTitle);
    bowFile.add(bowBody);
    bowFile.add(bowConstructor);
    bowFile.add(bowGetterSetter);
    bowFile.add(bowMethods);
    bowFile.add(bowClose);
};

export { createWeaponDesignScreen };
