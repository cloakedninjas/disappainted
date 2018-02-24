module Alak.State {
    export class Game extends Phaser.State {
        tempDrawArea: Phaser.BitmapData;
        easelArea: Phaser.BitmapData;
        easelImage: Phaser.Image;
        sourceImage: Phaser.Image;
        easelWidth: number = 380;
        easelHeight: number = 490;
        easelX: number = 400;
        easelY: number = 200;

        create() {
            this.tempDrawArea = new Phaser.BitmapData(this.game, 'drawing-area', this.easelWidth, this.easelHeight);
            this.easelArea = new Phaser.BitmapData(this.game, 'drawing-area', this.easelWidth, this.easelHeight);
            this.easelImage = this.easelArea.addToWorld(this.easelX, this.easelY);
            //this.easelArea.fill(209,169,114);

            window['foo'] = this;

            this.sourceImage = this.add.image(0, 0, 'test');
            this.sourceImage.scale.x = 0.4;
            this.sourceImage.scale.y = 0.4;
        }

        update() {
            let game = this.game;

            if (game.input.activePointer.isDown) {
                let paintX = game.input.x - this.easelX;
                let paintY = game.input.y - this.easelY;

                this.tempDrawArea.circle(paintX, paintY, 4, 'red');
                this.easelArea.copy(this.tempDrawArea);
            }
        }

        moveCanvas() {
            this.game.add.tween(this.easelImage.position).to({
                x: 600, y: 600
            }, 600, Phaser.Easing.Sinusoidal.Out, true);
        }

        calcScore() {
            let originalData = new Phaser.BitmapData(this.game, null, this.easelWidth, this.easelHeight);
            let score = 0;

            originalData.draw(this.sourceImage);

            this.easelArea.update();
            originalData.update();

            let userData = this.easelArea.imageData.data;
            let sourceData = originalData.imageData.data;

            for (let i = 0, len = userData.length; i < len; i += 4) {
                if (
                    userData[i] === sourceData[i] && // R
                    userData[i + 1] === sourceData[i + 1] // G
                ) {
                    score++;
                }
            }

            console.log(score);
            //console.log(originalData.imageData);
        }
    }
}
