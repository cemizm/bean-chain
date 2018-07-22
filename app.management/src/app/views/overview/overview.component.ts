import { Component, OnInit } from '@angular/core';
import { BeanchainService } from '../../services/beanchain.service';

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

  constructor(private service: BeanchainService) { }

  ngOnInit() {

    this.service.get().subscribe(manager => {
      const dictMachines = {};

      for (const m of manager.machines) {
        dictMachines[m.id] = m;
        dictMachines[m.id].transactions = {};
      }

      this.service.getTransactions().subscribe(ts => {
        const dictTransactions = {};

        for (const t of ts) {
          const d = new Date(t.date);
          const d2 = d.getDate();

          if (!dictTransactions[d2]) {
            dictTransactions[d2] = [];
          }

          dictTransactions[d2].push(t);

          if (dictMachines[t.machine]) {
            if (!dictMachines[t.machine].transactions[d2]) {
              dictMachines[t.machine].transactions[d2] = [];
            }

            dictMachines[t.machine].transactions[d2].push(t);
          }
        }


        const day = new Date().getDate();

        const transactions = [];
        for (let i = 1; i <= day; i++) {
          transactions.push({
            name: i.toString(),
            value: dictTransactions[i] ? dictTransactions[i].length : 0
          });
        }

        this.transactions = transactions;

        const machines = [];
        for (const key in dictMachines) {
          if (dictMachines.hasOwnProperty[key]) {
            continue;
          }

          const m = dictMachines[key];
          const data = [];
          for (let i = 1; i <= day; i++) {
            data.push({
              name: i.toString(),
              value: m.transactions[i] ? m.transactions[i].length : 0
            });
          }

          machines.push({
            name: m.name,
            type: m.location,
            data: data
          });
        }

        this.machines = machines;

      });
    });
  }

  onSelect(machine) {
    console.log(machine);
  }
}
