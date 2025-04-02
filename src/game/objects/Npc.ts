import Phaser from "phaser";

export default class NPC extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setDisplaySize(88, 100);
    }

    move() {
        // Lógica de movimento simples: movimento aleatório
        const randomX = Phaser.Math.Between(-100, 100);
        const randomY = Phaser.Math.Between(-100, 100);
        this.setVelocity(randomX, randomY);
    }
}