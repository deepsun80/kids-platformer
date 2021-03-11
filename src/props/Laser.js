import Phaser from 'phaser';

class Laser extends Phaser.GameObjects.Sprite {
 constructor(scene, x, y) {
    super(scene, x, y);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.anims.play('laser');

    this.startYPos = y;

    this.setOrigin(1, 1);
    this.body.setCollideWorldBounds(true);
    this.body.allowGravity = false;
    this.body.setSize(this.width, 30);
    this.body.setOffset(0, 18);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.body.position.y <= this.startYPos - 40) {
      this.body.velocity.y = 100;
    }
    if (this.body.position.y >= this.startYPos + 80) {
      this.body.velocity.y = -100;
    }
  }
}

export default Laser;