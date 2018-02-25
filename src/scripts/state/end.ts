module Alak.State {
    export class End extends Phaser.State {
        group1: Phaser.Group;
        group2: Phaser.Group;

        scores: any;
        subjectImage: Phaser.BitmapData;
        canvasImage: Phaser.BitmapData;

        continueButton: Phaser.Button;

        init(opts) {
            this.scores = opts.scores;
            this.subjectImage = opts.subject;
            this.canvasImage = opts.canvas;
        }

        create() {
            let xOffset = 500;
            let duration = 800;
            let easing = Phaser.Easing.Circular.InOut;

            this.add.image(0, 0, 'background');

            this.group1 = this.add.group();
            this.group2 = this.add.group();

            this.group1.x = -xOffset;
            this.group2.x = xOffset;

            this.makeCanvas(this.subjectImage, this.group1, 1);
            this.makeCanvas(this.canvasImage, this.group2, 2);

            let title1 = new Phaser.Image(this.game, 35, 20, 'title-target-painting');
            this.group1.add(title1);

            let title2 = new Phaser.Image(this.game, 410, 20, 'title-your-painting');
            this.group2.add(title2);

            this.continueButton = new Phaser.Button(this.game, 575, 540, 'btn-continue', this.showScores, this);
            this.continueButton.visible = false;
            this.add.existing(this.continueButton);

            this.game.add.tween(this.group1).to({
                x: 0
            }, duration, easing, true);

            let tween = this.game.add.tween(this.group2).to({
                x: 0
            }, duration, easing, true);

            tween.onComplete.add(function () {
               this.continueButton.visible = true;
            }, this);
        }

        makeCanvas(bmd: Phaser.BitmapData, group: Phaser.Group, groupNum: number) {
            let scale = 0.90;

            let xPos = 35;
            let yPos = 100;

            if (groupNum === 2) {
                xPos = 420;
            }

            let canvasOffset = {
                x: xPos - 9,
                y: yPos - 6
            };

            let easelOffset = {
                x: xPos + 45,
                y: yPos - 51
            };

            let easel = new Phaser.Image(this.game, canvasOffset.x, canvasOffset.y, 'easel-canvas');
            easel.scale.x = scale;
            easel.scale.y = scale;
            group.add(easel);

            let image = new Phaser.Image(this.game, xPos, yPos, bmd);
            image.scale.x = scale;
            image.scale.y = scale;
            group.add(image);

            easel = new Phaser.Image(this.game, easelOffset.x, easelOffset.y, 'easel-wood');
            easel.scale.x = scale;
            easel.scale.y = scale;
            group.add(easel);
        }

        showScores() {

        }
    }
}
