export class Car {
  #brand;
  #model;
  speed = 0;
  isTrunkOpen;

  constructor(carDetails) {
    this.#brand = carDetails.brand;
    this.#model = carDetails.model;
    this.speed = carDetails.speed ?? 0;
  }

  displayInfo() {
    console.log(`${this.#brand} ${this.#model} Speed: ${this.speed}km/h`);
  }

  go() {
    this.speed += 5;
    if (this.speed > 200) {
      this.speed = 200;
    }
  }

  brake() {
    this.speed -= 5;
    if (this.speed < 0) {
      this.speed = 0;
    }
  }

  openTrunk() {
    if (this.isTrunkOpen === undefined && this.speed === 0) {
      this.isTrunkOpen === true;
      console.log('Багажник открыт!');
    } else if(this.speed !== 0) {
      console.log('Остановите автомобиль если хотите открыть багажник.')
    }
  }

  closeTrunk() {
    if (this.isTrunkOpen === true || this.isTrunkOpen === undefined) {
      this.isTrunkOpen === false;
      console.log('Багажник закрыт!');
    }
  }
};

export class RaceCar extends Car {
  acceleration;

  constructor(carDetails) {
    super(carDetails);
    this.acceleration = carDetails.acceleration;
  }

  go() {
    this.speed += this.acceleration;
    if (this.speed > 300) {
      this.speed = 300;
    }
  }

  openTrunk() {
    console.log('У этой гоночной машины нет багажника...');
  }

  closeTrunk() {
    console.log('У этой гоночной машины нет багажника...');
  }
}

const car1 = new Car ({
  brand: 'Toyota',
  model: 'Corolla',
});

const car2 = new Car ({
  brand: 'Tesla',
  model: 'Model 3',
});

const raceCar3 = new RaceCar ({
  brand: 'McLaren',
  model: 'F1',
  acceleration: 20,
})
car1.go();
car2.go();
raceCar3.go();
raceCar3.go();
raceCar3.openTrunk();
car1.brake();
car1.openTrunk();
console.log(car1, car2);
car1.displayInfo();
car2.displayInfo();
raceCar3.displayInfo();