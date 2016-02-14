var desk, ludo;
var socket = io();

window.addEventListener('load', function () {
    console.time('load time');
    //var htmlCanvas = document.getElementById('ludo-canvas');
    //console.log(window.innerWidth / 2.4);
    //htmlCanvas.width = htmlCanvas.height = window.innerWidth / 2.4;
    var canvas = new fabric.Canvas('ludo-canvas', {
        renderOnAddRemove: false,
        selection: false
    });
    var paths = {
        hearts: 'M 200.04 1.68 C 211.29 -0.02 222.71 0.80 234.00 1.57 C 256.97 4.10 280.03 11.16 298.50 25.46 C 317.57 39.20 331.10 60.56 334.57 83.88 C 337.37 101.62 334.44 120.21 326.35 136.24 C 322.01 146.24 314.99 154.74 307.90 162.90 C 295.21 175.89 279.83 186.07 263.16 193.20 C 278.10 199.83 292.10 208.78 303.94 220.08 C 319.35 235.75 330.57 256.06 333.33 278.03 C 336.69 300.67 330.15 324.25 316.67 342.61 C 307.16 354.90 295.03 365.34 280.92 371.98 C 262.56 381.58 241.70 384.89 221.24 386.00 L 206.93 386.00 C 195.73 384.10 184.44 382.03 174.10 377.13 C 159.14 369.97 145.93 359.31 135.38 346.55 C 109.82 317.22 94.33 280.62 68.41 251.54 C 62.72 244.30 55.93 238.05 49.80 231.20 C 34.90 216.61 19.37 201.88 0.08 193.25 C 4.23 191.42 8.39 189.57 12.32 187.27 C 30.90 175.80 46.55 160.29 61.16 144.20 C 67.65 136.94 73.67 129.25 79.13 121.18 C 83.79 115.04 87.99 108.58 91.76 101.86 C 107.03 77.29 120.96 51.26 142.16 31.13 C 157.54 15.33 178.17 4.67 200.04 1.68 Z',
        spades: 'M 121.08 4.47 C 133.40 0.90 146.36 1.81 159.02 0.87 C 167.53 0.23 175.99 1.60 184.47 1.91 C 193.27 3.12 202.53 3.99 210.29 8.72 C 212.54 9.68 212.22 13.22 210.15 14.18 C 207.33 15.88 203.96 16.47 201.22 18.36 C 195.80 22.15 191.46 27.39 188.43 33.25 C 183.12 42.67 180.27 53.19 177.85 63.65 C 174.53 76.87 174.01 90.54 172.28 104.00 C 179.49 90.94 188.63 78.69 200.58 69.60 C 213.81 59.18 230.09 52.53 246.98 51.73 C 260.25 51.18 273.74 54.04 285.44 60.38 C 294.83 64.79 302.47 72.04 309.45 79.56 C 321.09 93.23 328.20 110.29 331.61 127.81 C 335.39 147.83 335.98 169.12 328.44 188.38 C 322.50 204.88 310.22 217.89 297.48 229.47 C 273.02 249.48 243.77 262.47 219.01 282.05 C 206.76 291.68 195.67 302.70 185.42 314.41 C 178.63 322.98 171.56 331.64 167.65 342.00 L 166.46 342.00 C 161.89 330.92 154.38 321.41 146.50 312.51 C 139.93 304.44 132.25 297.40 124.62 290.37 C 120.23 286.06 115.42 282.22 110.54 278.49 C 90.54 261.47 66.51 250.20 45.65 234.37 C 28.28 221.71 12.23 205.53 5.05 184.81 C 2.24 177.92 1.74 170.44 0.00 163.27 L 0.00 145.77 C 1.89 132.62 3.62 119.22 8.86 106.90 C 13.97 93.58 22.29 81.44 33.05 72.04 C 38.67 67.58 44.24 62.77 51.02 60.16 C 60.77 55.89 71.29 53.00 82.00 53.14 C 91.07 52.91 100.25 53.91 108.80 57.06 C 131.07 64.61 149.93 81.25 160.88 101.99 C 160.13 88.44 157.90 74.96 153.79 62.00 C 148.19 44.66 140.10 27.01 125.32 15.60 C 122.74 13.47 117.88 12.22 118.45 7.99 C 118.18 6.18 119.47 4.96 121.08 4.47 Z',
        diamonds: 'M 172.67 0.00 L 180.05 0.00 C 185.43 1.70 189.93 5.21 193.58 9.43 C 244.72 60.63 295.90 111.78 347.06 162.95 C 354.39 170.01 354.32 182.92 346.86 189.86 C 294.55 242.22 242.22 294.55 189.88 346.87 C 182.98 354.27 169.94 354.49 163.06 346.97 C 111.18 295.17 59.39 243.27 7.50 191.49 C 4.56 188.86 2.18 185.59 0.96 181.82 C -0.90 175.23 0.81 167.60 5.88 162.87 C 53.24 114.91 101.15 67.50 148.70 19.72 C 156.39 12.85 162.58 3.56 172.67 0.00 Z',
        clubs: 'M 114.42 16.35 C 132.27 3.94 154.67 0.36 176.00 0.62 C 194.24 0.85 212.94 2.69 229.85 9.99 C 241.61 14.99 252.27 23.61 257.75 35.36 C 264.02 48.24 263.62 63.14 261.37 76.95 C 258.38 94.47 249.90 110.45 240.22 125.15 C 237.95 128.76 234.42 132.20 235.25 136.87 C 237.05 136.72 239.07 136.83 240.40 135.38 C 244.74 131.37 248.93 127.11 254.01 124.02 C 264.94 116.97 278.13 114.30 290.99 114.33 C 301.69 114.03 312.44 117.49 320.83 124.16 C 333.51 134.52 340.20 150.38 343.17 166.13 C 347.49 189.81 346.22 214.82 337.63 237.43 C 331.04 254.52 320.01 270.36 304.56 280.51 C 292.47 288.56 277.31 292.08 262.97 289.46 C 243.97 286.31 226.92 276.01 212.77 263.27 C 202.86 254.25 194.06 243.70 188.51 231.41 C 186.53 227.72 184.85 223.12 180.76 221.33 C 177.35 220.00 176.02 224.35 176.22 226.96 C 175.89 253.73 181.86 280.84 194.73 304.40 C 200.37 314.21 207.38 323.70 217.16 329.72 C 218.57 330.83 220.73 331.89 220.55 334.01 C 220.78 336.52 218.09 337.90 216.01 338.39 C 208.51 340.31 200.70 340.35 193.04 341.15 C 174.39 341.63 155.45 342.27 137.13 338.10 C 132.50 336.93 127.78 335.58 123.83 332.82 C 122.25 329.74 125.53 327.66 128.09 327.02 C 138.01 323.95 144.70 315.18 149.17 306.25 C 156.54 291.30 159.97 274.77 162.33 258.38 C 163.97 245.97 165.06 233.46 164.73 220.94 C 164.89 218.73 163.54 215.79 160.94 216.10 C 157.12 215.82 155.35 219.93 153.75 222.70 C 144.54 241.33 130.73 258.10 112.70 268.75 C 97.97 277.65 80.22 281.58 63.13 279.20 C 49.85 276.60 37.70 269.35 28.49 259.50 C 10.99 241.34 1.75 216.38 0.00 191.46 L 0.00 180.60 C 1.66 158.93 8.02 136.44 23.45 120.45 C 34.14 108.69 50.61 102.01 66.48 104.31 C 81.49 106.29 95.20 113.29 108.11 120.82 C 111.83 122.83 115.22 126.13 119.72 125.95 C 119.74 124.73 119.75 123.52 119.76 122.32 C 110.54 115.54 101.92 107.49 96.71 97.15 C 90.61 85.42 89.03 71.99 88.84 58.95 C 89.60 41.64 100.22 25.79 114.42 16.35 Z',
        arrow: 'M 0.01 0.01 C 4.41 1.08 7.75 4.46 11.92 6.11 C 16.27 8.48 21.30 9.37 25.45 12.09 C 22.51 13.53 19.35 14.58 16.04 14.32 C 29.03 28.56 41.73 43.06 54.65 57.37 C 58.92 61.41 62.57 66.05 66.57 70.36 C 76.92 82.54 87.80 94.26 98.34 106.28 C 101.34 110.13 106.83 109.71 111.22 109.90 C 118.16 117.66 125.23 125.30 131.99 133.22 C 126.69 135.78 120.87 132.84 116.48 129.82 C 118.94 134.03 122.00 141.18 117.76 144.99 C 110.86 137.59 104.20 129.97 97.47 122.41 C 97.55 118.13 98.47 113.10 95.76 109.41 C 82.62 94.51 69.06 79.97 55.77 65.19 C 41.82 48.84 27.03 33.22 12.96 16.97 C 12.63 20.30 12.08 24.15 9.01 26.13 C 7.70 16.94 4.20 8.24 0.01 0.01 Z',
    };
    var sounds = {
        turn: new Audio('/media/turn.mp3'),
        dice: new Audio('/media/dice.mp3'),
        token: new Audio('/media/token.mp3')
    };
    var conf = {
        strokeWidth: canvas.width * 0.00375
    };
    conf.gridSize = (canvas.width - conf.strokeWidth) / 15;
    conf.cellSize = conf.gridSize - conf.strokeWidth + 1;

    fabric.Object.prototype.originX = 'center';
    fabric.Object.prototype.originY = 'center';
    fabric.Object.prototype.selectable = false;
    fabric.Text.prototype.fontFamily = 'Arial';
    fabric.Text.prototype.fontWeight = 'bold';

    fabric.Object.prototype.getInnerTop = function () {
        return this.stroke ? this.top + this.strokeWidth : this.top;
    };
    fabric.Object.prototype.getInnerLeft = function () {
        return this.stroke ? this.left + this.strokeWidth : this.left;
    };
    fabric.Object.prototype.getFullWidth = function () {
        return this.stroke ? this.width + this.strokeWidth : this.width;
    };
    fabric.Object.prototype.getInnerWidth = function () {
        return this.stroke ? this.width - this.strokeWidth : this.width;
    };
    fabric.Object.prototype.getFullHeight = function () {
        return this.stroke ? this.height + this.strokeWidth : this.height;
    };
    fabric.Object.prototype.getInnerHeight = function () {
        return this.stroke ? this.height - this.strokeWidth : this.height;
    };
    fabric.Object.prototype.setPosition = function (pos) {
        this.set({
            left: (pos[0] - 0.5) * conf.gridSize + conf.strokeWidth / 2,
            top: (pos[1] - 0.5) * conf.gridSize + conf.strokeWidth / 2
        });
        this.col = pos[0];
        this.row = pos[1];
        this.setCoords();
    };
    fabric.Object.prototype.animatePosition = function (pos, extra) {
        console.time('animate');
        var obj = this;
        if (obj.type === 'token') {
            setTimeout(function () {
                sounds.token.play();
            }, 250);
        }
        var animation = {
            left: (pos[0] - 0.5) * conf.gridSize + conf.strokeWidth / 2,
            top: (pos[1] - 0.5) * conf.gridSize + conf.strokeWidth / 2
        };
        if (extra) {
            for (var key in extra) {
                animation[key] = extra[key];
            }
        }
        obj.animate(animation, {
            duration: 400,
            onChange: function () {
                //ludo.checkMultiTokens(obj.team);
                canvas.renderAll();
            },
            onComplete: function () {
                if (obj.type === 'token') {
                    obj._animated = false;
                    ludo.checkMultiTokens(obj.team);
                    //obj.bringToFront();
                    //sounds.token.play();
                }
                console.timeEnd('animate');
            }
        });
        //obj.animate({
        //   radius: obj.radius + obj.radius * 0.1
        //}, {
        //    duration: 250,
        //    onChange: function () {
        //        canvas.renderAll();
        //    },
        //    onComplete: function () {
        //        obj.animate({
        //            radius: obj.radius / 110 * 100
        //        }, {
        //            duration: 250,
        //            onChange: function () {
        //                canvas.renderAll();
        //            },
        //        });
        //    }
        //});
        obj.col = pos[0];
        obj.row = pos[1];
    };

    desk = {
        dice: new fabric.Group(),
        timer: new fabric.Circle(),
        moveTarget: (function () {
            var rect = new fabric.Rect({
                fill: '',
                stroke: '',
                strokeWidth: conf.strokeWidth / 3,
                width: conf.cellSize,
                height: conf.cellSize
            });
            var circle = new fabric.Circle({
                radius: conf.cellSize * 0.4 - conf.strokeWidth * 0.8,
                _savedRadius: conf.cellSize * 0.4 - conf.strokeWidth * 0.8,
                fill: '',
                stroke: 'black',
                strokeWidth: conf.strokeWidth * 1.5
            });
            var moveTarget = new fabric.Group([rect, circle], {
                position: 0,
                selectable: true,
                hasControls: false,
                lockMovementX: true,
                lockMovementY: true,
                hoverCursor: 'pointer',
                hasBorders: false,
                type: 'target',
                isAnimated: false
            });
            moveTarget.runAnimation = function (self) {
                self.bringToFront();
                var circle = self._objects[1];
                circle.set('radius', circle._savedRadius);
                circle.animate({radius: conf.strokeWidth}, {
                    duration: 700,
                    onChange: canvas.renderAll.bind(canvas),
                    onComplete: (function () {
                        if (this.isAnimated) {
                            this.set('radius', this._savedRadius);
                            this.runAnimation(self);
                        }
                    }).bind(self)
                });
            };
            return moveTarget;
        })(),
        positions: {
            red: {
                outer: [
                    [6, 9], [5, 9], [4, 9], [3, 9], [2, 9], [1, 9], [1, 8], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]
                ],
                inner: [
                    [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8]
                ]
            },
            green: {
                outer: [
                    [7, 6], [7, 5], [7, 4], [7, 3], [7, 2], [7, 1], [8, 1], [9, 1], [9, 2], [9, 3], [9, 4], [9, 5], [9, 6]
                ],
                inner: [
                    [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7]
                ]
            },
            yellow: {
                outer: [
                    [10, 7], [11, 7], [12, 7], [13, 7], [14, 7], [15, 7], [15, 8], [15, 9], [14, 9], [13, 9], [12, 9], [11, 9], [10, 9]
                ],
                inner: [
                    [14, 8], [13, 8], [12, 8], [11, 8], [10, 8], [9, 8]
                ]
            },
            blue: {
                outer: [
                    [9, 10], [9, 11], [9, 12], [9, 13], [9, 14], [9, 15], [8, 15], [7, 15], [7, 14], [7, 13], [7, 12], [7, 11], [7, 10]
                ],
                inner: [
                    [8, 14], [8, 13], [8, 12], [8, 11], [8, 10], [8, 9]
                ]
            },
            dice: [
                [3.5, 2.5], [12.5, 2.5], [12.5, 11.5], [3.5, 11.5]
            ],
            timer: [
                [5.95, 1.05], [14.95, 1.05], [14.95, 10.05], [5.95, 10.05]
            ]
        },
        tokens: {
            red: {
                positions: [
                    [2, 4], [3, 4], [4, 4], [5, 4]
                ],
                color: '#9A141A'
            },
            green: {
                positions: [
                    [11, 4], [12, 4], [13, 4], [14, 4]
                ],
                color: '#457C30'
            },
            yellow: {
                positions: [
                    [11, 13], [12, 13], [13, 13], [14, 13]
                ],
                color: '#BD9807'
            },
            blue: {
                positions: [
                    [2, 13], [3, 13], [4, 13], [5, 13]
                ],
                color: '#184D81'
            }
        },
        names: {
            red: {
                position: [0.75, 0.75],
                color: '#E11E26'
            },
            green: {
                position: [9.75, 0.75],
                color: '#63B345'
            },
            yellow: {
                position: [9.75, 9.75],
                color: '#FCCB08'
            },
            blue: {
                position: [0.75, 9.75],
                color: '#226FBA'
            }
        },

        getRoute: function (color) {
            var colors = ['red', 'green', 'yellow', 'blue'];
            var index = colors.indexOf(color);
            var nextColor = function () {index = (index + 1) % 4; return colors[index]};
            var route = this.positions[color].outer.slice(8).concat(
                this.positions[nextColor()].outer,
                this.positions[nextColor()].outer,
                this.positions[nextColor()].outer,
                this.positions[color].outer.slice(0, 7),
                this.positions[color].inner
            );
            return route;
        },
        fillCell: function (col, row, color) {
            var rect = new fabric.Rect({
                width: conf.cellSize,
                height: conf.cellSize,
                fill: color
            });
            rect.setPosition([col, row]);
            canvas.add(rect);
        },
        drawPlayerArea: function (col, row, color) {
            var rect = new fabric.Rect({
                width: (conf.gridSize) * 6 - conf.strokeWidth * 2,
                height: (conf.gridSize) * 6 - conf.strokeWidth * 2,
                stroke: 'black',
                strokeWidth: conf.strokeWidth * 3,
                fill: color
            });
            rect.setPosition([col, row]);
            canvas.add(rect);
        },
        drawPath: function (path, opts) {
            var path = new fabric.Path(path, {
                fill: opts.fill || 'black'
            });

            path.scaleToWidth(opts.size);
            path.set({angle: opts.angle || 0});
            path.setPosition([opts.col, opts.row]);
            canvas.add(path);
        },
        drawBaseTriangle: function (opts) {
            var triangle = new fabric.Triangle({
                width: conf.cellSize * 3,
                height: conf.cellSize * 1.45,
                fill: opts.fill || 'black',
                angle: opts.angle || 0
            });
            triangle.setPosition([opts.col, opts.row]);
            canvas.add(triangle);
        },
        drawBase: function () {
            var clearRect = new fabric.Rect({
                width: conf.cellSize * 3,
                height: conf.cellSize * 3,
                fill: 'white'
            });
            clearRect.setPosition([8, 8]);
            canvas.add(clearRect);

            this.drawBaseTriangle({col: 7.25, row: 8, fill: '#E11E26', angle: 90 });
            this.drawBaseTriangle({col: 8, row: 7.25, fill: '#63B345', angle: 180 });
            this.drawBaseTriangle({col: 8.75, row: 8, fill: '#FCCB08', angle: 270 });
            this.drawBaseTriangle({col: 8, row: 8.75, fill: '#226FBA', angle: 0 });

            var rect = new fabric.Rect({
                width: conf.cellSize * 3 + conf.strokeWidth,
                height: conf.cellSize * 3 + conf.strokeWidth,
                fill: '',
                stroke: 'black',
                strokeWidth: conf.strokeWidth * 2
            });
            rect.setPosition([8, 8]);
            canvas.add(rect);
        },
        drawGrid: function () {
            for (var i = 0; i < 16; i++) {
                // vertical lines
                canvas.add(new fabric.Line(
                    [
                        i * (conf.gridSize) + conf.strokeWidth / 2,
                        conf.strokeWidth / 2,
                        i * (conf.gridSize) + conf.strokeWidth / 2,
                        conf.gridSize * 15 + conf.strokeWidth / 2
                    ],
                    {
                        stroke: 'black',
                        strokeWidth: !(i === 7 || i === 8) ? conf.strokeWidth * 1.5 : conf.strokeWidth
                    }
                ));
                canvas.add(new fabric.Line(
                    [
                        conf.strokeWidth / 2,
                        i * (conf.gridSize) + conf.strokeWidth / 2,
                        conf.gridSize * 15 + conf.strokeWidth / 2,
                        i * (conf.gridSize) + conf.strokeWidth / 2
                    ],
                    {
                        stroke: 'black',
                        strokeWidth: !(i === 7 || i === 8) ? conf.strokeWidth * 1.5 : conf.strokeWidth
                    }
                ));
            }
        },
        drawDice: function (n, turn) {
            var pos = this.positions.dice[turn];
            var diceRect = new fabric.Rect({
                width: conf.cellSize * 1.6,
                height: conf.cellSize * 1.6,
                rx: conf.strokeWidth * 2,
                ry: conf.strokeWidth * 2,
                fill: 'white',
                stroke: 'black',
                strokeWidth: conf.strokeWidth * 2
            });
            diceRect.setShadow({
                color: 'rgba(0,0,0,0.6)',
                blur: conf.cellSize / 2.6,
                offsetX: conf.cellSize / 6.5,
                offsetY: conf.cellSize / 6.5,
                opacity: 0.6,
                fillShadow: true,
                strokeShadow: true
            });
            var dicePoint5 = new fabric.Circle({
                radius: conf.strokeWidth * 2.9,
                fill: 'black'
            });
            var shift = diceRect.width / 3.3;
            var dicePoint1 = fabric.util.object.clone(dicePoint5).set({
                top: -shift,
                left: -shift
            });
            var dicePoint2 = fabric.util.object.clone(dicePoint5).set({
                top: -shift
            });
            var dicePoint3 = fabric.util.object.clone(dicePoint5).set({
                top: -shift,
                left: shift
            });
            var dicePoint4 = fabric.util.object.clone(dicePoint5).set({
                left: -shift
            });
            var dicePoint6 = fabric.util.object.clone(dicePoint5).set({
                left: shift
            });
            var dicePoint7 = fabric.util.object.clone(dicePoint5).set({
                top: shift,
                left: -shift
            });
            var dicePoint8 = fabric.util.object.clone(dicePoint5).set({
                top: shift
            });
            var dicePoint9 = fabric.util.object.clone(dicePoint5).set({
                top: shift,
                left: shift
            });
            var points = [
                new fabric.Text('Roll', {fontSize: conf.cellSize / 1.5}),
                new fabric.Group([dicePoint5]),
                new fabric.Group([dicePoint1, dicePoint9]),
                new fabric.Group([dicePoint1, dicePoint5, dicePoint9]),
                new fabric.Group([dicePoint1, dicePoint3, dicePoint7, dicePoint9]),
                new fabric.Group([dicePoint1, dicePoint3, dicePoint5, dicePoint7, dicePoint9]),
                new fabric.Group([dicePoint1, dicePoint2, dicePoint3, dicePoint7, dicePoint8, dicePoint9])
            ];
            canvas.remove(this.dice);
            this.dice = new fabric.Group([diceRect], {
                hasControls: false,
                lockMovementX: true,
                lockMovementY: true,
                hoverCursor: 'pointer',
                hasBorders: false,
                value: 0,
                type: 'dice'
            });
            this.dice.setValue = function (n) {
                this.remove(this._objects[1]);
                this.add(points[n]);
                this.value = n;
            };
            this.dice.setValue(n);
            this.dice.setPosition(pos);
            canvas.add(this.dice);
//=====================================================================================
//            canvas.forEachObject(function (obj) {
//                if (obj.type && obj.type === 'dice') return;
//                canvas.remove(obj);
//            });
//=====================================================================================
            if (n === 0) {
                this.dice.set({selectable: true});
                this.dice.setValue(n);
            }
            this.dice.update = function (n, turn) {
                this.set({
                    selectable: ludo.isTurn(),
                    angle: 0
                });
                this.setPosition(desk.positions.dice[turn]);
                this.setValue(n);

            };
            this.dice.roll = function (n) {
                var mod = [
                    [1, -1][Math.floor(Math.random() * 2)],
                    [1, -1][Math.floor(Math.random() * 2)],
                    [1, -1][Math.floor(Math.random() * 2)]
                ];
                var i = 0;
                var dice = this;
                dice.set({selectable: false});
                dice.animate({angle: 720 * mod[2]}, {
                    duration: 1500,
                    onChange: function () {
                        if (i < 4) {
                            dice.set({left: dice.left - conf.strokeWidth * 3 * mod[0]});
                        }
                        if (!(i % 4)) {
                            mod[0] *= -1;
                            mod[1] *= -1;
                        }
                        dice.set({left: dice.left + conf.strokeWidth * 3 * mod[0]});
                        if (!(i % 2)) {
                            dice.set({top: dice.top + conf.strokeWidth * mod[1]});
                        }
                        if (!(i % 12)) {
                            dice.remove(dice._objects[1]);
                            dice.add(points[Math.floor(Math.random() * 6) + 1]);
                        }
                        i++;
                        canvas.renderAll();
                    },
                    onComplete: function () {
                        dice.animatePosition([pos[0], pos[1] - 0.2], {angle: dice.angle + (Math.floor(Math.random() * (120 - 60)) + 60) * mod[2]});
                        dice.setValue(n);
                        var obj = canvas.getActiveObject();
                        if (obj && obj.type === 'token') {
                            ludo.select(obj);
                        }
                    }
                });
            };
            return this.dice;
        },
        drawTimer: function (o) {
            var g = Math.PI / 180;
            var circle = new fabric.Circle({
                radius: conf.cellSize / 7,
                fill: '',
                //originX: 'right',
                //originY: 'top',
                stroke: 'white',
                strokeWidth: conf.cellSize / 3.5,
                angle: -90,
                startAngle: 0,
                endAngle: g * 360

            });
            if (o.timeLeft) {
                var partLeft = o.timeLeft / o.time;
                circle.set('endAngle', g * 360 * partLeft);
                o.time *= partLeft;

            }
            canvas.remove(this.timer);
            this.timer = circle;
            circle.setPosition(o.pos);
            canvas.add(circle);
            circle.animate({endAngle: 0}, {
                duration: o.time,
                onChange: canvas.renderAll.bind(canvas),
                onComplete: function () {
                    if (o.callback) o.callback();
                }
            });
        },
        drawToken: function (team, pos) {
            var teams = ['red', 'green', 'yellow', 'blue'];
            var color = desk.tokens[team].color;
            var circle = new fabric.Circle({
                radius: conf.cellSize * 0.35 - conf.strokeWidth * 1,
                fill: color,
                stroke: color,
                strokeWidth: conf.strokeWidth * 1,
                selectable: team === teams[ludo.seat - 1],
                hasControls: false,
                lockMovementX: true,
                lockMovementY: true,
                hoverCursor: 'pointer',
                hasBorders: false,
                moveTarget: fabric.util.object.clone(desk.moveTarget),
                type: 'token',
                team: team,
                _color: color,
                _animated: false,
                position: 0
            });
            circle.setShadow({
                color: 'rgba(0,0,0,0.6)',
                blur: conf.cellSize / 2.6,
                offsetX: conf.cellSize / 6.5,
                offsetY: conf.cellSize / 6.5,
                opacity: 0.6,
                fillShadow: true,
                strokeShadow: true
            });
            circle.setPosition(pos);
            canvas.add(circle);
            return circle;
        },
        drawName: function (name, color, pos) {
            var name = new fabric.Text(name, {
                fontSize: conf.cellSize * 0.47,
                fill: color,
                evented: false
            });
            var rect = new fabric.Rect({
                width: name.width + conf.strokeWidth * 2,
                height: name.height,
                fill: 'white',
                rx: conf.strokeWidth * 2,
                ry: conf.strokeWidth * 2
            });
            name.top += conf.strokeWidth;
            var group = new fabric.Group([rect, name], {
                originX: 'left',
                originY: 'left'
            });
            group.setPosition(pos);
            canvas.add(group);
        }
    };



    //red
    desk.fillCell(6, 8, '#E11E26');
    desk.fillCell(5, 8, '#DF696E');
    desk.fillCell(4, 8, '#E11E26');
    desk.fillCell(3, 8, '#DF696E');
    desk.fillCell(2, 8, '#E11E26');
    desk.fillCell(2, 7, '#E11E26');
    //green
    desk.fillCell(8, 6, '#63B345');
    desk.fillCell(8, 5, '#96CB81');
    desk.fillCell(8, 4, '#63B345');
    desk.fillCell(8, 3, '#96CB81');
    desk.fillCell(8, 2, '#63B345');
    desk.fillCell(9, 2, '#63B345');
    //yellow
    desk.fillCell(10, 8, '#FCCB08');
    desk.fillCell(11, 8, '#FDDC62');
    desk.fillCell(12, 8, '#FCCB08');
    desk.fillCell(13, 8, '#FDDC62');
    desk.fillCell(14, 8, '#FCCB08');
    desk.fillCell(14, 9, '#FCCB08');
    //blue
    desk.fillCell(8, 10, '#226FBA');
    desk.fillCell(8, 11, '#629CCE');
    desk.fillCell(8, 12, '#226FBA');
    desk.fillCell(8, 13, '#629CCE');
    desk.fillCell(8, 14, '#226FBA');
    desk.fillCell(7, 14, '#226FBA');

    desk.drawGrid();

    desk.drawPlayerArea(3.5, 3.5, '#E11E26');
    desk.drawPlayerArea(12.5, 3.5, '#63B345');
    desk.drawPlayerArea(12.5, 12.5, '#FCCB08');
    desk.drawPlayerArea(3.5, 12.5, '#226FBA');

    desk.drawBase();

    //hearts
    desk.drawPath(paths.hearts, {col: 7.05, row: 8, size: conf.gridSize * 0.75, fill: '#DF696E'});
    desk.drawPath(paths.hearts, {col: 2, row: 7, size: conf.gridSize / 2, fill: 'white'});
    desk.drawPath(paths.hearts, {col: 3.2, row: 3.5, size: conf.gridSize * 3.2, fill: '#DF696E'});
    //spades
    desk.drawPath(paths.spades, {col: 8, row: 7.15, size: conf.gridSize * 0.75, fill: '#96CB81'});
    desk.drawPath(paths.spades, {col: 9, row: 2, size: conf.gridSize / 2, fill: 'white'});
    desk.drawPath(paths.spades, {col: 12.5, row: 3.5, size: conf.gridSize * 3.2, fill: '#96CB81'});
    //diamonds
    desk.drawPath(paths.diamonds, {col: 8.85, row: 8, size: conf.gridSize * 0.75, fill: '#FDE585'});
    desk.drawPath(paths.diamonds, {col: 14, row: 9, size: conf.gridSize / 2, fill: 'white'});
    desk.drawPath(paths.diamonds, {col: 12.5, row: 12.5, size: conf.gridSize * 3.2, fill: '#FDE585'});
    //clubs
    desk.drawPath(paths.clubs, {col: 8, row: 8.85, size: conf.gridSize * 0.75, fill: '#A5CBEB'});
    desk.drawPath(paths.clubs, {col: 7, row: 14, size: conf.gridSize / 2, fill: 'white'});
    desk.drawPath(paths.clubs, {col: 3.5, row: 12.5, size: conf.gridSize * 3.2, fill: '#A5CBEB'});
    //arrows
    desk.drawPath(paths.arrow, {col: 6.5, row: 6.5, size: conf.cellSize * 1.3, angle: 90});
    desk.drawPath(paths.arrow, {col: 9.5, row: 6.5, size: conf.cellSize * 1.3, angle: 180});
    desk.drawPath(paths.arrow, {col: 9.5, row: 9.5, size: conf.cellSize * 1.3, angle: 270});
    desk.drawPath(paths.arrow, {col: 6.5, row: 9.5, size: conf.cellSize * 1.3, angle: 0});

    ludo = {
        route: {
            red: desk.getRoute('red'),
            green: desk.getRoute('green'),
            yellow: desk.getRoute('yellow'),
            blue: desk.getRoute('blue')
        },
        seat: 0,
        turn: 0,
        dice: 0,
        timer: 0,
        players: [],
        isTurn: function () {
            return this.turn === this.seat - 1;
        },
        checkMultiTokens: function (team) {
            var i = ['red', 'green', 'yellow', 'blue'].indexOf(team);
            var stacks = {};
            var tokens = this.players[i].tokens;
            tokens.forEach(function (token) {
                if (token.position === -1) return;
                if (token._animated) {
                    if (token.tokenNumber) {
                        canvas.remove(token.tokenNumber);
                        delete token.tokenNumber;
                    }
                    return;
                }
                if (Array.isArray(stacks[token.position])) {
                    stacks[token.position].push(token.id);
                }
                else {
                    stacks[token.position] = [token.id];
                }
            });
            for (var n in stacks) {
                var stack = stacks[n];
                var tokenNumber = Object.keys(stack).length;
                var token = tokens[stack[stack.length - 1]];
                if (tokenNumber < 2) {
                    if (token.tokenNumber) {
                        canvas.remove(token.tokenNumber);
                        delete token.tokenNumber;
                    }
                    continue;
                }
                //if (tokenNumber >= 2) {
                    if (token.tokenNumber) {
                        token.tokenNumber.set('text', String(tokenNumber));
                        token.tokenNumber.setPosition(ludo.route[token.team][token.position]);
                        token.tokenNumber.set({
                            top: token.tokenNumber.top + conf.strokeWidth * 0.8
                        });
                        token.tokenNumber.bringToFront();
                    }
                    else {
                        token.tokenNumber = new fabric.Text(String(tokenNumber), {
                            fontSize: conf.cellSize * 0.47,
                            fill: 'white',
                            evented: false
                        });
                        token.tokenNumber.setPosition(ludo.route[token.team][token.position]);
                        token.tokenNumber.set({
                            top: token.tokenNumber.top + conf.strokeWidth * 0.8
                        });
                        canvas.add(token.tokenNumber);
                        //token.tokenNumber.bringToFront();
                    }
                //}
                //canvas.bringToFront(token.tokenNumber);
                canvas.renderAll();
            }
        },
        select: function(obj) {
            if (!this.isTurn()) return;
            if (obj && obj._animated) return;
            if (obj.position === 56) return;
            if (this.players[this.seat - 1].team !== obj.team) {
                return;
            }
            this.deselectAll();
            if (this.dice.value) {
                if (obj.position !== -1) {
                    var targetPosition = obj.position;
                    var mod = 1;
                    for (var i = 1; i <= this.dice.value; i++) {
                        if (targetPosition >= 56) mod = -1;
                        targetPosition += mod;
                    }
                    obj.moveTarget.setPosition(ludo.route[obj.team][targetPosition]);
                    canvas.add(obj.moveTarget);
                    obj.moveTarget.isAnimated = true;
                    obj.moveTarget.runAnimation(obj.moveTarget);
                }
                else if (obj.position === -1 && this.dice.value === 6) {
                    obj.moveTarget.setPosition(ludo.route[obj.team][0]);
                    canvas.add(obj.moveTarget);
                    obj.moveTarget.isAnimated = true;
                    obj.moveTarget.runAnimation(obj.moveTarget);
                }
            }
            obj.set({
                stroke: 'black',
                isSelected: true
                //strokeWidth: conf.strokeWidth
            });
        },
        getSelected: function () {
            var thisPlayer = this.players[this.seat - 1];
            if (!thisPlayer) return;
            for (var i = 0; i < 4; i++) {
                var token = thisPlayer.tokens[i];
                if (token.isSelected) return token;
            }
        },
        deselectAll: function () {
            var token = this.getSelected();
            if (!(token && token.type === 'token')) return;
            canvas.remove(token.moveTarget);
            token.moveTarget.isAnimated = false;
            token.set({
                stroke: token._color,
                isSelected: false
            });
        },
        Player: function (player) {
            var teams = ['red', 'green', 'yellow', 'blue'];
            this.name = player.name;
            this.team = teams[player.seat - 1];
            this.seat = player.seat;
            var tokens = [];
            var t = desk.tokens[this.team];
            var n = desk.names[this.team];
            desk.drawName(player.name, n.color, n.position);
            for (var i = 0; i < 4; i++) {
                var pos = player.tokens[i];
                var token = pos < 0
                    ? desk.drawToken(this.team, t.positions[i])
                    : desk.drawToken(this.team, ludo.route[this.team][pos]);
                token.id = i;
                token.position = pos;
                tokens.push(token);
            }
            this.tokens = tokens;
        },
        addPlayer: function (player) {
            this.players[player.seat - 1] = new this.Player(player);
            ludo.checkMultiTokens(player.team);
        },
        //updateDice: function (turn, animate) {
        //    desk.drawDice(this.dice, desk.positions.dice[turn], animate);
        //},
        updateTimer: function (turn, timeLeft) {
            desk.drawTimer({
                turn: turn,
                time: this.timer * 1000,
                timeLeft: timeLeft,
                pos: desk.positions.timer[turn]
            });
        }
    };

    function mainFunc(backgroundImg) {
        delete desk.dataURL;
        backgroundImg.set({
            originX: 'left',
            originY: 'top'
        });
        canvas.add(backgroundImg);

        canvas.on({
            'mouse:down': function (e) {
                var obj = e.target;
                if (!ludo.isTurn()) return;
                switch (obj.type) {
                    case 'dice':
                        if (ludo.dice.value === 0) {
                            socket.emit('roll dice');
                            ludo.deselectAll();
                        }
                        break;
                    case 'token':
                        if (obj.isSelected)
                            ludo.deselectAll();
                        else
                            ludo.select(obj);
                        break;
                    case 'target':
                        var token = ludo.getSelected();
                        socket.emit('move token', token.id);
                        ludo.deselectAll();
                }
                canvas.renderAll();
            }
        });
        canvas.renderAll();
        console.timeEnd('load time');

        window.onkeydown = function(e) {
            if (e.keyCode === 27) {
                ludo.deselectAll();
            }
            if (e.keyCode === 32) {
                if (ludo.isTurn() && ludo.dice.value === 0) {
                    socket.emit('roll dice');
                    ludo.deselectAll();
                }
                if (conf.dev) {
                    console.log(canvas._objects.length);
                }
            }
        };
        socket.emit('get game data');
        socket.on('game data', function (data) {
            ludo.seat = data.seat;
            ludo.turn = data.turn;
            data.players.forEach(function (player) {
                if (player) {
                    ludo.addPlayer(player);
                }
            });
            ludo.dice = desk.drawDice(data.dice, data.turn);
            if (ludo.dice.value === 0 && !ludo.isTurn()) {
                canvas.remove(ludo.dice);
            }
            ludo.timer = data.timer;
            ludo.updateTimer(data.turn, data.timeLeft);
            canvas.renderAll();
            if (ludo.isTurn()) {
                sounds.turn.play();
            }
        });
        socket.on('next turn', function (turn) {
            ludo.turn = turn;
            canvas.remove(ludo.dice);
            if (ludo.isTurn()) {
                sounds.turn.play();
                ludo.dice = desk.drawDice(0, turn);
            }
            ludo.updateTimer(turn);
            ludo.deselectAll();

            canvas.renderAll();
        });
        socket.on('dice', function (data) {
            if (!ludo.isTurn()) {
                ludo.dice = desk.drawDice(data.dice, data.turn);
            }
            sounds.dice.play();
            ludo.dice.roll(data.dice);
        });
        socket.on('token moved', function (data) {
            var token = ludo.players[data.seat - 1].tokens[data.id];
            var i = 0;
            var step = 1;
            var steps = (token.position === -1 && data.dice === 6) ? 1 : data.dice;
            var interval = setInterval(function () {
                token._animated = true;
                ludo.checkMultiTokens(token.team);
                i++;
                if (token.position >= ludo.route[token.team].length - 1)
                    step = -1;
                token.position += step;
                token.bringToFront();
                token.animatePosition(ludo.route[token.team][token.position]);
                if (i >= steps) {
                    clearInterval(interval);
                    setTimeout(function () {
                        if (data.extra) {
                            var token1 = ludo.players[data.extra.seat - 1].tokens[data.extra.id];
                            token1.position = -1;
                            token1.animatePosition(desk.tokens[token1.team].positions[data.extra.id]);
                        }
                    }, 500);
                }
            }, 500);
        });
    }


    desk.dataURL = canvas.toDataURL();
    canvas.clear();
    fabric.Image.fromURL(desk.dataURL, mainFunc);

});