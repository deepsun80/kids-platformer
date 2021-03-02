import Phaser from 'phaser';
import FlameBoy from '../entities/FlameBoy';
import StormKid from '../entities/StormKid';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    // SEE https://www.joshmorony.com/how-to-scale-a-game-for-all-device-sizes-in-phaser/
    // this.scaleRatio = window.devicePixelRatio / 2;
    this.screenWidth = (window.innerWidth * window.devicePixelRatio) / 2;
    this.screenHeight = (window.innerHeight * window.devicePixelRatio) / 2;
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
    this.load.image('bg-layer-1-sheet', 'assets/background/bg-layer-1.png');
    this.load.image('bg-layer-2-sheet', 'assets/background/bg-layer-2.png');

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

    this.addMap();

    this.addHero();

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player);
  }

  addHero() {
    this.player = new FlameBoy(this, this.spawnPos.x, this.spawnPos.y);
    // this.player = new StormKid(this, this.screenWidth / 2, this.screenHeight / 1.4);

    this.physics.add.collider(this.player, this.map.getLayer('Ground').tilemapLayer);
  }

  addMap() {
    this.map = this.make.tilemap({ key: 'level-1' });

    const groundTiles = this.map.addTilesetImage('volcano-tiles-64', 'volcano-tiles-sheet', 64, 64);
    const bg1Tiles = this.map.addTilesetImage('bg-layer-1', 'bg-layer-1-sheet', 64, 64);
    const bg2Tiles = this.map.addTilesetImage('bg-layer-2', 'bg-layer-2-sheet', 64, 64);

    const bg2Layer = this.map.createStaticLayer('BackgroundLayer2', bg2Tiles);
    const bg1Layer = this.map.createStaticLayer('BackgroundLayer1', bg1Tiles);
    bg2Layer.setScrollFactor(0.3);
    bg1Layer.setScrollFactor(0.6);

    this.hazardGroup = this.physics.add.group({ immovable: true, allowGravity: false });

    this.map.getObjectLayer('Objects').objects.forEach(object => {
      if (object.name === 'Start') {
        this.spawnPos = { x: object.x, y: object.y };
      }

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

  update(time, delta) {
    
  }
}

export default Game;