import Phaser from 'phaser';
import FlameBoy from '../entities/FlameBoy';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    // SEE https://www.joshmorony.com/how-to-scale-a-game-for-all-device-sizes-in-phaser/
    // this.scaleRatio = window.devicePixelRatio / 2;
    this.screenWidth = (window.innerWidth * window.devicePixelRatio) / 2;
    this.screenHeight = (window.innerHeight * window.devicePixelRatio) / 2;
  }

  preload() {
    this.load.spritesheet('flame-boy-idle', 'assets/flame-boy-idle.png', {
      frameWidth: 128,
      frameHeight: 80,
    });
    this.load.spritesheet('flame-boy-jump', 'assets/flame-boy-jump.png', {
      frameWidth: 128,
      frameHeight: 80,
    });
    this.load.spritesheet('flame-boy-land', 'assets/flame-boy-land.png', {
      frameWidth: 128,
      frameHeight: 80,
    });
    this.load.spritesheet('flame-boy-run-start', 'assets/flame-boy-run-start.png', {
      frameWidth: 128,
      frameHeight: 80,
    });
    this.load.spritesheet('flame-boy-run', 'assets/flame-boy-run.png', {
      frameWidth: 128,
      frameHeight: 80,
    });
    this.load.spritesheet('flame-boy-stop', 'assets/flame-boy-stop.png', {
      frameWidth: 128,
      frameHeight: 80,
    });
  }

  create(data) {
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    /* -- Create Animations -- */
    this.anims.create({
      key: 'flame-boy-idle',
      frames: this.anims.generateFrameNumbers('flame-boy-idle'),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'flame-boy-jumping',
      frames: this.anims.generateFrameNumbers('flame-boy-jump'),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'flame-boy-landing',
      frames: this.anims.generateFrameNumbers('flame-boy-land'),
    });

    this.anims.create({
      key: 'flame-boy-runningstart',
      frames: this.anims.generateFrameNumbers('flame-boy-run-start'),
    });

    this.anims.create({
      key: 'flame-boy-running',
      frames: this.anims.generateFrameNumbers('flame-boy-run'),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'flame-boy-stopping',
      frames: this.anims.generateFrameNumbers('flame-boy-stop'),
    });
    /* -- End Animations -- */

    this.player = new FlameBoy(this, this.screenWidth / 2, this.screenHeight / 1.4);

    const platform = this.add.rectangle(this.screenWidth / 2, this.screenHeight / 1.3, 260, 10, 0x4BcB7C);
    this.physics.add.existing(platform, true);
    this.physics.add.collider(this.player, platform);
  }

  update(time, delta) {

  }
}

export default Game;