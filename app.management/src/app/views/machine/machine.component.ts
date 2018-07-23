import { Component } from '@angular/core';
import { BeanchainService, Transaction } from '../../services/beanchain.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.css']
})
export class MachineComponent {

  today: number = Date.now();
  colorScheme = {
    domain: ['#3f51b5']
  };

  transactions: any[];
  machine: any;

  history: Transaction[];

  constructor(private service: BeanchainService, private route: ActivatedRoute) {
    route.params.subscribe(params => {
      this.loadData(params.id);
    });
  }

  loadData(machineId) {
    const tmpHistory = new Array<Transaction>();

    this.service.get().subscribe(manager => {
      this.machine = manager.machines.find(m => m.id === machineId);


      this.service.getTransactions().subscribe(ts => {
        const dictTransactions = {};

        for (const t of ts) {
          if (t.machine !== machineId) {
            continue;
          }

          const d = new Date(t.date);
          const d2 = d.getDate();

          if (!dictTransactions[d2]) {
            dictTransactions[d2] = [];
          }

          dictTransactions[d2].push(t);

          tmpHistory.push(t);
        }


        const day = new Date().getDate();

        const transactions = [];
        for (let i = 1; i <= day; i++) {
          transactions.push({
            name: i.toString(),
            value: dictTransactions[i] ? dictTransactions[i].length : 0
          });
        }

        tmpHistory.sort((a, b) => {
          return a.date - b.date;
        });

        this.transactions = transactions;
        this.history = tmpHistory;
      });
    });
  }

}
