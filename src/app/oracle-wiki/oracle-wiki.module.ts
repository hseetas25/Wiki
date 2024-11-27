import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OracleWikiRoutingModule } from './oracle-wiki-routing.module';
import { HomeComponent, SearchComponent, HistoryComponent, SearchAnimationComponent } from './components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SqlComponent } from './components/sql/sql.component';


@NgModule({
  declarations: [
    HomeComponent,
    SearchComponent,
    HistoryComponent,
    SearchAnimationComponent,
    SqlComponent
  ],
  imports: [
    CommonModule,
    OracleWikiRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ]
})
export class OracleWikiModule { }
