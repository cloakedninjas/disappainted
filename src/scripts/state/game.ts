module Alak.State {
    export class Game extends Phaser.State {
        tempDrawArea: Phaser.BitmapData;

        easelWood: Phaser.Image;
        easelCanvas: Phaser.Image;

        visibleBitmap: Phaser.BitmapData;
        easelImage: Phaser.Image;
        finalBitmap: Phaser.BitmapData;

        subjectScale: number = 0.75;
        subjectLower: Phaser.Image;
        subjectComposite: Phaser.BitmapData;
        subjectCompositeImage: Phaser.Image;

        judgingRect: Phaser.Rectangle;

        easelWidth: number = 380;
        easelHeight: number = 490;
        easelX: number = 400;
        easelY: number = 40;
        subjectX: number = 85;
        subjectY: number = 76;
        brushSize: number = 5;

        paintBrush: Phaser.Sprite;
        palette: Entity.Palette;
        prevMousePos: Phaser.Point;
        debug: Phaser.Text;
        debugEnabled: boolean = false;

        sounds: {
            paintStart: Phaser.Sound
            //paintContinuous: Phaser.Sound
        };

        create() {
            this.add.image(0, 0, 'background');
            this.easelWood = new Phaser.Image(this.game, this.easelX + 45, this.easelY - 51, 'easel-wood');
            this.easelCanvas = new Phaser.Image(this.game, this.easelX - 9, this.easelY - 5, 'easel-canvas');
            this.add.existing(this.easelCanvas);

            this.tempDrawArea = new Phaser.BitmapData(this.game, null, this.easelWidth, this.easelHeight);
            this.visibleBitmap = new Phaser.BitmapData(this.game, null, this.easelWidth, this.easelHeight);
            this.easelImage = this.visibleBitmap.addToWorld(this.easelX, this.easelY);
            this.easelImage.inputEnabled = true;
            this.visibleBitmap.fill(237, 232, 218, 1);

            this.finalBitmap = new Phaser.BitmapData(this.game, null, this.easelWidth, this.easelHeight);

            // add wood after painting area
            this.add.existing(this.easelWood);

            this.createSubject();

            this.palette = new Entity.Palette(this.game, -18, 541);
            this.add.existing(this.palette);

            if (this.debugEnabled) {
                this.debug = new Phaser.Text(this.game, 10, 10, 'Hello', {
                    font: '12px Arial'
                });

                this.add.existing(this.debug);
            }

            let startSound = this.add.sound('play');
            startSound.play();

            this.game.canvas.classList.add('hide-cursor');

            this.paintBrush = this.add.sprite(this.game.input.mousePointer.x, this.game.input.mousePointer.y, 'brush-cursor');
            this.paintBrush.anchor.set(0.13, 1);

            this.game.input.addMoveCallback(function () {
                this.paintBrush.x = Math.round(this.game.input.mousePointer.x);
                this.paintBrush.y = Math.round(this.game.input.mousePointer.y);

                /*if (this.game.input.activePointer.isDown && !this.sounds.paintContinuous.isPlaying) {
                    this.sounds.paintContinuous.play();
                }

                if (!this.game.input.activePointer.isDown && this.sounds.paintContinuous.isPlaying) {
                    this.sounds.paintContinuous.stop();
                }*/
            }, this);

            /*this.game.input.onDown.add(function () {
                this.paintBrush.loadTexture('brush-cursor-down');
                this.sounds.paintStart.play();
            }, this);*/

            this.easelImage.events.onInputDown.add(function () {
                this.paintBrush.loadTexture('brush-cursor-down');
                this.sounds.paintStart.play();
            }, this);

            this.game.input.onUp.add(function () {
                this.paintBrush.loadTexture('brush-cursor');
                //this.sounds.paintContinuous.stop();
            }, this);

            this.sounds = {
                paintStart: new Phaser.Sound(this.game, 'paint-start'),
                //paintContinuous: new Phaser.Sound(this.game, 'paint-continuous', 1, true)
            };

            let timer = this.game.time.create();

            timer.loop(100, function () {
                this.visibleBitmap.fill(237, 232, 218, 0.2);
            }, this);

            timer.start();
        }

        update() {
            let game = this.game;

            if (game.input.activePointer.isDown) {
                let paintX = game.input.x - this.easelX;
                let paintY = game.input.y - this.easelY;

                this.tempDrawArea.circle(paintX, paintY, this.brushSize / 2, this.palette.currentColour);

                if (this.prevMousePos) {
                    this.tempDrawArea.line(paintX, paintY, this.prevMousePos.x, this.prevMousePos.y, this.palette.currentColour, this.brushSize);
                }

                this.visibleBitmap.copy(this.tempDrawArea);
                this.finalBitmap.copy(this.tempDrawArea);
                this.tempDrawArea.clear();

                this.prevMousePos = new Phaser.Point(paintX, paintY);
            } else {
                this.prevMousePos = null;
            }

            //this.visibleBitmap.fill(237, 232, 218, 0.05);

            if (this.debugEnabled) {
                let paintX = game.input.x - this.easelX;
                let paintY = game.input.y - this.easelY;

                if (paintX >= 0 && paintY >= 0 && paintX <= this.easelWidth && paintY <= this.easelHeight) {
                    let subjectCol = this.subjectComposite.getPixel(paintX, paintY);
                    let easelCol = this.finalBitmap.getPixel(paintX, paintY);

                    subjectCol = this.rgb2Hex(subjectCol.r, subjectCol.g, subjectCol.b);
                    easelCol = this.rgb2Hex(easelCol.r, easelCol.g, easelCol.b);

                    this.debug.text = paintX + ', ' + paintY + ' | Subject: ' + subjectCol + '| Easel: ' + easelCol;


                }

                /*let ctx = this.game.canvas.getContext('2d');
                 ctx.save();

                 ctx.strokeStyle = 'red';
                 ctx.strokeRect(0, 0, 100, 100);

                 ctx.fillStyle = 'rgb(' + subjectCol + ')';
                 ctx.fillRect(100, 20, 10, 10);

                 ctx.fillStyle = 'rgb(' + easelCol + ')';
                 ctx.fillRect(150, 20, 10, 10);

                 ctx.restore();*/
            }
        }

        calcScore() {
            let score = 0;
            let score2 = 0;
            let total1 = 0;
            let total2 = 0;

            // update BMDs
            this.finalBitmap.update();
            this.subjectComposite.update();

            this.easelImage.visible = false;

            // define judging area
            this.judgingRect = new Phaser.Rectangle(30, 10, 290, 480);

            // chop up image into 10x10 chunks
            let subjectChunkData = this.calcChunkData(this.subjectComposite.getPixels(this.judgingRect));
            let userChunkData = this.calcChunkData(this.finalBitmap.getPixels(this.judgingRect));

            for (let i = 0, len = userChunkData.length; i < len; i++) {
                if (subjectChunkData[i] !== 0) {
                    total1++;

                    if (userChunkData[i] === subjectChunkData[i]) {
                        score++;
                    }
                }

                if (subjectChunkData[i] === 0) {
                    total2++;

                    if (userChunkData[i] === 0) {
                        score2++;
                    }
                }
            }

            //console.log(score, (score / total1) * 100);
            //console.log(score2, (score2 / total1) * 100);

            return {
                leftBlank: Math.round((score2 / total2) * 100),
                painted: Math.round((score / total1) * 100)
            }
        }

        calcChunkData(sourceData: ImageData): number[] {
            let chunkColours = [];
            let chunkSize = 10;
            let compWidth = sourceData.width * 4;
            let chunkWidth = sourceData.width / chunkSize;

            for (let i = 0; i < sourceData.data.length; i += 4) {
                let x = (i % compWidth) / 4;
                let y = Math.floor(i / compWidth);

                let chunkIndex = (Math.floor(y / chunkSize) * chunkWidth) + Math.floor(x / chunkSize);

                if (!chunkColours[chunkIndex]) {
                    chunkColours[chunkIndex] = [];
                }

                let colour = this.rgb2Dec(sourceData.data[i], sourceData.data[i + 1], sourceData.data[i + 2]);
                chunkColours[chunkIndex].push(colour);
            }

            // reduce each chunk array to a single value

            chunkColours.forEach(function (chunk, i) {
                chunkColours[i] = this.getMode(chunk);
            }, this);

            return chunkColours;
        }

        /*calcChunkData(sourceData: ImageData): number[] {
         let chunkSize = 10;
         let chunks = [];
         let k = 0;
         let data = sourceData.data;
         let chunkWidth = this.easelWidth / chunkSize;
         let chunkHeight = this.easelHeight / chunkSize;
         let pxChunkSize = chunkSize * 4;

         for (let y = 0; y < chunkHeight; y++) {
         for (let x = 0; x < chunkWidth; x++) {

         // find the mode

         let chunkColours = [];

         for (let i = 0; i < chunkSize; i++) {
         for (let j = 0; j < chunkSize; j++) {

         let r = (y * pxChunkSize * chunkWidth) + (x * pxChunkSize);

         let colour = this.rgb2Dec(data[r], data[r + 1], data[r + 2]);

         chunkColours.push(data[r])

         //chunkColourTotals
         }
         }

         chunks[k] = this.getMode(chunkColours);

         //chunks[k] = this.rgb2Dec(data[r], data[r + 1], data[r + 2]);
         k++;
         }
         }

         return chunks;
         }*/

        createSubject() {
            let bodyPerm = Math.floor(Phaser.Math.random(1, Entity.Subject.BODY_PERMS + 1));
            this.subjectLower = this.add.image(this.subjectX - 27, this.easelHeight - 47, 'subject-pants-' + bodyPerm);
            this.subjectLower.scale.x = this.subjectScale;
            this.subjectLower.scale.y = this.subjectScale;

            this.subjectComposite = new Phaser.BitmapData(this.game, null, this.easelWidth, this.easelHeight);

            // shirt
            this.subjectComposite.draw(new Phaser.Image(this.game, 0, 0, 'subject-shirt-' + bodyPerm));

            // build the face
            this.subjectComposite.draw(new Phaser.Image(this.game, 0, 0, 'subject-face'));

            Entity.Subject.FACE_PIECES.forEach(function (piece) {
                let piecePerm = Math.floor(Phaser.Math.random(1, Entity.Subject.FACE_PERMS + 1));
                let key = 'subject-' + piece + '-' + piecePerm;

                this.subjectComposite.draw(new Phaser.Image(this.game, 0, 0, key));
            }, this);


            this.subjectCompositeImage = this.subjectComposite.addToWorld(this.subjectX, this.subjectY);
            this.subjectCompositeImage.scale.x = 0.75;
            this.subjectCompositeImage.scale.y = 0.75;
        }

        hideBrush() {
            this.paintBrush.visible = false;
        }

        endGame() {
            // move objects
            let duration = 1500;
            let easing = Phaser.Easing.Circular.InOut;

            let scores = this.calcScore();

            this.game.add.tween(this.palette).to({
                y: this.palette.y + 200
            }, duration, easing, true);

            // subject
            this.game.add.tween(this.subjectCompositeImage).to({
                x: -(this.subjectCompositeImage.x + this.subjectCompositeImage.width)
            }, duration, easing, true);

            this.game.add.tween(this.subjectLower).to({
                x: -(this.subjectLower.x + this.subjectLower.width)
            }, duration, easing, true);

            // easel
            this.easelImage.visible = false;

            this.game.add.tween(this.easelWood).to({
                x: this.game.width
            }, duration, easing, true);

            let tween = this.game.add.tween(this.easelCanvas).to({
                x: this.game.width
            }, duration, easing, true);

            tween.onComplete.add(function () {
                this.game.state.start('end', true, false, {
                    scores: scores,
                    subject: this.subjectComposite,
                    canvas: this.finalBitmap
                });
            }, this);
        }

        rgb2Hex(r, g, b) {
            return r.toString(16) + g.toString(16) + b.toString(16);
        }

        rgb2Dec(r, g, b) {
            return (r << 16) + (g << 8) + b;
        }

        /**
         * https://stackoverflow.com/a/20762713/423734
         */
        getMode(input: number[]) {
            return input.sort((a, b) =>
                input.filter(v => v === a).length - input.filter(v => v === b).length
            ).pop();
        }
    }
}
