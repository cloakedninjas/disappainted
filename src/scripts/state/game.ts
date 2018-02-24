module Alak.State {
    export class Game extends Phaser.State {
        tempDrawArea: Phaser.BitmapData;

        easelWood: Phaser.Image;
        easelCanvas: Phaser.Image;

        easelArea: Phaser.BitmapData;
        easelImage: Phaser.Image;
        subjectComposite: Phaser.BitmapData;
        subjectCompositeImage: Phaser.Image;
        subjectChunkData: number[];
        easelWidth: number = 380;
        easelHeight: number = 490;
        easelX: number = 400;
        easelY: number = 40;
        subjectX: number = 90;
        subjectY: number = 90;
        lookingAtSubject: boolean = true;
        paintPots: Entity.PaintPot[];
        currentColour: string;
        prevMousePos: Phaser.Point;
        debug: Phaser.Text;
        debugEnabled: boolean = false;

        create() {
            //this.add.image(0, 0, 'placeholder');

            this.easelWood = new Phaser.Image(this.game, this.easelX + 45, this.easelY - 51, 'easel-wood');
            this.easelCanvas = new Phaser.Image(this.game, this.easelX - 9, this.easelY - 5, 'easel-canvas');
            this.add.existing(this.easelCanvas);

            this.tempDrawArea = new Phaser.BitmapData(this.game, null, this.easelWidth, this.easelHeight);
            this.easelArea = new Phaser.BitmapData(this.game, null, this.easelWidth, this.easelHeight);
            this.easelImage = this.easelArea.addToWorld(this.easelX, this.easelY);

            // add wood after painting area
            this.add.existing(this.easelWood);

            this.subjectComposite = new Phaser.BitmapData(this.game, null, this.easelWidth, this.easelHeight);
            this.subjectCompositeImage = this.subjectComposite.addToWorld(this.subjectX, this.subjectY);

            // standin
            this.subjectComposite.draw(new Phaser.Image(this.game, 0, 0, 'dummy-subject'));
            this.subjectCompositeImage.scale.x = 0.75;
            this.subjectCompositeImage.scale.y = 0.75;

            //let foo = this.add.image(this.easelX, this.easelY, 'dummy-subject');
            //foo.alpha = 0.5;

            this.paintPots = [];
            this.paintPots.push(new Entity.PaintPot(this.game, 0, 500, 'red'));
            this.paintPots.push(new Entity.PaintPot(this.game, 100, 500, 'blue'));

            this.paintPots.forEach(function (paintpot: Entity.PaintPot) {
                this.add.existing(paintpot);
                paintpot.events.onInputDown.add(this.handleColourChange, this);
            }, this);

            this.currentColour = this.paintPots[0].colour;

            if (this.debugEnabled) {
                this.debug = new Phaser.Text(this.game, 400, this.game.height - 20, 'Hello', {
                    font: '12px Arial'
                });

                this.add.existing(this.debug);
            }

            window['foo'] = this;

            this.game.canvas.classList.add('hide-cursor');

            let cursor = this.add.sprite(this.game.input.mousePointer.x, this.game.input.mousePointer.y, 'brush-cursor');
            cursor.anchor.set(0.13, 1);

            this.game.input.addMoveCallback(function () {
                cursor.x = Math.round(this.game.input.mousePointer.x);
                cursor.y = Math.round(this.game.input.mousePointer.y);
            }, this);

            this.game.input.onDown.add(function () {
                cursor.loadTexture('brush-cursor-down');
            }, this);

            this.game.input.onUp.add(function () {
                cursor.loadTexture('brush-cursor');
            }, this);
        }

        update() {
            let game = this.game;
            let lineWidth = 4;

            if (game.input.activePointer.isDown) {
                let paintX = game.input.x - this.easelX;
                let paintY = game.input.y - this.easelY;

                this.tempDrawArea.circle(paintX, paintY, lineWidth / 2, this.currentColour);

                if (this.prevMousePos) {
                    this.tempDrawArea.line(paintX, paintY, this.prevMousePos.x, this.prevMousePos.y, this.currentColour, lineWidth);
                }

                this.easelArea.copy(this.tempDrawArea);

                this.prevMousePos = new Phaser.Point(paintX, paintY);
            } else {
                this.prevMousePos = null;
            }

            if (this.debugEnabled) {
                let paintX = game.input.x - this.easelX;
                let paintY = game.input.y - this.easelY;

                if (paintX >= 0 && paintY >= 0 && paintX <= this.easelWidth && paintY <= this.easelHeight) {
                    let subjectCol = this.subjectComposite.getPixel(paintX, paintY);
                    let easelCol = this.easelArea.getPixel(paintX, paintY);

                    subjectCol = subjectCol.r + ',' + subjectCol.g + ',' + subjectCol.b;
                    easelCol = easelCol.r + ',' + easelCol.g + ',' + easelCol.b;

                    this.debug.text = paintX + ', ' + paintY + ' | Subject: ' + subjectCol + '| Easel: ' + easelCol;
                }
            }
        }

        lookAtSubject() {
            this.lookingAtSubject = !this.lookingAtSubject;
            this.moveCanvas(this.lookingAtSubject);
        }

        moveCanvas(towards: boolean) {
            let duration = 800;
            let easing = Phaser.Easing.Quintic.InOut;

            if (towards) {
                this.game.add.tween(this.easelImage.position).to({
                    x: this.easelX
                }, duration, easing, true);

                this.game.add.tween(this.subjectCompositeImage.position).to({
                    x: this.subjectX
                }, duration, easing, true);
            } else {
                this.game.add.tween(this.easelImage.position).to({
                    x: 715
                }, duration, easing, true);

                this.game.add.tween(this.subjectCompositeImage.position).to({
                    x: 155
                }, duration, easing, true);
            }
        }

        calcScore() {
            let score = 0;

            this.easelArea.update();
            this.subjectComposite.update();

            let userData = this.easelArea.imageData.data;
            let subjectData = this.subjectComposite.imageData.data;

            for (let i = 0, len = userData.length; i < len; i += 4) {
                if (
                    userData[i] === subjectData[i] && // R
                    userData[i + 1] === subjectData[i + 1] && // G
                    userData[i + 2] === subjectData[i + 2] // B
                ) {
                    score++;
                }
            }

            console.log(score);
        }

        handleColourChange(paintPot: Entity.PaintPot) {
            this.currentColour = paintPot.colour;
        }

        calcChunkData(sourceBitmap: Phaser.BitmapData):number[] {
            let chunkSize = 10;
            let chunks = [];
            let k = 0;
            let data = sourceBitmap.imageData.data;
            let chunkWidth = this.easelWidth / chunkSize;
            let chunkHeight = this.easelHeight / chunkSize;
            let pxChunkSize = chunkSize * 4;

            let checkRow = 1;

            for (let y = 0; y < chunkHeight; y++) {
                for (let x = 0; x < chunkWidth; x++) {
                    let r = (y * pxChunkSize * chunkWidth) + (x * pxChunkSize);

                    chunks[k] = data[r] << 16;
                    chunks[k] = chunks[k] + (data[r + 1] << 8);
                    chunks[k] = chunks[k] + data[r + 2];

                    k++;
                }
            }

            return chunks;
        }
    }
}
