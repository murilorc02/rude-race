import Phaser, { Scene } from "phaser";

class MainScene extends Phaser.Scene {
    private background!: Phaser.GameObjects.TileSprite;
    private car!: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private carSpeed: number = 200;
    private normalSpeed: number = 200;
    private slowSpeed: number = 50;
    private slowDuration: number = 2000;
    private obstacles!: Phaser.Physics.Arcade.Group;
    private npcs!: Phaser.Physics.Arcade.Group;


    constructor() {
        super({ key: "MainScene" });
    }

    preload() {
        this.load.image("background", "assets/RoadTile/01/1.png");
        this.load.image("car", "assets/Motorcycle Body/1.png");
        this.load.image("obstacle", "assets/Obstacle/1.png");
        this.load.image("npc", "assets/NPCs/1.png"); // use o caminho correto da sua imagem

    }

    create() {
        const { width, height } = this.cameras.main;

        this.background = this.add.tileSprite(
            width / 2,
            height / 2,
            1026,
            1798,
            "background"
        );

        this.car = this.physics.add.sprite(width / 2, height - 100, "car").setDisplaySize(88, 100);
        this.car.setSize(40, 80);      // define uma hitbox menor
        this.car.setOffset(24, 10);    // centraliza a hitbox no sprite

        this.car.setCollideWorldBounds(true);

        this.obstacles = this.physics.add.group();

        this.physics.add.collider(
            this.car,
            this.obstacles,
            (car, obstacle) => this.handleCollision(car as Phaser.Physics.Arcade.Sprite, obstacle as Phaser.Physics.Arcade.Sprite)
        );

        this.cursors = this.input.keyboard ? this.input.keyboard.createCursorKeys() : {} as Phaser.Types.Input.Keyboard.CursorKeys;

        this.time.addEvent({
            delay: 2000,
            callback: this.generateObstacle,
            callbackScope: this,
            loop: true,
        });

        this.npcs = this.physics.add.group();

        this.physics.add.collider(
            this.car,
            this.npcs,
            (car, npc) => this.handleNpcCollision(car as Phaser.Physics.Arcade.Sprite, npc as Phaser.Physics.Arcade.Sprite)
        );

        this.time.addEvent({
            delay: 4000,
            callback: this.generateNpc,
            callbackScope: this,
            loop: true,
        });
    }

    private generateObstacle() {
        const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
        const obstacle = this.obstacles.create(x, -50, "obstacle").setDisplaySize(107, 133);
        obstacle.setVelocityY(100);
        obstacle.setImmovable(true);
        obstacle.body.setSize(70, 100);     // ajusta a hitbox do obstáculo
        obstacle.body.setOffset(18, 15);    // centraliza melhor no sprite

    }

    private generateNpc() {
        const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
        const npc = this.npcs.create(x, -50, "npc").setDisplaySize(80, 100);
        npc.setVelocityY(80);
        npc.setImmovable(true);
    }

    private handleNpcCollision(car: Phaser.Physics.Arcade.Sprite, npc: Phaser.Physics.Arcade.Sprite) {
        if (!car || !npc) return;

        this.carSpeed = this.slowSpeed;

        this.time.delayedCall(this.slowDuration, () => {
            this.carSpeed = this.normalSpeed;
        });
    }


    private handleCollision(car: Phaser.Physics.Arcade.Sprite, obstacle: Phaser.Physics.Arcade.Sprite) {
        if (!car || !obstacle) return;

        this.cameras.main.shake(300, 0.02);

        // Pausar a cena
        this.scene.pause();

        // Exibir mensagem de fim de jogo
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, "Fim de Jogo!", {
            fontSize: "32px",
            color: "#fff",
        }).setOrigin(0.5);
    }

    moveCar() {
        if (!this.cursors) return;

        if (this.cursors.left.isDown) {
            this.car.setVelocityX(-this.carSpeed);
        } else if (this.cursors.right.isDown) {
            this.car.setVelocityX(this.carSpeed);
        } else {
            this.car.setVelocityX(0);
        }
    }

    update() {
        this.background.tilePositionY -= 4;
        this.moveCar();

        this.obstacles.getChildren().forEach(obstacle => {
            const sprite = obstacle as Phaser.Physics.Arcade.Sprite;
            if (sprite.y > this.cameras.main.height) {
                sprite.destroy();
            }
        });

        this.npcs.getChildren().forEach(npc => {
            const sprite = npc as Phaser.Physics.Arcade.Sprite;
            if (sprite.y > this.cameras.main.height) {
                sprite.destroy();
            }
        });

    }
}

export default MainScene;