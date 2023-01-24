import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { map } from 'rxjs/operators';
import { EstadosBr } from '../shared/models/estadosbr.model';
import { DropdownService } from '../shared/services/dropdown.service';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css'],
})
export class DataFormComponent implements OnInit {
  formulario!: FormGroup;
  estados!: EstadosBr[];

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private dropdownService: DropdownService
  ) {}

  ngOnInit(): void {
    this.dropdownService.getEstadosBr().subscribe((dados) => {
      this.estados = dados;
      console.log(dados);
    });
    /* Usando o form group
    this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null),
    });*/

    //Usando o formBuilder
    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required],
      }),
    });
  }

  consultaCEP() {
    let cep = this.formulario.get('endereco.cep')?.value;
    console.log(cep);
    //Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');
    //Verifica se campo cep possui valor informado.
    if (cep != '') {
      var validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {
        //Consulta o webservice viacep.com.br/
        this.httpClient
          .get(`https://viacep.com.br/ws/${cep}/json`)
          .pipe(map((dados) => dados))
          .subscribe((dados) => this.popularDadosForm(dados));
      }
    }
  }

  popularDadosForm(dados: any) {
    this.formulario.patchValue({
      endereco: {
        //cep: dados.cep,
        numero: '',
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf,
      },
    });
  }

  onSubmit() {
    console.log(this.formulario.value);
    if (this.formulario.valid) {
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
    } else {
      this.verificaValidationsForm(this.formulario);
    }
  }

  verificaValidationsForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((campo) => {
      console.log(campo);
      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      if (controle instanceof FormGroup) {
        this.verificaValidationsForm(controle);
      }
    });
  }

  resetar() {
    this.formulario.reset();
  }
}
