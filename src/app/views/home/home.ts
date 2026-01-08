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
}
