import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#001933',
  scale: {
    width: (window.innerWidth * window.devicePixelRatio) / 2,
    height: (window.innerHeight * window.devicePixelRatio) / 2,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    pixelArt: true
  },
  audio: {
    noAudio: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
      gravity: { 
        y: 750 
      }
    }
  }
};
