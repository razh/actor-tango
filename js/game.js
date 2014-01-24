(function( window, document, undefined ) {
  'use strict';

  function Game() {
    this.prevTime = Date.now();
    this.currTime = this.prevTime;
    this.running = true;

    var canvas = document.createElement( 'canvas' );
    var ctx = canvas.getContext( '2d' );

    canvas.width = 512;
    canvas.height = 512;

    document.body.appendChild( canvas );

    this.entities = [];

    this.input = {
      keys: [],
      mouse: {
        x: 0,
        y: 0,

        down: false
      }
    };
  }

  Game.prototype.draw = function() {
    var ctx = this.ctx;

    var width = ctx.width,
        height = ctx.height;

    ctx.clearRect( 0, 0, width, height );

    this.entities.forEach(function( entity ) {
      entity.draw( ctx );
    });
  };

  Game.prototype.update = function() {
    if ( !this.prevTime ) {
      this.prevTime = Date.now();
      return;
    }

    this.currTime = Date.now();
    var dt = this.currTime - this.prevTime;
    this.prevTime = this.currTime;

    if ( dt > 1e2 ) {
      dt = 1e2;
    }

    dt *= 1e-3;

    this.entities.forEach(function( entity ) {
      entity.update( dt );
    });
  };

  var game = new Game();


  function onKeyDown( event ) {

  }

  function tick() {
    if ( !game.running ) {
      return;
    }

    game.update();
    game.draw();
    window.requstAnimationFrame( tick );
  }

  tick();
}) ( window, document );
