var desk;

window.addEventListener('load', function () {
    var tooltip = document.getElementById('ludo-tooltip');
    var canvas = new fabric.Canvas('ludo-canvas', {
        renderOnAddRemove: false,
        selection: false
    });

    var conf = {
        strokeWidth: canvas.width * 0.00375,
    };
    conf.gridSize = (canvas.width - conf.strokeWidth) / 15,
    conf.cellSize = conf.gridSize - conf.strokeWidth + 1;

    //fabric.Rect.prototype.strokeWidth = 0;
    //fabric.Group.prototype.hasControls = false;
    //fabric.Text.prototype.fontFamily = 'Arial';
    //fabric.Text.prototype.fontWeight = 'bold';
    fabric.Object.prototype.originX = 'center';
    fabric.Object.prototype.originY = 'center';
    fabric.Object.prototype.selectable = false;
    fabric.Circle.prototype.setEndAngle = function (angle) {
        this.endAngle = Math.PI / 180 * angle;
    };
    fabric.Object.prototype.savePosition = function () {
        this._savedPosition = {
            top: this.getTop(),
            left: this.getLeft()
        };
    };
    fabric.Object.prototype.restorePosition = function () {
        this.set({
            top: this._savedPosition.top,
            left: this._savedPosition.left
        });
        this.setCoords();
    };
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
    fabric.Object.prototype.setPosition = function (col, row) {
        this.set({
            left: (col - 0.5) * conf.gridSize + conf.strokeWidth / 2,
            top: (row - 0.5) * conf.gridSize + conf.strokeWidth / 2
        });
        this.setCoords();
    };

    desk = {
        fillCell: function (col, row, color) {
            var rect = new fabric.Rect({
                width: conf.cellSize,
                height: conf.cellSize,
                fill: color
            });
            rect.setPosition(col, row);
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

            var params = {
                x: rect.getFullWidth() / 2 + (col - 1) * conf.gridSize,
                y: rect.getFullWidth() / 2 + (row - 1) * conf.gridSize,
                size: rect.getFullWidth()
            };

            rect.set({
                left: params.x,
                top: params.y
            });
            canvas.add(rect);
            return params;
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
                        strokeWidth: !(i === 7 || i === 8) ? conf.strokeWidth * 1.5 : conf.strokeWidth,
                        selectable: false
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
                        strokeWidth: !(i === 7 || i === 8) ? conf.strokeWidth * 1.5 : conf.strokeWidth,
                        selectable: false
                    }
                ));
            }
        }
    };



    var circle = new fabric.Circle({
        stroke: 'red',
        strokeWidth: 3,
        radius: 2,
        fill: ''
    });
    circle.setPosition(5, 10);
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

    var redRect = desk.drawPlayerArea(1, 1, '#E11E26');
    var greenRect = desk.drawPlayerArea(10, 1, '#63B345');
    var yellowRect = desk.drawPlayerArea(10, 10, '#FCCB08');
    var blueRect = desk.drawPlayerArea(1, 10, '#226FBA');

    var spades = new fabric.Path(
        'M 110.56 19.37 C 126.70 6.46 147.71 1.54 168.00 0.86 C 188.87 0.45 210.41 1.82 229' +
        '.83 10.14 C 242.25 15.41 253.38 24.85 258.55 37.55 C 264.52 51.66 263.31 67.60 260.14 82.25 C 255.96 100.' +
        '09 246.32 115.99 236.15 131.01 C 234.72 132.74 234.78 134.96 235.42 137.00 C 237.76 137.15 240.07 136.57' +
        ' 241.54 134.61 C 250.93 124.63 263.46 117.51 277.11 115.59 C 288.43 113.97 300.61 113.48 311.20 118.52 C' +
        ' 324.08 124.23 333.20 136.20 338.14 149.12 C 345.02 166.49 346.06 185.55 345.01 204.03 C 342.83 228.85 3' +
        '33.62 253.95 315.43 271.51 C 303.35 283.66 286.25 291.31 268.95 290.06 C 249.40 288.45 231.38 278.86 216' +
        '.60 266.36 C 204.80 256.58 194.54 244.57 188.24 230.50 C 186.07 226.37 183.65 220.64 178.11 220.85 C 176.' +
        '94 222.71 175.79 224.70 176.06 227.00 C 175.76 250.11 180.28 273.40 189.64 294.56 C 194.93 306.37 201.95 ' +
        '317.69 211.87 326.17 C 214.43 328.42 217.79 329.71 219.99 332.38 C 221.42 334.81 219.23 337.48 216.84 338' +
        '.03 C 209.11 340.22 201.01 340.14 193.08 341.00 C 177.19 341.29 161.19 341.93 145.41 339.55 C 137.81 338.' +
        '25 129.92 336.78 123.41 332.39 C 123.37 327.60 128.52 327.35 131.78 325.72 C 140.63 321.54 146.18 312.85 ' +
        '150.29 304.32 C 158.10 287.25 161.38 268.57 163.53 250.05 C 164.38 240.06 165.36 230.04 164.83 220.01 C 1' +
        '64.76 218.62 163.88 217.48 163.34 216.25 C 159.00 214.38 155.63 218.27 154.00 221.82 C 148.50 233.10 141.' +
        '44 243.67 132.64 252.65 C 118.62 267.32 99.65 278.00 79.16 279.44 C 63.69 281.40 47.89 275.95 35.95 266.1' +
        '6 C 18.68 252.08 7.72 231.40 2.80 209.90 C 1.26 203.43 0.88 196.79 0.00 190.23 L 0.00 182.90 C 0.88 177.2' +
        '6 0.86 171.53 2.00 165.94 C 5.17 148.64 12.30 131.48 25.02 119.03 C 35.11 108.76 49.74 102.98 64.13 104.1' +
        '5 C 82.49 106.07 98.91 115.32 114.37 124.78 C 115.93 125.69 117.97 127.07 119.70 125.68 C 121.11 123.60 1' +
        '19.31 121.41 117.55 120.33 C 107.44 112.99 98.79 103.23 94.29 91.44 C 90.36 81.45 89.31 70.64 88.96 60.00' +
        ' C 89.25 44.03 98.20 29.09 110.56 19.37 Z',
        {
            left: blueRect.x,
            top: blueRect.y,
            fill: '#A5CBEB'
        }
    );
    spades.scaleToWidth(blueRect.size / 1.9);
    //spades.scaleToWidth(100);
    canvas.add(spades);

    var arrow = new fabric.Path(
        'M 0.01 0.01 C 4.41 1.08 7.75 4.46 11.92 6.11 C 16.27 8.48 21.30 9.37 25.45 12.09 C 22.51 13.53 19.35 14.5' +
        '8 16.04 14.32 C 29.03 28.56 41.73 43.06 54.65 57.37 C 58.92 61.41 62.57 66.05 66.57 70.36 C 76.92 82.54 87' +
        '.80 94.26 98.34 106.28 C 101.34 110.13 106.83 109.71 111.22 109.90 C 118.16 117.66 125.23 125.30 131.99 13' +
        '3.22 C 126.69 135.78 120.87 132.84 116.48 129.82 C 118.94 134.03 122.00 141.18 117.76 144.99 C 110.86 137.' +
        '59 104.20 129.97 97.47 122.41 C 97.55 118.13 98.47 113.10 95.76 109.41 C 82.62 94.51 69.06 79.97 55.77 65.' +
        '19 C 41.82 48.84 27.03 33.22 12.96 16.97 C 12.63 20.30 12.08 24.15 9.01 26.13 C 7.70 16.94 4.20 8.24 0.01 ' +
        '0.01 Z'
    );
    arrow.set({
        left: 6 * conf.gridSize + conf.strokeWidth / 2,
        top: 9 * conf.gridSize + conf.strokeWidth / 2
    });
    //spades.scaleToWidth(100);
    //circle.set({
    //    left: 6 * conf.gridSize + conf.strokeWidth / 2,
    //    top: 9 * conf.gridSize + conf.strokeWidth / 2
    //});
    //canvas.add(circle);
    arrow.scaleToWidth(conf.cellSize * 1.3);
    canvas.add(arrow);

    canvas.renderAll();
});