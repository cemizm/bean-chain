import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  today: number = Date.now();
  colorScheme = {
    domain: ['#3f51b5']
  };

  transactions: any[];

  machines: any[];

  constructor() {
    const day = new Date().getDate();
    const transactions = [];
    for (let i = 1; i <= day; i++) {
      transactions.push({
        name: i.toString(),
        value: Math.random() * 100
      });
    }
    this.transactions = transactions;

    const machines = [];

    for (let i = 1; i < 12; i++) {
      const data = [];
      for (let j = 1; j <= day; j++) {
        data.push({
          name: j.toString(),
          value: Math.random() * 10
        });
      }

      machines.push({
        name: `Machine ${i}`,
        type: 'Coffe Machine',
        data: data
      });
    }

    this.machines = machines;
  }

  ngOnInit() {

  }

  onSelect(machine) {
    console.log(machine);
  }
}
