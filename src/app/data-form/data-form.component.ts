import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstadosBr } from '../shared/models/estadosbr.model';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { DropdownService } from '../shared/services/dropdown.service';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css'],
})
export class DataFormComponent implements OnInit {
  formulario!: FormGroup;
  //estados!: EstadosBr[];
  estados!: Observable<EstadosBr[]>;
  cargos!: any[];
  tecnologias!: any[];
  newsletterOp!: any[];
  frameworks = ['angular', 'react', 'vue'];

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService
  ) {}

  ngOnInit(): void {
    this.estados = this.dropdownService.getEstadosBr();
    this.cargos = this.dropdownService.getCargos();
    this.tecnologias = this.dropdownService.getTecnologias();
    this.newsletterOp = this.dropdownService.getNewsletter();
    /*this.dropdownService.getEstadosBr().subscribe((res) => {
      this.estados = res;
      console.log(res);
    });
     Usando o form group
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
      cargo: [null],
      tecnologias: [null],
      newsletter: ['s'],
      termos: [null, Validators.pattern('true')],
      frameworks: this.buildFrameworks(),
    });
  }

  buildFrameworks() {
    const values = this.frameworks.map((v) => new FormControl(false));

    return this.formBuilder.array(values);

    /*return [
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),

    ]*/
  }

  consultaCEP() {
    const cep = this.formulario.get('endereco.cep')?.value;

    if (cep !== '' && cep != null) {
      this.cepService
        .consultaCEP(cep)
        .subscribe((dados) => this.popularDadosForm(dados));
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

  setarCargo() {
    const cargo = { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl' };
    this.formulario.get('cargo')?.setValue(cargo);
  }
  compararCargos(obj1: any, obj2: any) {
    return obj1 && obj2
      ? obj1.nome === obj2.nome && obj1.nivel === obj2.nivel
      : obj1 === obj2;
  }
}
