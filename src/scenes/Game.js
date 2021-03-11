import Phaser from 'phaser';
import FlameBoy from '../entities/FlameBoy';
import StormKid from '../entities/StormKid';
import LavaBubble from '../props/LavaBubble';
import LavaFireball from '../props/LavaFireball';
import LavaSplash from '../props/LavaSplash';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    // SEE https://www.joshmorony.com/how-to-scale-a-game-for-all-device-sizes-in-phaser/
    // this.scaleRatio = window.devicePixelRatio / 2;
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    this.lavaFireballGroup = [];
  }

  preload() {
    /* -- Tile maps -- */
    this.load.tilemapTiledJSON('level-1', 'assets/tilemaps/level-1.json');

    /* -- Tile sets -- */
    this.load.spritesheet('volcano-tiles-sheet', 'assets/tilesets/volcano-tiles-64.png', {
      frameWidth: 64,
      frameHeight: 64,
      margin: 1,
      spacing: 2
    });
    this.load.image('bg-layer-1-sheet', 'assets/background/level-1-bg-layer-1.png');
    this.load.image('bg-layer-2-sheet', 'assets/background/level-1-bg-layer-2.png');

    /* -- Props -- */
    this.load.spritesheet('lava-bubble-1', 'assets/props/lava-bubble-1.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet('lava-bubble-2', 'assets/props/lava-bubble-2.png', {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet('lava-fireball-go', 'assets/props/lava-fireball-go.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet('lava-splash', 'assets/props/lava-splash.png', {
      frameWidth: 64,
      frameHeight: 64,
    });

    /* -- Flame boy -- */
    this.load.spritesheet('flame-boy-idle', 'assets/flame-boy/flame-boy-idle.png', {
      frameWidth: 128,
      frameHeight: 80,
    });
    this.load.spritesheet('flame-boy-jump', 'assets/flame-boy/flame-boy-jump.png', {
      frameWidth: 128,
      frameHeight: 80,
    });
    this.load.spritesheet('flame-boy-run', 'assets/flame-boy/flame-boy-run.png', {
      frameWidth: 128,
      frameHeight: 80,
    });
    this.load.spritesheet('flame-boy-shoot', 'assets/flame-boy/flame-boy-shoot.png', {
      frameWidth: 128,
      frameHeight: 80,
    });
    this.load.spritesheet('flame-boy-die', 'assets/flame-boy/flame-boy-die.png', {
      frameWidth: 128,
      frameHeight: 80,
    });

    /* -- Storm kid -- */
    this.load.spritesheet('storm-kid-idle', 'assets/storm-kid/storm-kid-idle.png', {
      frameWidth: 128,
      frameHeight: 80,
    });
    this.load.spritesheet('storm-kid-jump', 'assets/storm-kid/storm-kid-jump.png', {
      frameWidth: 128,
      frameHeight: 80,
    });
    this.load.spritesheet('storm-kid-run', 'assets/storm-kid/storm-kid-run.png', {
      frameWidth: 128,
      frameHeight: 80,
    });
  }

  create(data) {
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    /* -- Props Animations -- */
    this.anims.create({
      key: 'lava-bubble-1',
      frames: this.anims.generateFrameNumbers('lava-bubble-1'),
      frameRate: 4,
      repeat: -1
    });
    this.anims.create({
      key: 'lava-bubble-2',
      frames: this.anims.generateFrameNumbers('lava-bubble-2'),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'lava-fireball-go',
      frames: this.anims.generateFrameNumbers('lava-fireball-go'),
    });
    this.anims.create({
      key: 'lava-splash',
      frames: this.anims.generateFrameNumbers('lava-splash'),
    });

    /* -- Flame boy Animations -- */
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
      key: 'flame-boy-running',
      frames: this.anims.generateFrameNumbers('flame-boy-run'),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'flame-boy-shooting',
      frames: this.anims.generateFrameNumbers('flame-boy-shoot')
    });

    this.anims.create({
      key: 'flame-boy-dead',
      frames: this.anims.generateFrameNumbers('flame-boy-die'),
      frameRate: 6,
    });

    /* -- Storm kid Animations -- */
    this.anims.create({
      key: 'storm-kid-idle',
      frames: this.anims.generateFrameNumbers('storm-kid-idle'),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'storm-kid-jumping',
      frames: this.anims.generateFrameNumbers('storm-kid-jump'),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'storm-kid-running',
      frames: this.anims.generateFrameNumbers('storm-kid-run'),
      frameRate: 4,
      repeat: -1
    });
    /* -- End Animations -- */

    var graphics = this.add.graphics();
    graphics.fillGradientStyle(0x7c120f, 0x7c120f, 0xe5791f, 0xe5791f, 1);
    graphics.fillRect(0, 0, this.screenWidth, this.screenHeight);
    graphics.setScrollFactor(0);

    this.addBackground();

    this.addProps();
    
    this.addMap();

    this.addHero();

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  }

  addBackground() {
    this.map = this.make.tilemap({ key: 'level-1' });

    const bg1Tiles = this.map.addTilesetImage('bg-layer-1', 'bg-layer-1-sheet', 64, 64);
    const bg2Tiles = this.map.addTilesetImage('bg-layer-2', 'bg-layer-2-sheet', 64, 64);

    const bg2Layer = this.map.createStaticLayer('BackgroundLayer2', bg2Tiles);
    const bg1Layer = this.map.createStaticLayer('BackgroundLayer1', bg1Tiles);
    bg2Layer.setScrollFactor(0.3);
    bg1Layer.setScrollFactor(0.6);
  }

  addHero() {
    this.player = new FlameBoy(this, this.spawnPos.x, this.spawnPos.y);
    // this.player = new StormKid(this, this.screenWidth / 2, this.screenHeight / 1.4);

    this.cameras.main.startFollow(this.player);

    this.physics.add.collider(this.player, this.map.getLayer('Ground').tilemapLayer);

    this.physics.add.overlap(this.player, this.hazardGroup, () => {
      this.player.kill();
    });

    this.lavaFireballGroup.forEach(fireball => {
      this.physics.add.collider(this.player, fireball, () => {
        this.player.kill();
      });
    });
  }

  addMap() {
    const groundTiles = this.map.addTilesetImage('volcano-tiles-64', 'volcano-tiles-sheet', 64, 64);

    this.hazardGroup = this.physics.add.group({ immovable: true, allowGravity: false });
    
    this.map.getObjectLayer('Hazards').objects.forEach(object => {
      if (object.type === "Hazard") {
        const hazard = this.hazardGroup.create(object.x, object.y, 'volcano-tiles-sheet', object.gid - 1);
        hazard.setOrigin(0, 1);
        hazard.setSize(object.width, object.height - 22);
        hazard.setOffset(0, 20);
      }
    });

    const groundLayer = this.map.createStaticLayer('Ground', groundTiles);
    groundLayer.setCollisionBetween(1, 41, true);

    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.physics.world.setBoundsCollision(true, true, false, true);

    /* -- debug check on tiles -- */
    // const debugGraphics = this.add.graphics();
    // groundLayer.renderDebug(debugGraphics);
  }


  addProps() {
    this.lavaSplashGroup = this.physics.add.group({ immovable: true, allowGravity: false });
    
    this.map.getObjectLayer('Props').objects.forEach(object => {
      if (object.name === 'Start') {
        this.spawnPos = { x: object.x, y: object.y };
      }

      if (object.name === "Lava-splash") {
        const lavaSplash = this.lavaSplashGroup.create(object.x, object.y);
        lavaSplash.setOrigin(1, 1);
        lavaSplash.setSize(object.width, object.height - 5);
        lavaSplash.setOffset(0, 32);
        lavaSplash.setVisible(false);
      }

      if (object.name === "Lava-fireball") {
        this.lavaFireball = new LavaFireball(this, object.x, object.y);
        this.lavaFireballGroup.push(this.lavaFireball);
      }

      if (object.name === "Lava-bubble-1") {
        new LavaBubble(this, object.x, object.y + 3, 1);
      }
      if (object.name === "Lava-bubble-2") {
        new LavaBubble(this, object.x, object.y + 3, 0);
      }
    });

    this.lavaFireballGroup.forEach(fireball => {
      this.lavaSplashGroup.children.entries.forEach(splash => {
        this.physics.add.collider(splash, fireball, () => {
          const tempBubble = new LavaSplash(this, splash.body.x + 35, splash.body.y + 3);

          setTimeout(() => {
            tempBubble.destroy();
          }, 300)
        });
      });
    });
  }

  update(time, delta) {
    if (this.player.restart) {
        this.player.destroy()
        this.addHero();
    }
  }
}

export default Game;