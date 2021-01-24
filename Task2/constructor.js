function Vehicle(_name, _year) {
  this.name = _name;
  this.year = _year;
}

Vehicle.prototype.getName = function() {
  return ("Модель: " + this.name);
};

Vehicle.prototype.getInfo = function() {
  console.log(`${this.getName()} Год выпуска: ${this.year}`);
};

function Car(_name, _year, ifSunRoof = false) {
  Vehicle.call(this, _name, _year);
}

Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;

Car.prototype.hasSunRoof = function() {
  let hasSunRoof = ifSunRoof ? "В машине есть люк" : "В машине люка нет";
  return hasSunRoof;
}

Car.prototype.getInfo = function() {
  const maxSpeed = 160;
  const wheels = 4;

  function getMaxSpeed() {
    return (maxSpeed + " km/h");
  }
  
  console.log(`${this.getName()}
Год выпуска: ${this.year}
Колес: ${wheels}
Макс. скорость: ${getMaxSpeed()}`);
  };

function Moto(_name, _year) {
  Vehicle.call(this, _name, _year);
}

Moto.prototype = Object.create(Vehicle.prototype);
Moto.prototype.constructor = Moto;

function Driver(_name, _age) {
  this.name = _name;
  this.age = _age;

  this.displayInfo = function() {
    console.log(`Водитель: ${this.name}; возраст: ${this.age}`);
  };

  this.driveCar = function(car) {
    console.log(`${this.name} работает на ${car.name} ${car.year} года выпуска`);
  };
}

const audi = new Car("Audi A6", 2019, true);
const volvo = new Car("Volvo S60", 2017);
const yamaha = new Moto("Yamaha R250", 2020);

audi.getInfo();
volvo.getInfo();
yamaha.getInfo();

const driverVasya = new Driver("Василий", 31);
const driverDenis = new Driver("Денис", 48);

driverVasya.displayInfo();
driverDenis.displayInfo();
driverVasya.driveCar(yamaha);
driverDenis.driveCar(audi);

