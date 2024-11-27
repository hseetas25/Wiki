import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './navigation-components';
import { NavigationComponent } from './navigation-components/navigation/navigation.component';
import { OracleWikiModule } from './oracle-wiki/oracle-wiki.module';
import { ToastrModule } from 'ngx-toastr';

import { environment } from '../../src/environments/environment';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OracleWikiModule,
    ToastrModule.forRoot(),
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(()=> initializeApp(environment.firebaseConfig))
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
