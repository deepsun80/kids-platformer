import Phaser from 'phaser';
import config from './config';
import MenuScene from './scenes/Menu';
import Level2Scene from './scenes/Level2';
import Level1Scene from './scenes/Level1';

new Phaser.Game(Object.assign(config, {
  scene: [MenuScene, Level1Scene, Level2Scene],
}));
