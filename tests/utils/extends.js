Tinytest.add('utils - extends', function(test){
    test.equal(_.isFunction(__extends_class), true, "not found __extends_class");

    var Animal = (function () {
        function Animal(name) {
            this.name = name;
            this.moveM = 0;
        }
        Animal.prototype.move = function (meters) {
            this.moveM = meters;
        };
        return Animal;
    })();
    var Snake = (function (_super) {
        __extends_class(Snake, _super);
        function Snake(name) {
            _super.call(this, name);
        }
        Snake.prototype.move = function () {
            _super.prototype.move.call(this, 5);
        };
        return Snake;
    })(Animal);
    var Horse = (function (_super) {
        __extends_class(Horse, _super);
        function Horse(name) {
            _super.call(this, name);
        }
        Horse.prototype.move = function () {
            _super.prototype.move.call(this, 45);
        };
        return Horse;
    })(Animal);
    var sam = new Snake("Sammy the Python");
    var tom = new Horse("Tommy the Palomino");
    sam.move();
    tom.move(34);

    test.equal(sam.name, "Sammy the Python");
    test.equal(tom.name, "Tommy the Palomino");
    test.equal(sam.moveM, 5);
    test.equal(tom.moveM, 45);

});