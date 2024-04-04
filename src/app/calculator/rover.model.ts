export class Rover {

    //Parameters for rover objects.
    id: string;
    coordinateX: number;
    coordinateY: number;
    direction: string;
    
    //Constructor for rover objects.
    constructor(id: string, coordinateX: number, coordinateY: number, direction: string) {
      this.id = id;
      this.coordinateX = coordinateX;
      this.coordinateY = coordinateY;
      this.direction = direction;
    }
  
    //Function to move the rover with each instruction, optimized with branchless coding instead of using a switch statement.
    //With branchless coding, the conditionals are converted to 0 for false and 1 for true.
    //This value is then added to the rover's current coordinate.
    move(instruction: string): void {
      this.coordinateY = +(instruction === 'E') - +(instruction === 'W');
      this.coordinateY = +(instruction === 'N') - +(instruction === 'S');
    }
  }
  