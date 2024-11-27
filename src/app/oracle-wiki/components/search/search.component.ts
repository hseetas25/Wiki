import { Component, OnInit } from '@angular/core';

import { Client, handle_file } from "@gradio/client";

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  searchWord: any = '';
  result: any = '';
  searched: boolean;
  dataRetrieved: boolean;
  validationError: boolean;
  history: Array<any>;

  ngOnInit(): void {
    
  }

  constructor(
    private toastr: ToastrService
  ) {
    this.dataRetrieved = false;
    this.searched = false;
    this.validationError = false;
    this.history = JSON.parse(localStorage.getItem('history')||'[]');
  }

  async searchInfo(): Promise<void> {
    this.result = '';
    this.dataRetrieved = false;
    if(!this.searchWord) {
      this.toastr.error("Required", "Search Input is", { positionClass: 'toast-bottom-right' });
      return;
    }
    this.searched = true;
    this.validationError = false;
    const app = await Client.connect("Sujithanumala/Oracle_Wikipage");
    const transcription = await app.predict("/predict", { 		
      query: this.searchWord, 		
      chat_history: {"headers":["a","b"],"data":[["foo","bar"]]}, 		
      invocation_type: "OIC", 		
      schemas: {"foo":"bar"}, 
  });
    if(transcription.data != null) {
      this.searched = false;
      this.dataRetrieved = true;
      this.result = transcription.data;
      var domSearchElement = document.getElementById('search');
      if(domSearchElement) {
        domSearchElement.className = 'search-card container'
      }
      var domResultElement = document.getElementById('result');
      if(domResultElement) {
        domResultElement.innerHTML = this.result;
        var idx = this.history.length;
        var dataObject = {'sNo': idx,'search': this.searchWord, 'result': this.result };
        this.history = JSON.parse(localStorage.getItem('history')||'[]');
        this.history.push(dataObject);
        localStorage.setItem("history", JSON.stringify(this.history));
      }
    }
  }
}
