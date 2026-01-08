import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Sidebar } from "../sidebar/sidebar";
import { TocComponent } from "./toc.component";

@Component({
  selector: 'app-main-container',
  standalone: true,
  imports: [Header, Footer, RouterModule, Sidebar, TocComponent],
  templateUrl: './main-container.html',
  styleUrl: './main-container.scss'
})
export class MainContainer {

}
