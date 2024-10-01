import { Component } from '@angular/core';
import { LeftProfileComponent } from "../left-profile/left-profile.component";
import { CenterProfileComponent } from "../center-profile/center-profile.component";
import { RightProfileComponent } from "../right-profile/right-profile.component";
import { RightHomeComponent } from "../../home/right-home/right-home.component";

@Component({
  selector: 'app-main-profile',
  standalone: true,
  imports: [LeftProfileComponent, CenterProfileComponent, RightProfileComponent, RightHomeComponent],
  templateUrl: './main-profile.component.html',
  styleUrl: './main-profile.component.css'
})
export class MainProfileComponent {

}
