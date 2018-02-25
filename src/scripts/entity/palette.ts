module Alak.Entity {
    export class Palette extends Phaser.Sprite {
        static POT_SIZE: number = 74;
        static X_OFFSET: number = 117;
        static COLOURS = [
            '#8c5214', '#eaac78', '#ffd4ae', '#fff',
            '#19a541', '#9abd3b', '#e53c70', '#ffb0c5'
        ];

        game: Game;
        localBounds: PIXI.Rectangle;
        highlight: Phaser.Image;
        potIndex: number;
        currentColour: string;
        startingY: number;
        beingHidden: boolean = false;
        animating: boolean = false;

        constructor(game, x, y) {
            super(game, x, y, 'palette');
            this.startingY = y;
            this.inputEnabled = true;
            this.localBounds = this.getLocalBounds();
            this.localBounds.x = Palette.X_OFFSET;
            this.localBounds.y = y;
            this.localBounds.width = 590;
            this.highlight = new Phaser.Image(game, 0, 5, 'selected-paint');
            this.highlight.visible = false;

            this.addChild(this.highlight);

            this.currentColour = Palette.COLOURS[0];

            this.events.onInputDown.add(function () {
                this.currentColour = Palette.COLOURS[this.potIndex];
            }, this);

            this.hide(1000);
        }

        update() {
            if (this.localBounds.contains(this.game.input.x, this.game.input.y)) {
                if (this.beingHidden && !this.animating) {
                    this.show();
                } else {
                    this.highlight.visible = true;

                    this.potIndex = Math.floor((this.game.input.x - Palette.X_OFFSET) / Palette.POT_SIZE);
                    this.highlight.x = (Palette.POT_SIZE * this.potIndex) + Palette.X_OFFSET + 18;
                }
            } else {
                if (!this.animating) {
                    this.hide(500);
                }

                this.highlight.visible = false;
            }
        }

        hide(delay: number = 0) {
            this.animating = true;
            let tween = this.game.add.tween(this.position).to({
                y: this.startingY + 45
            }, 800, Phaser.Easing.Circular.InOut, true, delay);

            tween.onComplete.add(function () {
                this.beingHidden = true;
                this.animating = false;
            }, this);
        }

        show() {
            this.animating = true;
            let tween = this.game.add.tween(this.position).to({
                y: this.startingY
            }, 400, Phaser.Easing.Circular.InOut, true);

            tween.onComplete.add(function () {
                this.beingHidden = false;
                this.animating = false;
            }, this);
        }

    }
}