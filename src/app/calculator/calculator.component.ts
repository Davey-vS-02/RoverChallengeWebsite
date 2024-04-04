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

  rovers: Rover[] = [];

  addRover(startX: number, startY: number, directions: string): void {
    // Your logic to add a rover to the rovers array
  }

  moveRovers(instructions: string): void {
    // Your logic to move the rovers according to instructions
  }

  displayRovers(): void {
    // Your logic to display rovers in the UI
  }

}
