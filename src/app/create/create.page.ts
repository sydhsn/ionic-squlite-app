import { Component, OnInit } from '@angular/core';
import { CrudService } from '../crud.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})

export class CreatePage implements OnInit {

  nameVal: string = "";
  mobileVal: string = "";
  oxygenVal: string = "";
  tempratureVal: string = "";
  vaccinatedVal: string = "";


  constructor(
   private crud: CrudService
  ) {
    this.crud.databaseConn(); 
  }

  ngOnInit() { }

  ionViewDidEnter() {  
    this.crud.getAllUsers()
  }
   
  createUser(){
    this.crud.addItem(this.nameVal, this.mobileVal, this.oxygenVal,this.tempratureVal,this.vaccinatedVal);
  }
   
  remove(user: any) {
    this.crud.deleteUser(user);
  }
  
}
