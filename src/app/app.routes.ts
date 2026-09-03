import { Routes } from '@angular/router';

import { HomeComponent } from './component/home-component/home-component';
import { AtletaComponent } from './component/atleta/atleta-component/atleta-component';
import { AtletaListaComponent} from './component/atleta/atleta-lista-component/atleta-lista-component';
import { CorridaComponent } from './component/corrida/corrida-component/corrida-component';
import { CorridaListaComponent } from './component/corrida/corrida-lista-component/corrida-lista-component';
import { InscricaoComponent } from './component/inscricao/inscricao-component/inscricao-component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: "/home",
        pathMatch: 'full'
    },
    {
        path: "home",
        component: HomeComponent
    },
    {
        path: "cadastroatleta",
        component: AtletaComponent
    },
    {
        path: "cadastroatleta/:id",
        component: AtletaComponent
    },
    {
        path: "listaatleta",
        component: AtletaListaComponent
    },
    {
        path: "cadastrocorrida",
        component: CorridaComponent
    },
    {
        path: "alteracorrida/:id",
        component: CorridaComponent
    },
    {
        path: "listacorrida",
        component: CorridaListaComponent
    },
    {
        // Rota da nova tela "Inscrição na Corrida"
        path: "inscricao",
        component: InscricaoComponent
    },

];
