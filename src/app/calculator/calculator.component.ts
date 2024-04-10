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
  //Initialize current rover's coordinates list.
  currentRoverPath = new Array();
  //Initialize collisions list.
  intersectionsList = new Set();

  // Define an interface for cell variables
  cell1!: HTMLElement;
  cell2!: HTMLElement;
  cell3!: HTMLElement;
  cell4!: HTMLElement;
  xCoordinatesInput!: HTMLInputElement;
  yCoordinatesInput!: HTMLInputElement;

  // Variables to store SVG dimensions
  svgWidth: number = 400;
  svgHeight: number = 400;
  

  //Upon component creation.
  ngOnInit()
  {
    //Set overflow to default (Because overflow of home-page needs to be hidden, but no other components thus far.)
    document.body.style.overflow = '';
  }

  // Function to generate rover objects based on user input
  generateRovers() 
  {

    //Clear all current collisions.
    const intersectionsParagraph = document.getElementById("intersections-paragraph")!.textContent = "Intersections: ";

    //Get rover count input and parse as an int.
    const roverCountInput = document.getElementById("roverCount") as HTMLInputElement;
    const roverCount = parseInt(roverCountInput.value);

    //Generate rovers.
    const rovers = [];
    for (let i = 1; i <= roverCount; i++) {
      const rover = new Rover(`Rover ${i}`, 0, 0, ""); // Default parameters plus customized id for each rover.
      //Add rovers to rovers list.
      rovers.push(rover);
    }
    return rovers;
  }

  populateTable()
  {
    //Get table body element.
    const tableBody = document.getElementById('table-body') as HTMLTableSectionElement;

    // Clear existing table rows
    tableBody.innerHTML = "";
  
    // Generate rover objects based on user input
    this.roverList = this.generateRovers();

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

      // Add event listener for input validation for x-coordinate.
      this.xCoordinatesInput.addEventListener('keydown', event => 
      {
        // Restrict characters other than 0-9.
        if (!/[0123456789]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete') 
        {
            event.preventDefault();
        }
      });
      this.cell2.appendChild(this.xCoordinatesInput);

      // Add event listener for input validation for y-coordinate.
      this.yCoordinatesInput.addEventListener('keydown', event => 
      {
        // Restrict characters other than 0-9.
        if (!/[0123456789]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete') 
        {
            event.preventDefault();
        }
      });

      //Increment i.
      i++;
    });
    console.log('Rover table created.');
  }

  moveRovers(): void 
  {
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

        //Set value of x-coordinate input value equal to x-coordinate rover parameter.
        const xInputElement = document.getElementById('x-rover-' + i) as HTMLInputElement;
        if(xInputElement) 
        {
          xInputElement.value = rover.xCoordinates.toString();
        }

        //Set value of y-coordinate input value equal to y-coordinate rover parameter.
        const yInputElement = document.getElementById('y-rover-' + i) as HTMLInputElement;
        if(yInputElement) 
        {
          yInputElement.value = rover.yCoordinates.toString();
        }

        //Increment rover id.
        i++;
      });
    }

    console.log('All coordinate paths: ' + this.coordinatesList);

    //Check for duplicates.
    this.intersectionsList = this.findDuplicates(this.coordinatesList);
    console.log('Intersections: ' + new Array(...this.intersectionsList).join(' '));

    //Change intersection paragraph text element to dynamically display collisions.
    if(this.intersectionsList.size > 0)
    {
      document.getElementById("intersections-paragraph")!.textContent = "Intersections: " + new Array(...this.intersectionsList).join(' ');
    }
    else
    {
      document.getElementById("intersections-paragraph")!.textContent = "Intersections: None";
    }
    
  }

  findDuplicates(coordinateList: any[]) 
  {
    let intersections = new Set();
    const uniqueElements = new Set();

    //Interate through each coordinate and compare it with a set that has all the unique elements stored.
    //If a coordinate is found in the unique elements set it will be seen as a duplicate and added to the duplicates set.
    //Else it will be added to the unique coordinates set so future coordinates can use it to cross reference.
    coordinateList.forEach(coordinate => 
    {
      if(uniqueElements.has(coordinate) || intersections.has(coordinate)) 
      {
        intersections.add(coordinate);
      } 
      else
      {
        uniqueElements.add(coordinate);
      }
    });

    return intersections;
  }
}
