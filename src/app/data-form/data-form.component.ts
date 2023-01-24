import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css'],
})
export class DataFormComponent implements OnInit {
  formulario!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    /* Usando o form group
    this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null),
    });*/

    //Usando o formBuilder
    this.formulario = this.formBuilder.group({
      nome: [null],
      email: [null],
    });
  }

  onSubmit() {
    console.log(this.formulario.value);
    this.httpClient
      .post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
      .pipe(map((data) => data))
      .subscribe(
        (data) => {
          console.log(data); //reseta form
          this.formulario.reset();
        },
        (error: any) => alert('erro')
      );
  }

  resetar() {
    this.formulario.reset();
  }
}
