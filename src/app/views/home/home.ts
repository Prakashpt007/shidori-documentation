import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Highlight } from 'ngx-highlightjs';

@Component({
  selector: 'app-home',
  imports: [MatTabsModule, Highlight],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  lotsOfTabs = new Array(30).fill(0).map((_, index) => `Tab ${index}`);


  sliderCode = `type SliderItem = {
    title: string;
    image: string;
    cuisines: string;
    rating: string;
    price: string;
    area: string;
    distance: string;
  };`;
}
