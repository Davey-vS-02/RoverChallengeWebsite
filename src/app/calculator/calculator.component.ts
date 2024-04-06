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

  roverList: Rover[] = [];

  ngOnInit()
  {
    //Set overflow to default.
    document.body.style.overflow = '';
  }

  
// Function to generate rover objects based on user input
  generateRovers() {
    const roverCountInput = document.getElementById("roverCount") as HTMLInputElement;
    const roverCount = parseInt(roverCountInput.value);

    const rovers = [];
    for (let i = 1; i <= roverCount; i++) {
      const rover = new Rover(`Rover${i}`, 0, 0, ""); // Default parameters
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
    const roverList = this.generateRovers();
    console.log(roverList);

    // Iterate through rover objects and populate the table
    roverList.forEach(rover => {
    const row = tableBody.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);

    //Populate cells with rover parameters.
    cell1.textContent = rover.id;

    //Add input for starting x coordinates and set it to the starting x coordinates.
    const xCoordinatesInput = document.createElement('input');
    xCoordinatesInput.type = 'text';
    xCoordinatesInput.value = rover.xCoordinates.toString();

    //Add input for starting y coordinates and set it to the starting y coordinates.
    const yCoordinatesInput = document.createElement('input');
    yCoordinatesInput.type = 'text';
    yCoordinatesInput.value = rover.yCoordinates.toString();

    // Add event listener for x coordinate input validation and handling.
    xCoordinatesInput.addEventListener('input', (event: Event) => 
    {
      //Add imput management.
    });

    // Add event listener for y coordinate input validation and handling.
    yCoordinatesInput.addEventListener('input', (event: Event) => 
    {
      //Add imput management.
    });

    cell2.appendChild(xCoordinatesInput);
    cell3.appendChild(yCoordinatesInput);

    //Add input for instructions and set it to the starting coordinates.
    const instructionsInput = document.createElement('input');
    instructionsInput.type = 'text';

      // Add event listener for input validation
      instructionsInput.addEventListener('keydown', event => {
      // Restricting characters other than N, E, S, W, n, e, s, w
      if (!/[NESWnesw]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete') {
          event.preventDefault();
      }
      });

    cell4.appendChild(instructionsInput);
    
    });
    console.log('Table created.');
  }

  moveRovers(): void {
    if(this.roverList.length > 0)
      {
        console.log('Rovers moved.');
      }
      else
      {
        console.log('No rovers.');
      }
  }
}
