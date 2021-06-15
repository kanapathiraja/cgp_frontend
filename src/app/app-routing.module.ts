import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent, CgpLayoutComponent, HomeLayoutComponent } from './components/layouts';
import { AuthGuardService } from './services/auth-guard.service';
import {WhyCgpComponent} from './components/shared/why-cgp/why-cgp.component';
import {PrivacyPolicyComponent} from './components/shared/privacy-policy/privacy-policy.component';

const routes: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: 'homepage',
        loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule)
      }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'landing',
        loadChildren: () => import('./components/landing/landing.module').then(m => m.LandingModule)
      }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule)
      },
    ]
  },
  {
    path: '',
    // canActivate: [AuthGuardService],
    component: CgpLayoutComponent,
    children: [
      {
        path: 'cgp',
        loadChildren: () => import('./components/cgp/cgp.module').then(m => m.CgpModule)
      },
    ]
  },
  {
    path: '',
    canActivate: [AuthGuardService],
    component: AuthLayoutComponent,
    children: [
      {
        path: 'user',
        loadChildren: () => import('./components/user/user.module').then(m => m.UserModule)
      },
    ]
  },
  {
    path: 'why-patrimonist',
    component: WhyCgpComponent,
    data: { title: 'Why Cgp' }
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    data: { title: 'Privacy Policy' }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
