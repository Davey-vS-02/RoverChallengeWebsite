import { Component } from '@angular/core';
import { RouterEvent, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Rover } from './rover.model';
import { CommonModule, NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule, NgIf, NgFor],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent {

  //Variable that will store rover objects.
  roverList: Rover[] = [];
  //Initialize all coordinates list.
  coordinatesList = new Array();
  //Initialize collisions list.
  collisionsList = new Array();
  // Define an interface for cell variables
  cell1!: HTMLElement;
  cell2!: HTMLElement;
  cell3!: HTMLElement;
  cell4!: HTMLElement;
  xCoordinatesInput!: HTMLInputElement;
  yCoordinatesInput!: HTMLInputElement;
  

  //Upon component creation.
  ngOnInit()
  {
    //Set overflow to default (Because overflow of home-page needs to be hidden, but no other components thus far.)
    document.body.style.overflow = '';
  }

  // Function to generate rover objects based on user input
  generateRovers() 
  {
    const roverCountInput = document.getElementById("roverCount") as HTMLInputElement;
    const roverCount = parseInt(roverCountInput.value);

    const rovers = [];
    for (let i = 1; i <= roverCount; i++) {
      const rover = new Rover(`Rover ${i}`, 0, 0, ""); // Default parameters
      rovers.push(rover);
    }

    console.log(rovers);
    return rovers;
  }

  populateTable()
  {
    const tableBody = document.getElementById('table-body') as HTMLTableSectionElement;

    // Clear existing table rows
    tableBody.innerHTML = "";
  
    // Generate rover objects based on user input
    this.roverList = this.generateRovers();
    console.log(this.roverList);

    let i = 1;

    // Iterate through rover objects and populate the table
    this.roverList.forEach(rover => 
    {
      const row = tableBody.insertRow();
      this.cell1 = row.insertCell(0);
      this.cell2 = row.insertCell(1);
      this.cell3 = row.insertCell(2);
      this.cell4 = row.insertCell(3);

      //Populate cells with rover parameters.
      this.cell1.textContent = rover.id;

      //Add input for starting x coordinates and set it to the starting x coordinates.
      this.xCoordinatesInput = document.createElement('input');
      this.xCoordinatesInput.type = 'text';
      this.xCoordinatesInput.id = 'x-rover-' + i;
      this.xCoordinatesInput.value = rover.xCoordinates.toString();

      //Add input for starting y coordinates and set it to the starting y coordinates.
      this.yCoordinatesInput = document.createElement('input');
      this.yCoordinatesInput.type = 'text';
      this.yCoordinatesInput.id = 'y-rover-' + i;
      this.yCoordinatesInput.value = rover.yCoordinates.toString();

      // Add event listener for x coordinate input validation and handling.
      this.xCoordinatesInput.addEventListener('input', (event: Event) => 
      {
        rover.xCoordinates = Number((event.target as HTMLInputElement).value);
      });

      //Add input for y-coordinates and set it to the starting coordinates.
      this.yCoordinatesInput.addEventListener('input', (event: Event) => 
      {
        rover.yCoordinates = Number((event.target as HTMLInputElement).value);
      });

      this.cell2.appendChild(this.xCoordinatesInput);
      this.cell3.appendChild(this.yCoordinatesInput);

      //Add input for instructions and set rover parameter equal to it..
      const instructionsInput = document.createElement('input');
      instructionsInput.type = 'text';
      instructionsInput.addEventListener('input', (event: Event) => 
      {
        rover.instructions = (event.target as HTMLInputElement).value;
      });

      // Add event listener for input validation for instructions.
      instructionsInput.addEventListener('keydown', event => 
      {
        // Restrict characters other than N, E, S, W, n, e, s, w.
        if (!/[NESWnesw]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete') 
        {
            event.preventDefault();
        }
      });
      this.cell4.appendChild(instructionsInput);

      //Increment i.
      i++;
    });
    console.log('Table created.');
  }

  moveRovers(): void 
  {
    console.log(this.roverList);
    //Check if rovers are created.
    if(this.roverList.length < 1)
    {
      alert('No rovers generated.');
    }
    //Iterate through each rover and move them. Add all coordinates to a list and check for duplicates.
    //These duplicates will reflect all coordinates on which these paths intersected.
    //To avoid rover intersections from being detected when a rover drives over it's own path, I need to implements some code.
    else
    {
      let i = 1;
      //Delete all contents of array.
      this.coordinatesList = [];

      //Iterate through each rover and move rover according to giver instructions.
      this.roverList.forEach(rover => 
      {
        //Call move method in rover class and add all updated coordinates to coordinates list.
        //Using array1.push(...array2) we can concatenate the arrays without the need for creating a new array.
        this.coordinatesList.push(...rover.move(rover.instructions));

        //Set value of x-coordinate input equal to x-coordinate rover parameter.
        const xInputElement = document.getElementById('x-rover-' + i) as HTMLInputElement;
        if(xInputElement) 
        {
          xInputElement.value = rover.xCoordinates.toString();
        }
        console.log('X-Coordinate input: ' + this.xCoordinatesInput.value + '; X-Coordinate parameter: ' + rover.xCoordinates);

        //Set value of y-coordinate input equal to y-coordinate rover parameter.
        const yInputElement = document.getElementById('y-rover-' + i) as HTMLInputElement;
        if(yInputElement) 
        {
          yInputElement.value = rover.yCoordinates.toString();
        }
        console.log('Y-Coordinate input: ' + this.yCoordinatesInput.value + '; Y-Coordinate parameter: ' + rover.yCoordinates);

        //Increment rover id.
        i++;
      });
    }
    console.log(this.coordinatesList);

    //Check for duplicates.
    this.collisionsList = this.findDuplicates(this.coordinatesList);
    console.log('Collisions: ' + this.collisionsList);
  }

  findDuplicates(coordinateList: any[]) 
  {
    return coordinateList.filter((item, index) => coordinateList.indexOf(item) !== index);
  }
}
