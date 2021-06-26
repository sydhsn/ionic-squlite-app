import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})

export class CrudService {
  
  private dbInstance: SQLiteObject;
  readonly db_name: string = "remotestack.db";
  readonly db_table: string = "userTable";
  USERS: Array <any> ;

  constructor(
    private platform: Platform,
    private sqlite: SQLite    
  ) { 
    this.databaseConn();
  }

    // Create SQLite database 
    databaseConn() {
        this.platform.ready().then(() => {
          this.sqlite.create({
              name: this.db_name,
              location: 'default'
            }).then((sqLite: SQLiteObject) => {
              this.dbInstance = sqLite;
              sqLite.executeSql(`
                  CREATE TABLE IF NOT EXISTS ${this.db_table} (
                    user_id INTEGER PRIMARY KEY, 
                    name varchar(255),
                    mobile varchar(255),
                    oxygen varchar(255),
                    temprature varchar(255),
                    vaccinated varchar(255)
                  )`, [])
                .then((res) => {
                  // alert(JSON.stringify(res));
                })
                .catch((error) => alert(JSON.stringify(error)));
            })
            .catch((error) => alert(JSON.stringify(error)));
        });   
    }

    // Crud
    public addItem(n: string | any[], m: string | any[], o: string | any[], t: string | any[],v: string | any[]) {
      // validation
       /* if (!n.length || !m.length || !o.length || !t.length || !v.length) { 
        alert('Provide all value' ,n.length , m.length , o.length,t.length,v.length);
        return;
      }  */
      this.dbInstance.executeSql(`
      INSERT INTO ${this.db_table} (name, mobile, oxygen, temprature, vaccinated) VALUES ('${n}', '${m}', '${o}', '${t}', '${v}')`, [])
        .then(() => {
          alert("Success");
          this.getAllUsers();
          
        }, (e) => {
          alert(JSON.stringify(e.err));
        });
    }

    getAllUsers() {
      return this.dbInstance.executeSql(`SELECT * FROM ${this.db_table}`, []).then((res) => {
        this.USERS = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            this.USERS.push(res.rows.item(i));
          }
          return this.USERS;
        }
      },(e) => {
        alert(JSON.stringify(e));
      });
    }

    // Get user
    getUser(id: any): Promise<any> {
      return this.dbInstance.executeSql(`SELECT * FROM ${this.db_table} WHERE user_id = ?`, [id])
      .then((res) => { 
        return {
          user_id: res.rows.item(0).user_id,
          name: res.rows.item(0).name,  
          mobile: res.rows.item(0).mobile,
          oxygen: res.rows.item(0).oxygen,
          temprature: res.rows.item(0).temprature,
          vaccinated: res.rows.item(0).vaccinated
        }
      });
    }

    // Update
    updateUser(id,name,mobile,oxygen,temprature,vaccinated) {
      let data = [name,mobile,oxygen,temprature,vaccinated];
      return this.dbInstance.executeSql(`UPDATE ${this.db_table} SET name = ?, mobile = ?, oxygen = ?, temprature = ?, vaccinated  = ? WHERE user_id = ${id}`, data)
    }  

    // Delete
    deleteUser(user: any) {
      this.dbInstance.executeSql(`
      DELETE FROM ${this.db_table} WHERE user_id = ${user}`, [])
        .then(() => {
          alert("User deleted!");
          this.getAllUsers();
        })
        .catch(e => {
          alert(JSON.stringify(e))
        });
    }

}
