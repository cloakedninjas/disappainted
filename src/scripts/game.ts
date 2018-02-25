/// <reference path="../refs.d.ts" />

module Alak {
    export class Game extends Phaser.Game {

        constructor() {
            super(800, 600, Phaser.CANVAS);

            this.state.add('preloader', State.Preloader, true);
            this.state.add('main-menu', State.MainMenu);
            this.state.add('game', State.Game);
            this.state.add('end', State.End);
        }
    }
}

// export Game to window
var Game = Alak.Game;

