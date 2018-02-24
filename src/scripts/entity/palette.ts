module Alak.Entity {
    export class Palette extends Phaser.Sprite {
        static POT_SIZE:number = 74;
        static X_OFFSET:number = 117;
        game:Game;
        localBounds: PIXI.Rectangle;
        highlight: Phaser.Image;

        constructor(game, x, y) {
            super(game, x, y, 'palette');
            this.inputEnabled = true;
            this.localBounds = this.getLocalBounds();
            this.localBounds.x = Palette.X_OFFSET;
            this.localBounds.y = y;
            this.localBounds.width = 590;
            this.highlight = new Phaser.Image(game, 0, 5, 'selected-paint');
            this.highlight.visible = false;

            this.addChild(this.highlight);
        }

        update() {
            if (this.localBounds.contains(this.game.input.x, this.game.input.y)) {
                this.highlight.visible = true;

                let potPos = Math.floor((this.game.input.x - Palette.X_OFFSET) / Palette.POT_SIZE);
                this.highlight.x = (Palette.POT_SIZE * potPos) + Palette.X_OFFSET + 18;

            } else {
                this.highlight.visible = false;
            }
        }
    }
}