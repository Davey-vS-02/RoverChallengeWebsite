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
      const rover = new Rover(`Rover${i}`, [0,0], ""); // Default parameters
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

    //Populate cells with rover parameters.
    cell1.textContent = rover.id;
    cell2.textContent = rover.startingCoordinates.join(', ');
    cell3.textContent = rover.direction;
    
  });
    console.log('Table created.');
  }

  moveRovers(instructions: string): void {
    // Your logic to move the rovers according to instructions
  }
}
