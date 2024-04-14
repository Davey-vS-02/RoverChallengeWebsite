import { Component } from '@angular/core';
import { RouterEvent, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Rover } from './rover.model';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { addListener } from 'process';

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
  collectiveCoordinatesList = new Array();
  //Initialize current rover's coordinates list.
  allRoverPaths: any[] = [];
  //Initialize collisions list.
  intersectionsList = new Set();
  
  //Starting coordinates of each rover.
  xStartingCoordinates: any = [];
  yStartingCoordinates: any = [];

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

  //Function to generate rover objects based on user input. Is called from populateTable function.
  generateRovers() 
  {
    //Upon generation of new rovers. Any old svg graphics created for the rover grid need to be cleared.
    this.ClearSVG();

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

  //Function to create an populate rover table. Is called upon pressing "Generate rovers" button.
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
      instructionsInput.id = 'instructions' + i;
      instructionsInput.addEventListener('input', (event: Event) => 
      {
        rover.instructions = (event.target as HTMLInputElement).value || '';
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

  //Function to move rovers according to provided instructions. Is called upon pressing "Move rovers" button.
  moveRovers(): void 
  {
    //Rover drifted off grid flag.
    let roverHasDrifted = false;

    //Check if rovers are created.
    if(this.roverList.length < 1)
    {
      alert('No rovers generated.');
      return;
    }
    //Iterate through each rover and move them. Add all coordinates to a list and check for duplicates.
    //These duplicates will reflect all coordinates on which these paths intersected.
    //To avoid rover intersections from being detected when a rover drives over it's own path, I need to implements some code.
    else
    {
      let i = 1;
      //Delete all contents of array.
      this.allRoverPaths = [];

      //Iterate through each rover and move rover according to giver instructions.
      this.roverList.forEach(rover => 
      {

        console.log('Rover x-coordinate that will be set to starting: ' + rover.xCoordinates);
        console.log('Rover y-coordinate that will be set to starting: ' + rover.yCoordinates);

        //Reset starting coordinate lists.
        this.xStartingCoordinates = [];
        this.yStartingCoordinates = [];

        //Add rover starting coordinates.
        this.xStartingCoordinates.push(rover.xCoordinates as number);
        this.yStartingCoordinates.push(rover.yCoordinates as number);

        console.log('Rover starting x-coordinate list: ' + this.xStartingCoordinates);
        console.log('Rover starting y-coordinate list: ' + this.yStartingCoordinates);

        //Call move method in rover class and add all updated coordinates to coordinates list.
        //Handle when a rover drifts off the desired grid.
        let currentRoverCoordinates = rover.move(rover.instructions);
        console.log('CurrentRoverCoordinates: ' + currentRoverCoordinates);

        // if(currentRoverCoordinates instanceof Error)
        // {
        //   alert(currentRoverCoordinates.message);
        //   //Reset rovers.
        //   this.roverList.forEach(rover =>
        //     {
        //       rover.xCoordinates = 0;
        //       rover.yCoordinates = 0;
        //       rover.instructions = "";
        //     }
        //   );
        //   //Generate new rovers.
        //   this.populateTable();
        //   roverHasDrifted = true;
        //   return;
        // }

        this.allRoverPaths.push(currentRoverCoordinates);

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
    
    //Check for any drifted rovers. If there are, return from function and don't execute the rest of the code.
    if(roverHasDrifted)
    {
      return;
    }

    console.log(this.allRoverPaths);

    //Check for duplicates.
    this.intersectionsList = this.findDuplicates(this.allRoverPaths);
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
    
    //Upon moving of rovers, the SVG graphic will be created for the rover grid.
    this.createRoverSVG();
  }
 
  //Used to find intersection points of rovers. Checks for duplicates in rover paths.
  findDuplicates(coordinateList: any[]) 
  {
    let intersections = new Set();
    const uniqueElements = new Set();

    //Interate through each coordinate and compare it with a set that has all the unique elements stored.
    //If a coordinate is found in the unique elements set it will be seen as a duplicate and added to the duplicates set.
    //Else it will be added to the unique coordinates set so future coordinates can use it to cross reference.
    coordinateList.forEach(currentRoverCoordinateSet => 
    {
      currentRoverCoordinateSet.forEach((coordinate: unknown) =>
        {
          //Iterate through other lists.
          if(uniqueElements.has(coordinate) || intersections.has(coordinate)) 
            {
              intersections.add(coordinate);
            } 
            else
            {
              uniqueElements.add(coordinate);
            }
        }
      );
    });

    return intersections || '';
  }

  //Generate rover grid view. This is the visual representation of the grid.
  createRoverSVG()
  {
    let randomColor = this.getRandomBrightColor();
    console.log("Create rovers SVG function is running.")

    //Lists that store the rover paths separately.
    let xCoordinateList: number[] = new Array();
    let yCoordinateList: number[] = new Array();

    //Split each coordinate string into separate parts to find max of each.
    this.allRoverPaths.forEach((currentRoverCoordinateSet: any) => 
    {      
      currentRoverCoordinateSet.forEach((coordinate: string) =>
        {
          if(typeof coordinate === 'string')
            {
              //Remove parantheses.
              coordinate = coordinate.replace(/[()]/g, '');
      
              //Explicitly convert to string.
              let coordinateStr: string = coordinate;
      
              //Split coordinate string.
              let splitCoordinate = coordinateStr.split(',');
      
              //Add all x and y coordinates of every rover to a list to find the max.
              xCoordinateList.push(parseInt(splitCoordinate[0]));
              yCoordinateList.push(parseInt(splitCoordinate[1]));
      
              console.log("xCoordinateList: " + xCoordinateList);
              console.log("yCoordinateList: " + yCoordinateList);
            }
        }
      );
    });

    //Unpack coordinate lists and find maximum coordinates.
    let xCoordinateMax = Math.max(...xCoordinateList) + 1 || 0;
    let yCoordinateMax = Math.max(...yCoordinateList) + 1 || 0;

    //Create rover grid according to max x and y values.
    //Clear SVG Grid.
    this.ClearSVG();

    //Get svg element.
    let svg = document.getElementById('visual-representation-svg');

    //Check if svg is null (Even though it won't ever be, seeing the element is a static element in the html file.)
    if(svg)
    {
      //Set height and width of svg.
      svg.setAttribute('height', '430');
      svg.setAttribute('width', '430');

      //Create rect.
      let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute('x', `15`);
      rect.setAttribute('y', `15`);
      rect.setAttribute('width', '400');
      rect.setAttribute('height', '400');
      rect.setAttribute('stroke', 'aliceblue')
      rect.setAttribute('fill', 'none')
      rect.setAttribute('stroke-width', '2')
      svg?.appendChild(rect);

      //Create lines depending on max rover coordinates.
      //Find step size of every line in grid of 400w and 400h.
      //Check if max coordinates are 0. If it is, return the step as 0. Otherwise you divide by 0.
      let xCoordinateStep = xCoordinateMax !== 0 ? 400 / xCoordinateMax : 1;
      let yCoordinateStep = yCoordinateMax !== 0 ? 400 / yCoordinateMax : 1;
      let currentXCoordinateStep = xCoordinateStep;
      let currentYCoordinateStep = yCoordinateStep;

      //Create horisontal lines for every step.
      for(let i = yCoordinateMax; i>0; i--)
      {
        let xLine = document.createElementNS("http://www.w3.org/2000/svg", "line")
        xLine.setAttribute('stroke', 'aliceblue');
        xLine.setAttribute('stroke-width', '2');
        xLine.setAttribute('x1', '15');
        xLine.setAttribute('x2', '415');
        xLine.setAttribute('y1', (currentYCoordinateStep + 15).toString());
        xLine.setAttribute('y2', (currentYCoordinateStep + 15).toString());
        svg.appendChild(xLine);
        //Add one step.
        currentYCoordinateStep = currentYCoordinateStep + yCoordinateStep;
      }

      //Create vertical lines for every step.  
      for(let i = xCoordinateStep; i>0; i--)
      {
        let yLine = document.createElementNS("http://www.w3.org/2000/svg", "line")
        yLine.setAttribute('stroke', 'aliceblue');
        yLine.setAttribute('stroke-width', '2');
        yLine.setAttribute('x1', (currentXCoordinateStep + 15).toString());
        yLine.setAttribute('x2', (currentXCoordinateStep + 15).toString());
        yLine.setAttribute('y1', '15');
        yLine.setAttribute('y2', '415');
        svg.appendChild(yLine);
        //Add one step.
        currentXCoordinateStep = currentXCoordinateStep + xCoordinateStep;
      }

      //Draw a line path for every rover.
      //Convert coordinates to grid steps.
      //Handle y coordinates accordingly. (SVG origin is at top left instead of bottom left.)
      //Draw lines and append children.

      //Lists that store the rover paths separately.
      let xIntersectionsList: number[] = new Array();
      let yIntersectionsList: number[] = new Array();

      //Draw every intersection point.
      this.intersectionsList.forEach(intersection => 
      {
        if(typeof intersection === 'string')
          {
            //Remove parantheses.
            intersection = intersection.replace(/[()]/g, '');
    
            //Explicitly convert to string.
            let intersectionStr: any = intersection;
    
            //Split coordinate string.
            let splitCoordinate = intersectionStr.split(',');
    
            //Add all x and y coordinates of every rover to a list to find the max.
            xIntersectionsList.push(parseInt(splitCoordinate[0]));
            yIntersectionsList.push(parseInt(splitCoordinate[1]));

            //Change position of intersection coordinate to svg coordinate.
            let x = splitCoordinate[0] * xCoordinateStep + 15;
            let y = 415 - (splitCoordinate[1] * yCoordinateStep);

            //Draw intersection points.
            let intersectionPoint = document.createElementNS("http://www.w3.org/2000/svg", "circle")
            intersectionPoint.setAttribute('cx', x.toString());
            intersectionPoint.setAttribute('cy', y.toString());
            intersectionPoint.setAttribute('r', "8");
            intersectionPoint.setAttribute('fill', randomColor);
            svg?.appendChild(intersectionPoint);
    
            console.log("xIntersectionsList: " + xIntersectionsList);
            console.log("yIntersectionsList: " + yIntersectionsList);
          }
      });


      //Draw starting coordinates.
      let roverNumber = 0;
      this.roverList.forEach(() => 
      {
        console.log('CreateX function has ran.')
        console.log('x-Starting coordinate: ' + this.xStartingCoordinates[roverNumber]);
        console.log('y-Starting coordinate: ' + this.yStartingCoordinates[roverNumber]);
        let startingCoordinate = this.createX(this.xStartingCoordinates[roverNumber] * xCoordinateStep + 15, 415 - this.yStartingCoordinates[roverNumber] * yCoordinateStep, 5, randomColor);
        svg?.appendChild(startingCoordinate);
        roverNumber++;
      });

    }
  }

  ClearSVG()
  {
    //Get svg element.
    let svg = document.getElementById('visual-representation-svg');

    //Clear svg children.
    while(svg?.firstChild)
    {
      svg.removeChild(svg.firstChild);
    }

    //Set width and height to 0.
    svg?.setAttribute('height', '0');
    svg?.setAttribute('width', '0');
  }

  getRandomBrightColor() 
  {
    // Generate random values for red, green, and blue components
    const red = Math.floor(Math.random() * 175) + 75; // Random value between 100 and 250
    const green = Math.floor(Math.random() * 175) + 75; // Random value between 100 and 250
    const blue = Math.floor(Math.random() * 175) + 75  ; // Random value between 100 and 250

    // Construct the color in hexadecimal format
    const color = '#' + red.toString(16) + green.toString(16) + blue.toString(16);

    return color;
  }
  //Create an svg path to represent an x.
  createX(cx: number, cy: number, strokeWidth: any, color: any) 
  {
    // Calculate the coordinates for the 'x' shape based on the center coordinates
    const x1 = cx - 10;
    const y1 = cy + 10;
    const x2 = cx + 10;
    const y2 = cy - 10;

    // Update the 'd' attribute of the path with the new coordinates
    const path = `M${x1} ${y1} ${x2} ${y2} M${x1} ${y2} ${x2} ${y1}`;
      
    const svgX = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svgX.setAttribute("d", path);
    svgX.setAttribute("stroke", color || "black");
    svgX.setAttribute("stroke-width", strokeWidth || "6");
    svgX.setAttribute("fill", "none");

    return svgX;
  }
}
