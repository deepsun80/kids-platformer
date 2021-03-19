import Phaser from 'phaser';
import config from './config';
import MenuScene from './scenes/Menu';
import Level2Scene from './scenes/Level2';

new Phaser.Game(Object.assign(config, {
  scene: [MenuScene, Level2Scene],
}));
