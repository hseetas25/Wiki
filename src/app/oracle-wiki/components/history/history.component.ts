import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {

  history: Array<any>;
  selectHist: any;

  ngOnInit(): void {
  }

  constructor() {
    this.history = JSON.parse(localStorage.getItem('history')||'[]');
    this.selectHist = '';
  }

  selectHistory(idx: any): void {
    this.selectHist =  this.history[idx].result;
    var domSearchElement = document.getElementById('selectHist');
      if(domSearchElement) {
        domSearchElement.className = 'search-card'
      }
      var domResultElement = document.getElementById('hist');
      if(domResultElement) {
        domResultElement.innerHTML = this.selectHist;
      }        
  }
}
