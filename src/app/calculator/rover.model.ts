export class Rover {

    //Parameters for rover objects.
    id: string;
    xCoordinates: number;
    yCoordinates: number;
    instructions: string;
    
    //Constructor for rover objects.
    constructor(id: string, xCoordinates: number,  yCoordinates: number, instructions: string) {
      this.id = id;
      this.xCoordinates = xCoordinates;
      this.yCoordinates = yCoordinates;
      this.instructions = instructions;
    }
  
    //Function to move the rover with each instruction, optimized with branchless coding instead of using a switch statement.
    //With branchless coding, the conditionals are converted to 0 for false and 1 for true.
    //This value is then added to the rover's current coordinate.
    move(roverInstruction: string): void {
      //For debugging.
      console.log('Rover instructions:' + roverInstruction);
      console.log('Instructions string length: ' + roverInstruction.length)
      for(let i = 0; i < this.instructions.length; i++)
        {
          //Ensure characters are uppercase.
          roverInstruction.toUpperCase();
          //Move rover.
          this.xCoordinates += +(roverInstruction[i] === 'E') - +(roverInstruction[i] === 'W');
          this.yCoordinates += +(roverInstruction[i] === 'N') - +(roverInstruction[i] === 'S');
        }
    }
  }
  