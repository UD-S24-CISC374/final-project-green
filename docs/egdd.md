# Infamia di Creti

## Elevator Pitch

You are Theseus, the son of Poseidon. You must travel to the center of the maze to defeat the Minotaur and save the people of Crete!

## Influences (Brief)

- The Binding of Issac:
  - Medium: Game
  - Explanation: Idea of moving through different rooms
- The myth of Theseus and the Minotaur:
  - Medium: Greek Mythology
  - Explanation: Idea of storyline, design of character and boss

## Core Gameplay Mechanics (Brief)

- Fight with enemies by moving Theseus using keyboard and mouse.
- Whenever you defeat all the enemies in the room, you can move to the other rooms.
- Collect upgrades and weapon types by defeating enemies, and use them to upgrade your weapon or change your weapon type.
- Progress through all three rooms to reach the center of the maze.
- When you loss all your health, it displays a game over message.
- After you defeat the boss, Minotaur, it displays a victory message showing that Theseus became a hero.

# Learning Aspects

## Learning Domains

- Introductory Java Programming
  - Using the getters and setters of a class.

## Target Audiences

- Middle or high school aged kids (or older).
- People who have some prior coding knowledge.


## Target Contexts

- Can be used in a Java course, or for someone who is teaching themselves Java. 
- Due to the longer playtime, it might not be appropriate for a classroom activity.

## Learning Objectives

- By the end of the lesson, players will be able to identify the syntax of defining classes in Java.
- By the end of the lesson, players will be able to write an appropriate constructor for the class.
- By the end of the lesson, players will be able to explain appropriate uses of the getters and setters.

## Prerequisite Knowledge

Give assessments before and after gameplay.

- Prior to the game, players need to be able to define the concept of a class. 
- Prior to the game, players need to be able to explain the concept of a getters and setters.

## Assessment Measures

- Using given name of class and information of the fields, define a class.
- Given classes, use getters and setters to change the value in a class.

# What sets this project apart?

- This game presents the concept of Java classes in a game where there is an end goal (defeating the minotaur) motivating the students to use classes, not just 
  presenting class related coding problems to students.
- The game appeals to fans of Greek mythology. 

# Player Interaction Patterns and Modes

## Player Interaction Pattern

- This is a single player game, they can intereact with the game via the keyboard and mouse. 

## Player Modes

- Single-player: You collect codes by defeating the enemies in rooms and join them together to have the best items until you reach the boss stage.

# Gameplay Objectives

- Advance to the center of the maze: gain access to the necessary parts of the maze in order to eventually reach the center. 
- Defeat lower-level enemies: Using methods, "attack" the enemy until its health is zero to defeat it. 
- Defeat the Minotaur: Defeat the Minotaur to win the game.

# Procedures/Actions

- You can either move or attack using keyboard and mouse.

- Write methods and classes by using the keyboard.

# Rules

- If the player clicks, then the attack will be occured to the place where they aimed.
- Using the "WASD" keys and the space bar, the player can move Theseus.
- If the player press the shift button, they can change their weapon.
- A player has a limited amount of lives.
  - If the player collides with the enemies or hit by the enemies, then the player's lives decreases.
- There is display that shows the amount of string a player has.

# Objects/Entities

- There is an avatar to represent Thesues.
- There is an avatar to represent Ariadne.
- There is an avatar to represent the Minotaur and other enemies.
- There are different weapons Theseus can use.
- A health bar for Thesueus, the Minotuar, and other enemies.
- There is a box that shows what weapons Thesueus is using.
- There is some indication of how much string Theseus has. 

## Core Gameplay Mechanics (Detailed)

- Defeating enemies: The player must battle enemies and upgrade/change their weapon using methods and classes. Once an enemies health bar reaches zero they are defeated.
- Exploring the Maze: The player must move from the outer ring of rooms to the center, until they reach the Minotaur. The player moves is able to move between rooms only once they have cleared the room they are in by defeating all the enemies. Enetering a new room reduces the amount of string the player has.
- Gaining items: Player is able to collect code by exploring rooms.
- Losing all your health: Once Theseus loses all his health, the game is over and a "Game Over" message is displayed.
- Defeating the Minotuar: Theseus must battle the Minotaur similar to other enemies and once the Minotaur has no more health, the player wins the game. A "You are the hero!" message is displayed. 

## Feedback

- Defeating an enemy will give you codes to upgrade/change weapon, positive feedback for battling an enemy.
- Each time the player enters and clears a room, it reduces the amount of string they have.
- The state of Theseues health bar reflects how successful he has been in battling enemies. 
- When you defeat the minotaur and win the game, a message will be displayed on the screen. 
- When you lose, a message will be displayed on the screen. 

# Story and Gameplay

## Presentation of Rules

- When Theseus enters the maze, Ariadne, the princess of Crete, explains the objective and interaction instructions

## Presentation of Content

- The game is not intended to teach players what a class or method is in Java. It is meant to help players learn the correct syntax of a class, how to write a constructor, and when to use a method.

## Story (Brief)

You are Theseus, a young prince, who sets out on a quest to slay the Minotaur, a half-man, half-bull monster, and save your people from being sacrificed to it.

## Storyboarding

![storyboard](/assets/img/storyboard.png "storyboard")
The storyboard shows four key scenes in the game. The bottom right shows a maze, which is what the player will navigate through to reach the center and defeat the minotaur. The player has a limited amount of string they can use to reach the center. The bottom left shows an example of a class and methods the player can use. The top right is an example of what it will look like when the player is battling enemies in the maze. There is a health bar for the player, a display for the amount of coins, and a display for the amount of string. The red circle shows how the player will use the mouse to aim. The top left scene is the intro scene where the player will recieve instructions on how to play the game from Ariadne. 

# Assets Needed

## Aethestics

- The aesthics should be fantastical, since it is based on a myth. The tone of the game can shift, going from neutral to more threatening if Theseues encounters an enemy. This contributes to the player feeling as if they
are in the myth themselves. 

## Graphical

- Characters List
  - Thesues: cartoon, pixalated sprite. Have three faces: happy, hurt, neutral.
  - Ariadne: cartoon, pixalated sprite. Happy expression.
  - Minotaur: cartoon, pixalated sprite. Mean expression.
  - Enemies: cartoon, pixalated sprite. Mean expression.

- Textures:
- Pixelated texture. 
- Environment Art/Textures:
  - Pixelated texture. 
  - Each "room" in the maze should have a grayish floor and the walls should be a shade of white. 

## Audio

- Music List (Ambient sound)
  - General gameplay: fantastical, mythical (similar to this https://www.youtube.com/watch?v=DEJNkrHCUTE)
  - When battling an enemy: more fast paced (similar to https://www.youtube.com/watch?v=KXb2lFpfccc)
    - The music will be more dramtic in the boss battle (similar to this (https://www.youtube.com/watch?v=4uvqbpkowLA&pp=ygUVYmF0dGxpbmcgZHJhZ29uIG11c2lj)


- Sound List (SFX)
  - Striking an enemy: Will depend on the weapons but a sword might produce sound effects similar to this - https://www.youtube.com/watch?v=EgRvVq8mStE
  - Receiving a hit might vary depending on the enemy but recieving a hit might sound like if the enemy has claws https://www.youtube.com/watch?v=MH6M21jtX_k

# Metadata

- Template created by Austin Cory Bart <acbart@udel.edu>, Mark Sheriff, Alec Markarian, and Benjamin Stanley.
- Version 0.0.3

