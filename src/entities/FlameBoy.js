import Phaser from 'phaser';
import StateMachine from 'javascript-state-machine';

class FlameBoy extends Phaser.GameObjects.Sprite {
 constructor(scene, x, y) {
    super(scene, x, y, 'flame-boy-idle', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this).setOrigin(0.5);

    this.anims.play('flame-boy-idle');

    this.body.setCollideWorldBounds(true);
    this.body.setSize(this.width - 80, 80);
    this.body.setOffset(75, 0);
    this.body.setMaxVelocity(450, 550);
    this.body.setDragX(1800);

    this.keys = scene.cursorKeys;
    // this.input = {};

    this.shoot = false;
    this.keyboard = scene.input;

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
          from: '*', 
          to: 'jumping' 
        },
        { 
          name: 'shoot', 
          from: '*', 
          to: 'shooting' 
        }
      ],
      methods: {
        onEnterState: (lifecycle) => {
          this.anims.play(`flame-boy-${lifecycle.to}`);
          console.log(lifecycle);
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
      ],
      methods: {
        // onEnterState: (lifecycle) => {
        //   console.log(lifecycle)
        // },
        onJump: () => {
          this.body.setVelocityY(-550);
        }
      }
    });

    this.movePredicates = {
      jump: () => {
        // return this.input.didPressJump;
        return this.keys.up.isDown;
      },
      fall: () => {
        return !this.body.onFloor();
      },
      touchdown: () => {
        return this.body.onFloor();
      }
    }
  }

 

 preUpdate(time, delta) {
    super.preUpdate(time, delta);
    // this.input.didPressJump = Phaser.Input.Keyboard.JustDown(this.keys.up);

    if (this.keys.left.isDown) {
      this.body.setAccelerationX(-3200);
      this.body.offset.x = this.width - (this.width - 80) - 75;
      this.setFlipX(true);
    } else if (this.keys.right.isDown) {
      this.body.setAccelerationX(3200);
      this.body.offset.x = 75;
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

    this.scene.input.keyboard.on('keydown_SPACE', () => {
      this.shoot = true;
    });

    this.scene.input.keyboard.on('keyup_SPACE', () => {
      this.shoot = false;
    });
  }
}

export default FlameBoy;