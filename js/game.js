(function( window, document, undefined ) {
  'use strict';

  function Entity( x, y ) {
    this.x = x;
    this.y = y;

    this.image = null;
  }

  function Player( x, y ) {
    Entity.call( this, x, y );
  }

  Player.prototype.draw = function( ctx ) {
    ctx.beginPath();
    ctx.rect( this.x - 10, this.y - 10, 20, 20 );
    ctx.fillStyle = 'red';
    ctx.fill();
  };

  Player.prototype.update = function( dt ) {
    var dx = dt * 100;
    var dy = dt * 100;

    if ( game.input.keys[ 37 ] ) { this.x -= dx; }
    if ( game.input.keys[ 39 ] ) { this.x += dx; }
    if ( game.input.keys[ 38 ] ) { this.y -= dy; }
    if ( game.input.keys[ 40 ] ) { this.y += dy; }
  };

  function Game() {
    this.prevTime = Date.now();
    this.currTime = this.prevTime;
    this.running = true;

    this.canvas = document.createElement( 'canvas' );
    this.ctx = this.canvas.getContext( '2d' );

    this.canvas.width = 512;
    this.canvas.height = 512;

    document.body.appendChild( this.canvas );

    this.entities = [];

    this.input = {
      keys: [],
      mouse: {
        x: 0,
        y: 0,

        down: false
      }
    };

    this.entities.push( new Player( 256, 256 ) );
  }

  Game.prototype.draw = function() {
    var ctx = this.ctx;

    var width = ctx.canvas.width,
        height = ctx.canvas.height;

    ctx.clearRect( 0, 0, width, height );
    ctx.fillStyle = 'white';
    ctx.fillRect( 0, 0, width, height );

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
    console.log(event.which)
    game.input.keys[ event.which ] = true;
  }

  function onKeyUp( event ) {
    game.input.keys[ event.which ] = false;
  }

  function tick() {
    if ( !game.running ) {
      return;
    }

    game.update();
    game.draw();
    window.requestAnimationFrame( tick );
  }

  tick();

  document.addEventListener( 'keydown', onKeyDown );
  document.addEventListener( 'keyup', onKeyUp );
}) ( window, document );
