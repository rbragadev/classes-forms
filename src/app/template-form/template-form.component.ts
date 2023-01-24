import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css'],
})
export class TemplateFormComponent {
  usuario: any = {
    nome: 'Raphael',
    email: 'raffael.info@gmail.com',
  };

  constructor(private httpClient: HttpClient) {}

  onSubmit(form: any) {
    console.log(form);
    console.log(this.usuario);
  }

  consultaCEP(cep: string, form: any) {
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
          .subscribe((dados) => this.popularDadosForm(dados, form));
      }
    }
  }
  popularDadosForm(dados: any, form: any) {
    form.setValue({
      nome: form.value.nome,
      email: form.value.email,
      endereco: {
        cep: dados.cep,
        numero: '',
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf,
      },
    });
    form.form.patchValue({
      endereco: {
        cep: dados.cep,
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf,
      },
    });
  }
}
