import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Sidebar } from "../sidebar/sidebar";

@Component({
  selector: 'app-main-container',
  standalone: true,
  imports: [Header, Footer, RouterModule, Sidebar],
  templateUrl: './main-container.html',
  styleUrl: './main-container.scss'
})
export class MainContainer {

}
