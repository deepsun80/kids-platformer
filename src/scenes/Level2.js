import Phaser from 'phaser';
import StormKid from '../entities/StormKid';
import Laser from '../props/Laser';

class Level2 extends Phaser.Scene {
  constructor() {
    super({ key: 'Level2Scene' });

    // SEE https://www.joshmorony.com/how-to-scale-a-game-for-all-device-sizes-in-phaser/
    // this.scaleRatio = window.devicePixelRatio / 2;
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    this.lavaFireballGroup = [];
  }

  preload() {
    /* -- Tile maps -- */
    this.load.tilemapTiledJSON('level-2', 'assets/tilemaps/level-2.json');

    /* -- Tile sets -- */
    this.load.spritesheet('lab-tiles-sheet', 'assets/tilesets/lab-tiles-64.png', {
      frameWidth: 64,
      frameHeight: 64,
      margin: 1,
      spacing: 2
    });
    this.load.image('level-2-bg-layer-1-sheet', 'assets/background/level-2-bg-layer-1.png');
    this.load.image('level-2-bg-layer-2-sheet', 'assets/background/level-2-bg-layer-2.png');

    /* -- Props -- */
    this.load.spritesheet('laser', 'assets/props/laser.png', {
      frameWidth: 192,
      frameHeight: 64,
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
    this.load.spritesheet('storm-kid-die', 'assets/storm-kid/storm-kid-die.png', {
      frameWidth: 128,
      frameHeight: 80,
    });
  }

  create(data) {
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    /* -- Props Animations -- */
    this.anims.create({
      key: 'laser',
      frames: this.anims.generateFrameNumbers('laser'),
      frameRate: 2,
      repeat: -1
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

    this.anims.create({
      key: 'storm-kid-dead',
      frames: this.anims.generateFrameNumbers('storm-kid-die'),
      frameRate: 6,
    });
    /* -- End Animations -- */

    var graphics = this.add.graphics();
    graphics.fillGradientStyle(0x1616b0, 0x1616b0, 0x000, 0x000, 1);
    graphics.fillRect(0, 0, this.screenWidth, this.screenHeight);
    graphics.setScrollFactor(0);

    this.addBackground();

    this.addProps();
    
    this.addMap();

    this.addHero();

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  }

  addBackground() {
    this.map = this.make.tilemap({ key: 'level-2' });

    const bg1Tiles = this.map.addTilesetImage('level-2-bg-layer-1', 'level-2-bg-layer-1-sheet', 64, 64);
    const bg2Tiles = this.map.addTilesetImage('level-2-bg-layer-2', 'level-2-bg-layer-2-sheet', 64, 64);

    const bg1Layer = this.map.createStaticLayer('BackgroundLayer1', bg1Tiles);
    const bg2Layer = this.map.createStaticLayer('BackgroundLayer2', bg2Tiles);

    bg1Layer.setScrollFactor(0.6);
    bg2Layer.setScrollFactor(0.3);
  }

  addHero() {
    this.player = new StormKid(this, this.spawnPos.x, 500);

    this.cameras.main.startFollow(this.player);

    this.physics.add.collider(this.player, this.map.getLayer('Ground').tilemapLayer);

    this.laserGroup.forEach(laser => {
      this.physics.add.collider(this.player, laser, () => {
        this.player.kill();
      });
    });
  }

  addMap() {
    const groundTiles = this.map.addTilesetImage('lab-tiles-64', 'lab-tiles-sheet', 64, 64);

    const groundLayer = this.map.createStaticLayer('Ground', groundTiles);
    groundLayer.setCollisionBetween(1, 41, true);

    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.physics.world.setBoundsCollision(true, true, false, true);

    /* -- debug check on tiles -- */
    // const debugGraphics = this.add.graphics();
    // groundLayer.renderDebug(debugGraphics);
  }


  addProps() {
    this.laserGroup = [];

    this.map.getObjectLayer('Props').objects.forEach(object => {
      if (object.name === 'Start') {
        this.spawnPos = { x: object.x, y: object.y };
      }

      if (object.name === 'Laser') {
        const laser = new Laser(this, object.x, object.y);
        this.laserGroup.push(laser);
      }
    });
  }

  update(time, delta) {
    if (this.player.restart) {
        this.player.destroy()
        this.addHero();
    }
  }
}

export default Level2;