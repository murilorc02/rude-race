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

    constructor() {
        super({ key: "MainScene" });
    }

    preload() {
        this.load.image("background", "assets/RoadTile/01/1.png");
        this.load.image("car", "assets/Motorcycle Body/1.png");
        this.load.image("obstacle", "assets/Obstacle/1.png");
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
    }

    private generateObstacle() {
        const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
        const obstacle = this.obstacles.create(x, -50, "obstacle").setDisplaySize(107, 133);
        obstacle.setVelocityY(100);
        obstacle.setImmovable(true);
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
    }
}

export default MainScene;