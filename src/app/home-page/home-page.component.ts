import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})

export class HomePageComponent implements OnInit, OnDestroy {

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() 
  {
    console.log('ngOnInit is called');

    if(isPlatformBrowser(this.platformId))
    {
    //Check if application is currently running on a browser.
    console.log('Client-side code is running');

    //Set overflow to hidden.
    document.body.style.overflow = 'hidden';
    
    //Find current route.
    const currentRoute = this.route.snapshot;
    const currentURL = currentRoute.url.toString();
    console.log(currentURL);

    //Get list of all elements with parallax classes.
    const parallax_el = document.querySelectorAll(".parallax") as NodeListOf<HTMLElement>;
    const rotate_el = document.querySelectorAll(".rotated-parallax") as NodeListOf<HTMLElement>;

    //Set initial positions of elements in scene.
    parallax_el.forEach(el =>
      {
        el.style.transform = `translateX(calc(-50%)) translateY(calc(-50%))`;
        console.log('Parallax elements positions set.')
      }
    )
    rotate_el.forEach(el =>
      {
        el.style.transform = `translateX(calc(-50%) translateY(calc(-50%) rotate(90deg)`;
        console.log('Rotated elements positions set.')
      }
    )

    //Check if current route is the home-page.
    if (currentURL==='home-page') 
    {
      // Add mousemove event listener
      window.addEventListener("mousemove", this.handleMouseMove)

      console.log('Mousemove eventListener added.')
    }
    }
  }

  //Runs when the current component is destroyed (When a new route is called).
  ngOnDestroy() {
    //Problem seemed to fix itself after splitting mousemove event listerner into it's own function.
    //window.removeEventListener("mousemove", this.handleMouseMove)

    //Set oveflow to default.
    //document.body.style.overflow = '';
    console.log('Home-page component destroyed.')
  }

  //Mouse move listener for eventListener.
  handleMouseMove(e: MouseEvent)
  {
    //Initialize mouse position variables.
    let xValue = 0, yValue = 0;

    //Get list of all elements with parallax classes.
    const parallax_el = document.querySelectorAll(".parallax") as NodeListOf<HTMLElement>;
    const rotate_el = document.querySelectorAll(".rotated-parallax") as NodeListOf<HTMLElement>;

    //Find mouse positions.
    xValue = e.clientX - window.innerWidth / 2;
    yValue = e.clientY - window.innerHeight / 2;

    console.log(xValue, yValue);

    //Change translate-values of elements depending on the mouse position and parallax speed.
    parallax_el.forEach(el =>
    {
      let speedx = el.dataset['speedx'];
      let speedy = el.dataset['speedy'];
        el.style.transform = `translateX(calc(-50% + ${-xValue * (speedx as unknown as number)}px)) translateY(calc(-50% + ${yValue * (speedy as unknown as number)}px))`;
    })

    rotate_el.forEach(el =>
    {
      let speedx = el.dataset['speedx'];
      let speedy = el.dataset['speedy'];
        el.style.transform = `translateX(calc(-50% + ${-xValue * (speedx as unknown as number)}px)) translateY(calc(-50% + ${yValue * (speedy as unknown as number)}px)) rotate(90deg)`;
    })
  }
}