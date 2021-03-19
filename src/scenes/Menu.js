import Phaser from 'phaser';

class Menu extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  create() {
    const menuItem1 = this.add.text(this.screenWidth / 2, (this.screenHeight / 2) - 50, 'FLAME BOY', { fontSize: '32px', fill: '#FFF'});
    const menuItem2 = this.add.text(this.screenWidth / 2, (this.screenHeight / 2) + 50, 'STORM KID', { fontSize: '32px', fill: '#FFF'});

    menuItem1.setOrigin(0.5, 1);
    menuItem1.setInteractive();
    menuItem2.setOrigin(0.5, 1);
    menuItem2.setInteractive();

    menuItem1.on('pointerover', () => {
      menuItem1.setStyle({ fill: '#ff663d' });
    });
    menuItem2.on('pointerover', () => {
      menuItem2.setStyle({ fill: '#0088ff' });
    });

    menuItem1.on('pointerout', () => {
      menuItem1.setStyle({ fill: '#fff' });
    });
    menuItem2.on('pointerout', () => {
      menuItem2.setStyle({ fill: '#fff' });
    });

    menuItem1.on('pointerup', () => {
      this.scene.start('Level1Scene');
    });
    menuItem2.on('pointerup', () => {
      this.scene.start('Level2Scene');
    });
  }
}

export default Menu;