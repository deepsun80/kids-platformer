import Phaser from 'phaser';
import StateMachine from 'javascript-state-machine';

class FlameBoy extends Phaser.GameObjects.Sprite {
 constructor(scene, x, y) {
    super(scene, x, y, 'flame-boy-idle', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.anims.play('flame-boy-idle');

    this.setOrigin(0.5, 1);
    this.body.setCollideWorldBounds(true);
    this.body.setSize(this.width - 90, 70);
    this.body.setOffset(80, 10);
    this.body.setMaxVelocity(450, 550);
    this.body.setDragX(1800);

    this.keys = scene.cursorKeys;
    // this.input = {};

    this.shoot = false;
    this.keyboard = scene.input;

    this.restart = false;

    this.setupAnimations();
    this.setupMovement();
 }

 // FSM - handle animation logic
 setupAnimations() {
    this.animState = new StateMachine({
      init: 'idle',
      transitions: [
        { 
          name: 'idle', 
          from: [ 'running', 'jumping', 'shooting' ],
          to: 'idle' 
        },
        { 
          name: 'run', 
          from: [ 'idle', 'jumping', 'shooting' ], 
          to: 'running' 
        },
        { 
          name: 'jump', 
          from: [ 'idle', 'jumping', 'shooting', 'running' ], 
          to: 'jumping' 
        },
        { 
          name: 'shoot', 
          from: [ 'idle', 'jumping', 'shooting', 'running' ], 
          to: 'shooting' 
        },
        {
          name: 'die',
          from: [ 'idle', 'jumping', 'shooting', 'running' ],
          to: 'dead'
        }
      ],
      methods: {
        onEnterState: (lifecycle) => {
          this.anims.play(`flame-boy-${lifecycle.to}`);
        },
      }
    });

    this.animPredicates = {
      idle: () => {
        return this.body.onFloor() && this.body.velocity.x === 0 && !this.shoot;
      },
      run: () => {
        return this.body.onFloor() && this.body.velocity.x !== 0 && !this.shoot;
      },
      jump: () => {
        return !this.body.onFloor() && !this.shoot;
      },
      shoot: () => {
        return this.shoot;
      }
    }
 }

 // FSM - handle vertical movement logic
 setupMovement() {
    this.moveState = new StateMachine({
      init: 'idle',
      transitions: [
        { name: 'jump', from: 'idle', to: 'jumping' },
        { name: 'fall', from: 'idle', to: 'falling' },
        { 
          name: 'touchdown', 
          from: [ 'jumping', 'falling' ], 
          to: 'idle' 
        },
        {
          name: 'die',
          from: [ 'jumping', 'falling', 'idle' ],
          to: 'dead'
        }
      ],
      methods: {
        // onEnterState: (lifecycle) => {
        //   console.log(lifecycle)
        // },
        onJump: () => {
          this.body.setVelocityY(-550);
        },
        onDie: () => {
          this.body.setVelocity(0, 0);
          this.body.allowGravity = false;
          this.body.setAcceleration(0);
          this.body.setImmovable(true);
        }
      }
    });

    this.movePredicates = {
      jump: () => {
        // return this.input.didPressJump;
        return !this.isDead() && this.keys.up.isDown;
      },
      fall: () => {
        return !this.body.onFloor();
      },
      touchdown: () => {
        return this.body.onFloor();
      }
    }
  }

  kill() {
    if(this.moveState.can('die')) {
      this.moveState.die();
      this.animState.die();
    }
  }

  isDead() {
    return this.moveState.is('dead');
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    // this.input.didPressJump = Phaser.Input.Keyboard.JustDown(this.keys.up);
    if (!this.isDead() && this.keys.left.isDown) {
      this.body.setAccelerationX(-3200);
      this.body.offset.x = this.width - (this.width - 90) - 80;
      this.setFlipX(true);
    } else if (!this.isDead() && this.keys.right.isDown) {
      this.body.setAccelerationX(3200);
      this.body.offset.x = 80;
      this.setFlipX(false);
    } else {
      this.body.setAccelerationX(0);
    }

    // small jumps
    if (this.moveState.is('jumping')) {
      if (!this.keys.up.isDown && this.body.velocity.y < -100) {
        this.body.setVelocityY(-100);
      }
    }

    // implement FSM to movement predicates
    for (const t of this.moveState.transitions()) {
      if (t in this.movePredicates && this.movePredicates[t]()) {
        this.moveState[t]();
        break;
      }
    }

    // implement FSM animation predicates
    for (const t of this.animState.transitions()) {
      if (t in this.animPredicates && this.animPredicates[t]()) {
        this.animState[t]();
        break;
      }
    }

    !this.isDead() && this.scene.input.keyboard.on('keydown_SPACE', () => {
      this.shoot = true;
    });

    !this.isDead() && this.scene.input.keyboard.on('keyup_SPACE', () => {
      this.shoot = false;
    });

    if (this.isDead()) {
      setTimeout(() => {
        this.restart = true;
      }, 1000);
    }
  }
}

export default FlameBoy;