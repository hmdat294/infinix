import { Component } from '@angular/core';
import { CenterHomeComponent } from '../center-home/center-home.component';
import { LeftHomeComponent } from '../left-home/left-home.component';
import { RightHomeComponent } from '../right-home/right-home.component';

@Component({
  selector: 'app-main-home',
  standalone: true,
  imports: [CenterHomeComponent, LeftHomeComponent, RightHomeComponent],
  templateUrl: './main-home.component.html',
  styleUrl: './main-home.component.css'
})
export class MainHomeComponent {

}
