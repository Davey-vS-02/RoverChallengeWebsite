import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Rover } from './rover.model';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent {

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
      const rover = new Rover(`Rover${i}`, [0,0], "N"); // Default parameters
      rovers.push(rover);
    }

    console.log(rovers);
    return rovers;
  }

  populateTable()
  {
    console.log('Imagenary table created.')
  }

  moveRovers(instructions: string): void {
    // Your logic to move the rovers according to instructions
  }

  displayRovers(): void {
    // Your logic to display rovers in the UI
  }

}
