import { Component, OnInit } from '@angular/core';
import { BeanchainService } from './services/beanchain.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user: string;

  constructor(private service: BeanchainService) {
  }

  ngOnInit() {
    this.service.get().subscribe(manager => {
      this.user = manager.name;
    });
  }

}
