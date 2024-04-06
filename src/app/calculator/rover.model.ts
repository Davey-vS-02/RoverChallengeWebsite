export class Rover {

    //Parameters for rover objects.
    id: string;
    xCoordinates: number;
    yCoordinates: number;
    direction: string;
    
    //Constructor for rover objects.
    constructor(id: string, xCoordinates: number,  yCoordinates: number, direction: string) {
      this.id = id;
      this.xCoordinates = xCoordinates;
      this.yCoordinates = yCoordinates;
      this.direction = direction;
    }
  
    //Function to move the rover with each instruction, optimized with branchless coding instead of using a switch statement.
    //With branchless coding, the conditionals are converted to 0 for false and 1 for true.
    //This value is then added to the rover's current coordinate.
    move(instruction: string): void {
      this.xCoordinates = +(instruction === 'E') - +(instruction === 'W');
      this.yCoordinates = +(instruction === 'N') - +(instruction === 'S');
    }
  }
  