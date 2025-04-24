import Phaser from "phaser";
// Remova imports não utilizados como PlayerAnimation, EnemyAnimation, eventBus se não existirem

class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        console.log("Preloading assets...");

        // --- MANTENHA OS ASSETS NECESSÁRIOS PARA O MENU INICIAL AQUI ---
        // Exemplo: Carregar fundo e botão para o StartMenuScene
        this.load.image('menuBackground', 'assets/menu_background.png'); // Substitua pelo seu asset
        this.load.image('startButton', 'assets/start_button.png'); // Substitua pelo seu asset
        this.load.image('gameTitle', 'assets/game_title.png'); // Substitua pelo seu asset

        // --- ASSETS DO JOGO PRINCIPAL SÃO CARREGADOS NA MAINSCENE AGORA ---
        // Remova os assets do jogo daqui para evitar carregamento duplicado
        // this.load.image('Riders01', 'public/assets/Riders/01/Riders01.png'); // Exemplo removido
        // this.load.image('1', 'public/assets/Motorcycle Body/1.png'); // Exemplo removido
        // this.load.image('2', 'public/assets/RoadTile/01/2.png'); // Exemplo removido
        // this.load.image('background', 'public/assets/RoadTile/01/1.png'); // Exemplo removido

        // Barra de Progresso (Opcional, mas bom para o usuário)
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(this.cameras.main.width / 2 - 160, this.cameras.main.height / 2 - 25, 320, 50);

        this.load.on('progress', (value: number) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(this.cameras.main.width / 2 - 150, this.cameras.main.height / 2 - 15, 300 * value, 30);
        });

        this.load.on('complete', () => {
            console.log("Preload complete.");
            progressBar.destroy();
            progressBox.destroy();
            // Iniciar o Menu Inicial (Item 8)
            this.scene.start('StartMenuScene');
        });
    }

    // O método create() aqui pode ficar vazio ou ser removido se o 'complete' fizer tudo
    // create() {
    // }
}

export default PreloadScene;