import Phaser from 'phaser';

class Menu extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  create() {
    const menuItem = this.add.text(this.screenWidth / 2, (this.screenHeight / 2) + 50, 'STORM KID', { fontSize: '32px', fill: '#FFF'});

    menuItem.setOrigin(0.5, 1);
    menuItem.setInteractive();

    menuItem.on('pointerover', () => {
      menuItem.setStyle({ fill: '#0088ff' });
    });

    menuItem.on('pointerout', () => {
      menuItem.setStyle({ fill: '#fff' });
    });

    menuItem.on('pointerup', () => {
      this.scene.start('Level2Scene');
    });
  }
}

export default Menu;