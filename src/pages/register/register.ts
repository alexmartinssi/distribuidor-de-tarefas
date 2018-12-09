import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskDTO } from '../../models/task.dto';
import { RegisterService } from '../../services/domain/register.service';
import { TaskService } from '../../services/domain/task.service';
import { UserService } from '../../services/domain/user.service';
import { UserDTO } from '../../models/user.dto';
import { IonicSelectableComponent } from 'ionic-selectable';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  formGroup: FormGroup;
  listUsers: UserDTO[] = [];
  tasks: TaskDTO[] = [];
  user: UserDTO = null;
  task: TaskDTO = null;
  users: UserDTO[] = [];
  show: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public registerService: RegisterService,
    public userService: UserService,
    public taskService: TaskService,
    public alertCtrl: AlertController) {

    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      initialDate: ['', [Validators.required]],
      finalDate: ['', [Validators.required]],
      reward: ['', [Validators.required]],
      users: ['', [Validators.required]],
      tasks: ['', [Validators.required]]
    });
  }

  ionViewDidLoad() {
    this.userService.findAll()
      .subscribe(response => {
        this.listUsers = response;
      },
        error => { });
  }

  userChanged(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.users = event.value;
  }

  addTask() {
    let prompt = this.alertCtrl.create({
      title: 'Adicionar tarefa',
      inputs: [
        {
          name: 'name',
          placeholder: 'Nome da tarefa',
        },
        {
          name: 'description',
          placeholder: 'Descrição da tarefa',
        }
      ],
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Adicionar',
          handler: data => {
            if(data.name == ''){
              prompt.setMessage('É obrigatório o preenchimento do nome da tarefa');
              return false;
            }else{
              this.task = data;
              this.tasks.push(this.task);
              this.show = true;
            }
          }
        }
      ]
    });
    prompt.present();
  }

  editTask(task) {
    let prompt = this.alertCtrl.create({
      title: 'Editar Tarefa',
      inputs: [
        {
          name: 'name',
          placeholder: 'Nome da tarefa',
          value: task.name
        },
        {
          name: 'description',
          placeholder: 'Descrição da tarefa',
          value: task.description
        }
      ],
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Editar',
          handler: data => {
            let index = this.tasks.indexOf(task);

            if (index > -1) {
              this.tasks[index] = data;
            }
          }
        }
      ]
    });
    prompt.present();
  }

  deleteTask(task) {
    let index = this.tasks.indexOf(task);
    if (index > -1) {
      this.tasks.splice(index, 1);
    }
  }

  insertRegister() {
    if (this.users.length != this.tasks.length) {
      this.showCreateOk('O número de tarefas deve ser igual ao número de usuários!');
    } else {
      this.formGroup.controls["users"].setValue(this.users);
      this.formGroup.controls["tasks"].setValue(this.tasks);

      this.registerService.create(this.formGroup.value)
        .subscribe(response => {
          this.showCreateOk('Cadastro efetuado com sucesso.');
        },
          error => { });
    }
  }

  showCreateOk(mensageGeneric: string) {
    let alert = this.alertCtrl.create({
      message: mensageGeneric,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            //this.navCtrl.setRoot('TaskPage');
          }
        }
      ]
    });
    alert.present();
  }
}
