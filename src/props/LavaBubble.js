import Phaser from 'phaser';

class LavaBubble extends Phaser.GameObjects.Sprite {
 constructor(scene, x, y, bubble) {
    super(scene, x, y, 'lava-bubble-1', 'lava-bubble-2', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (bubble === 1) {
      this.anims.play('lava-bubble-1');
    } else {
      this.anims.play('lava-bubble-2');
    }

    this.setOrigin(1, 1);
    this.body.setCollideWorldBounds(true);
    this.body.allowGravity = false;
    this.body.setSize(this.width - 40, 30);
    this.body.setOffset(40, 35);
 }
}

export default LavaBubble;