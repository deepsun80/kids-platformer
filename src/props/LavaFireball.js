import Phaser from 'phaser';

class LavaFireball extends Phaser.GameObjects.Sprite {
 constructor(scene, x, y) {
    super(scene, x, y, 'lava-fireball-go');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.anims.play('lava-fireball-go');

    this.setOrigin(1, 1);
    this.body.setCollideWorldBounds(true);
    this.body.setSize(this.width - 40, 50);
    this.body.setOffset(38, 12);
    this.body.setImmovable(true);

    this.bounce();

    this.triggerTimer = this.scene.time.addEvent({
      callback: this.bounce,
      callbackScope: this,
      delay: Phaser.Math.Between(2500, 4000),
      loop: true
    });
 }

 bounce() {
  this.body.setVelocityY(-800);
 }

 preUpdate(time, delta) {
  super.preUpdate(time, delta);
    
  if (this.body.velocity.y > 0) {
    this.setFlipY(true);
    this.body.setOffset(38, 0);
  } else {
    this.setFlipY(false);
    this.body.setOffset(38, 12);
  }
 }
}

export default LavaFireball;