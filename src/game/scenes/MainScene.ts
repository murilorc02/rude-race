import Phaser, { Scene } from "phaser";

class MainScene extends Phaser.Scene {
    private background!: Phaser.GameObjects.TileSprite;
    private obstacle!: Phaser.Physics.Arcade.Sprite; 
    private car!: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    
    constructor() {
      super({ key: "MainScene" });
    }
  
    preload() {
      this.load.image("background", "assets/RoadTile/01/1.png");
      this.load.image("car", "assets/Motorcycle Body/1.png");
      this.load.image("obstacle", "assets/Obstacle/1.png");
    }
  
    create() {
      // Obtém as dimensões da câmera principal
      const { width, height } = this.cameras.main;
  
      // Cria o background no jogo
      this.background = this.add.tileSprite(
        width / 2,
        height / 2,
        1026,
        1798,
        "background"
      );

      // Carro
      this.car = this.physics.add.sprite(width / 2, height - 100, "car").setDisplaySize(88, 100);
      this.car.setCollideWorldBounds(true);

      // Obstáculo
      this.obstacle = this.physics.add.sprite(width / 2, height / 2, "obstacle").setDisplaySize(107, 133);
      this.obstacle.setImmovable(true); // Impede que o obstáculo se mova
      this.obstacle.setVelocityY(100); // Faz o obstáculo se mover para baixo
      this.obstacle.setGravityY(0);

      // Configuração de colisão
      this.physics.add.collider(this.car, this.obstacle, this.handleCollision, undefined, this);
    
      // Inicializa os controles do teclado
      this.cursors = this.input.keyboard!.createCursorKeys();
    }

    handleCollision() {
        // Lógica de colisão: Por exemplo, parar o carro ou exibir uma mensagem
        console.log("Colisão!");
        this.car.setVelocity(0); // Para o carro
    }

  
    moveCar() {
        if (this.cursors.left.isDown) {
            this.car.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.car.setVelocityX(160);
        } else {
            this.car.setVelocityX(0);
        }
    }
 
    update() {
      // Move o background para criar o efeito de looping
      this.background.tilePositionY -= 4;
      this.moveCar();

      // Reposiciona o obstáculo quando ele sai da tela
      if (this.obstacle.y > this.cameras.main.height) {
        this.obstacle.y = -this.obstacle.height;
      }
    }


  /* private textScore: any
    private player!: Player;
    private enemyGroup!: Phaser.Physics.Arcade.Group;
    private playerAttackGroup!: Phaser.Physics.Arcade.Group;

    lastAttack = 0
    playerAttackId = 0

    enemyId = 1
    spawnInterval: number = 0

    level = 1
    score = 0


    preload() { }

    create() {
        this.textScore = this.add.text(0, 0, 'Level: 1\nScore: 0')
        // this.player = this.physics.add.sprite(100, 450, "star");
        this.player = new Player(this, 100, 450, 'player_1')
        this.enemyGroup = this.physics.add.group()
        this.playerAttackGroup = this.physics.add.group()

        this.physics.add.overlap(
            this.player,
            this.enemyGroup,
            //@ts-ignore
            (p: Player, e: Enemy) => p.takeDamage(e))

        this.physics.add.overlap(
            this.playerAttackGroup,
            this.enemyGroup,
            //@ts-ignore
            (p: PlayerAttack, e: Enemy) => {
                e.takeDamage(p.power)
                p.destroy(true)
            })
        eventBus.on('increase-score', this.increaseScore, this)
    }

    createEnemy(time: number) {
        if (time > this.spawnInterval) {
            this.spawnInterval += 1000 * (11 - this.level)
            console.log('novo inimigo')

            const x = Phaser.Math.Between(20, 780)
            const y = Phaser.Math.Between(20, 580)

            // const count = this.enemyGroup.getChildren().length > 1 ? 2 : 1

            const enemy = new Enemy(this, x, y, `enemy_${this.level}`, this.player, this.enemyId)
            this.enemyId++
            this.enemyGroup.add(enemy)

        }
    }

    playerAttack(time: number) {
        if (this.lastAttack < time) {
            let distance = 0
            let enemyToAttack = undefined
            for (const enemy of this.enemyGroup.getChildren()) {
                const d = Phaser.Math.Distance.Between(
                    this.player.x, this.player.y,
                    enemy.body!.position.x, enemy.body!.position.y
                )
                if (enemyToAttack == undefined) {
                    enemyToAttack = enemy
                    distance = d
                } else {
                    if (d < distance) {
                        enemyToAttack = enemy
                        distance = d
                    }
                }
            }

            if (enemyToAttack) {
                const weapons = PlayerProps.find(p => p.level == this.level)!.weapons
                const randonWeapon = weapons[Phaser.Math.Between(0, weapons.length - 1)]

                const attack = new PlayerAttack(this,
                    this.player.x,
                    this.player.y,
                    enemyToAttack.body!.position.x,
                    enemyToAttack.body!.position.y,
                    randonWeapon,
                    this.playerAttackId,
                    50
                )
                this.playerAttackId++

                this.playerAttackGroup.add(attack)
            }

            this.lastAttack = time + 4000
        }
    }

    public increaseScore() {
        let newScore = this.score + 1

        if (this.level < 7)
            if (newScore == PlayerProps.find(p => p.level == this.level)!.xp) {
                this.level++
                newScore = 0
            }

        this.score = newScore
        this.textScore.setText(`Level: ${this.level}\nScore: ${this.score}`)
    }

    update(time: number) {
        this.createEnemy(time)
        this.playerAttack(time)
    } */
}

export default MainScene;
