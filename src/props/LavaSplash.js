import Phaser from 'phaser';

class LavaSplash extends Phaser.GameObjects.Sprite {
 constructor(scene, x, y) {
    super(scene, x, y, 'lava-splash');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.anims.play('lava-splash');

    this.setOrigin(1, 1);    
    this.body.allowGravity = false;
    this.body.setSize(this.width - 15, 0);
    this.body.setOffset(15, 0);
 }
}

export default LavaSplash;