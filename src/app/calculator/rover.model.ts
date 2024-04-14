import { error } from "console";
import { CalculatorComponent } from "./calculator.component";

export class Rover 
{

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
  move(roverInstruction: string, alertCallback: () => void): string[] 
  {
    //Create array to store each rovers coordinates as it moves.
    let roverCoordinates: string[] = new Array(); 

    //For debugging.
    console.log(this.id + ' instructions: ' + roverInstruction);

    //Iterate through each character of the instructions string and update x and y coordinates.
    for(let i = 0; i < this.instructions.length; i++)
    {
      //Ensure characters are uppercase.
      roverInstruction = roverInstruction.toUpperCase();

      //Move rover.
      this.xCoordinates += +(roverInstruction[i] === 'E') - +(roverInstruction[i] === 'W');
      this.yCoordinates += +(roverInstruction[i] === 'N') - +(roverInstruction[i] === 'S');

      //Check if any rovers move off the desired grid.
      if(this.xCoordinates < 0 || this.yCoordinates < 0)
      {
        alert("A rover has drifted off the grid. Rovers reset. Please verify rover inputs. ");
        alertCallback();
        break;
      }
      //Add coordinate to rover path coordinate list.
      roverCoordinates.push('(' + this.xCoordinates + ',' + this.yCoordinates + ')');
    }
    
    console.log("Move functions array:" + roverCoordinates);
    return roverCoordinates || "";
  }
}
