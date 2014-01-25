(function( window, document, undefined ) {
  'use strict';

  var pixelSize = 16;
  var halfPixelSize = 0.5 * pixelSize;

  function drawPixel( ctx, x, y, size, color ) {
    size = size || pixelSize;
    var halfSize = 0.5 * size;

    ctx.save();

    ctx.beginPath();
    ctx.translate( x, y );
    ctx.rect( x - halfSize, y - halfSize, size, size );
    ctx.fillStyle = color || '#fff';
    ctx.fill();

    ctx.restore();
  }

  var topRow = [ 81, 87, 69, 82, 84, 89, 85, 73, 79, 80 ];
  var midRow = [ 65, 83, 68, 70, 71, 72, 74, 75, 76 ];
  var bottomRow = [ 90, 88, 67, 86, 66, 78, 77 ];

  function drawKeys( ctx, keys, lastPressed ) {
    var time = Date.now();
    var maxTime = 1000;

    keys.forEach(function( key, index ) {
      var lastPressedTime = lastPressed[ index ];
      if ( !lastPressedTime ) {
        return;
      }

      var dt = time - lastPressedTime;
      if ( dt > maxTime ) {
        lastPressed[ index ] = 0;
        return;
      }

      ctx.globalAlpha = 1 - dt / maxTime;


      // Numeric.
      // 0 - 9.
      if ( 48 <= index && index <= 57 ) {
        index -= 49;
        if ( index < 0 ) {
          index += 10;
        }

        drawPixel( ctx, pixelSize * index, 2 * pixelSize, 2 * pixelSize, '#f00' );
      }

      var topIndex = topRow.indexOf( index );
      if ( topIndex !== -1 ) {
        drawPixel( ctx, pixelSize * topIndex + halfPixelSize, 3 * pixelSize, 2 * pixelSize, '#0f0' );
      }

      var midIndex = midRow.indexOf( index );
      if ( midIndex !== -1 ) {
        drawPixel( ctx, pixelSize * midIndex + 2 * halfPixelSize, 4 * pixelSize, 2 * pixelSize, '#00f' );
      }

      var bottomIndex = bottomRow.indexOf( index );
      if ( bottomIndex !== -1 ) {
        drawPixel( ctx, pixelSize * bottomIndex + 3 * halfPixelSize, 5 * pixelSize, 2 * pixelSize, '#f0f' );
      }

      ctx.globalAlpha = 1;
    });
  }

  function Background( width, height, options ) {

  }

  function Radar( x, y, radius ) {

  }

  function Entity( x, y ) {
    this.x = x;
    this.y = y;

    this.image = null;
  }

  Entity.prototype.update = function() {};
  Entity.prototype.draw = function( ctx ) {
    if ( this.image ) {
      ctx.drawImage( this.image, this.x, this.y );
    }
  };

  function Player( x, y ) {
    Entity.call( this, x, y );
  }

  Player.prototype.draw = function( ctx ) {
    ctx.beginPath();
    ctx.rect( this.x - halfPixelSize, this.y - halfPixelSize - pixelSize, pixelSize, pixelSize );
    ctx.fillStyle = '#efefd0';
    ctx.fill();

    ctx.beginPath();
    ctx.rect( this.x - halfPixelSize, this.y - halfPixelSize, pixelSize, 2 * pixelSize );
    ctx.fillStyle = '#f43';
    ctx.fill();

    if ( this.radar ) {
      this.radar.draw( this.x, this.y );
    }
  };

  Player.prototype.update = function( dt ) {
    var dx = dt * 128;
    var dy = dt * 128;

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

    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;

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
      },

      lastPressed: []
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

    drawKeys( ctx, this.input.keys, this.input.lastPressed );

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
    game.input.lastPressed[ event.which ] = Date.now();
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
