import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Contact} from "../../models/contact.model";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent implements OnInit{
  ngOnInit(): void {

  }
}
