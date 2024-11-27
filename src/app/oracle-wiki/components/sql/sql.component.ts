import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Client, handle_file } from "@gradio/client";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sql',
  templateUrl: './sql.component.html',
  styleUrl: './sql.component.scss'
})
export class SqlComponent implements OnInit {

  dataNames: Array<String>;
  fieldsForm: FormGroup;
  fieldsForm1: FormGroup;
  idx: number;
  result: any;
  searchWord: any = '';
  searched: boolean;
  dataRetrieved: boolean;
  validationError: boolean;
  history: Array<any>;
  secondTable: boolean;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.dataNames = ['String', 'Integer', 'Blob'];
    this.result = "";
    this.dataRetrieved = false;
    this.searched = false;
    this.validationError = false;
    this.history = JSON.parse(localStorage.getItem('history')||'[]');
    this.secondTable = false;
  }

  ngOnInit(): void {
    this.fieldsForm = this.fb.group({
      fields: new FormArray([])
    });
    this.fieldsForm1 = this.fb.group({
      fields1: new FormArray([])
    });
    this.addField();
    this.addField1();
    localStorage.removeItem('sqlSchema');
  }

  newFieldsForm(): FormGroup {
    return this.fb.group({
      field: new FormControl(''),
      dataType: new FormControl('')
    });
  }

  newFieldsForm1(): FormGroup {
    return this.fb.group({
      field1: new FormControl(''),
      dataType1: new FormControl('')
    });
  }

  addField(): void {
    this.fieldsFormArray.push(this.newFieldsForm());
  }

  addField1(): void {
    this.fieldsFormArray1.push(this.newFieldsForm1());
  }

  removeForm(idx: number) {
    this.fieldsFormArray.removeAt(idx);
  }

  removeForm1(idx: number) {
    this.fieldsFormArray1.removeAt(idx);
  }

  get fieldsFormArray(): FormArray {
    return this.fieldsForm.get('fields') as FormArray;
  }

  get fieldsFormArray1(): FormArray {
    return this.fieldsForm1.get('fields1') as FormArray;
  }

  async submitTableData(): Promise<void> {
    if(!this.searchWord) {
      this.toastr.error("Required", "Search Input is", { positionClass: 'toast-bottom-right' });
      return;
    }
    var sqlSchema = localStorage.getItem('sqlSchema');
    if(sqlSchema) {
      var temp = JSON.parse(sqlSchema);
      this.searchSQLSchema(temp[0]);
      return;
    }
    this.searched = true;
    var tableName = (<HTMLInputElement>document.getElementById('tableName')).value;
    if((<HTMLInputElement>document.getElementById('pkValue')))
      var pkValue = (<HTMLInputElement>document.getElementById('pkValue')).value;
    if((<HTMLInputElement>document.getElementById('pkDataType')))
      var pkDataType = (<HTMLInputElement>document.getElementById('pkDataType')).value;
    if(this.secondTable) {
      var tableName1 = (<HTMLInputElement>document.getElementById('tableName1')).value;
      if((<HTMLInputElement>document.getElementById('pkValue1')))
        var pkValue1 = (<HTMLInputElement>document.getElementById('pkValue1')).value;
      if((<HTMLInputElement>document.getElementById('pkDataType1')))
        var pkDataType1 = (<HTMLInputElement>document.getElementById('pkDataType1')).value;
    }

    var array = this.fieldsFormArray.value;
    var array1 = this.fieldsFormArray1.value;
    var req = {};
    var req1 = {};
    array.forEach((arr) => {
      req[arr.field] = arr.dataType;
    });

    array1.forEach((arr) => {
      req1[arr.field] = arr.dataType;
    });
    if(pkValue)
      req[pkValue] = pkDataType + ' + PRIMARY KEY';
    if(pkValue1)
      req1[pkValue1] = pkDataType1 + ' + PRIMARY KEY';
    var jsonObject = {};
    if(tableName == null && tableName1 == null)
      jsonObject = { };
    if(tableName && tableName1 == null)
      jsonObject = { [tableName]: req };
    if(tableName && tableName1)
      jsonObject = { [tableName]: req, [tableName1]: req1 };
    this.searchSQLSchema(jsonObject)
  }

  addTable(): void {
    this.secondTable = true;
    localStorage.removeItem('sqlSchema');
  }

  async searchSQLSchema(jsonObject) {
    this.searched = true;
    const app = await Client.connect("Sujithanumala/Oracle_Wikipage");
    const transcription = await app.predict("/predict", { 		
        query: this.searchWord,
        chat_history: { "headers": ["1"], "data": [[""]], "metadata": null},
        invocation_type: "SQL",
        schemas: jsonObject
    });
    if(transcription.data != null) {
      var sqlSchema = [];
      sqlSchema.push(jsonObject)
      localStorage.setItem('sqlSchema', JSON.stringify(sqlSchema));
      this.dataRetrieved = true;
      this.searched = false;
      this.result = transcription.data;
      var domSearchElement = document.getElementById('search');
      if(domSearchElement) {
        domSearchElement.className = 'search-card container';
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
