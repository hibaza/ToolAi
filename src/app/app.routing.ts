import { Routes, RouterModule } from '@angular/router';



import { SiteLayoutComponent } from './_layout/site-layout/site-layout.component';
import { AppLayoutComponent } from './_layout/app-layout/app-layout.component';


import { AddProductHandComponent } from './add-product-hand/add-product-hand.component';
import { EditProductHandComponent } from './edit-product-hand/edit-product-hand.component';
import { LoginComponent } from './login/login.component';

const appRoutes: Routes = [
    
  
    
    // App routes goes here here
    { 
        path: 'main',
        component: AppLayoutComponent, 
        children: [
          { path: 'add-product', component: AddProductHandComponent },
          { path: 'edit-product', component: EditProductHandComponent }
        ]
    },

    //no layout routes
    { path: '', component: LoginComponent},
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);





// import { Routes, RouterModule } from '@angular/router';



// import { SiteLayoutComponent } from './_layout/site-layout/site-layout.component';
// import { AppLayoutComponent } from './_layout/app-layout/app-layout.component';


// import { HomeComponent } from './home/home.component';
// import { AboutComponent } from './about/about.component';
// import { LoginComponent } from './login/login.component';
// import { RegisterComponent } from './register/register.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
// import { ProfileComponent } from './profile/profile.component';


// const appRoutes: Routes = [
    
//     //Site routes goes here 
//     { 
//         path: '', 
//         component: SiteLayoutComponent,
//         children: [
//           { path: '', component: HomeComponent, pathMatch: 'full'},
//           { path: 'about', component: AboutComponent },
//           { path: 'test/:id', component: AboutComponent }
//         ]
//     },
    
//     // App routes goes here here
//     { 
//         path: '',
//         component: AppLayoutComponent, 
//         children: [
//           { path: 'dashboard', component: DashboardComponent },
//           { path: 'profile', component: ProfileComponent }
//         ]
//     },

//     //no layout routes
//     { path: 'login', component: LoginComponent},
//     { path: 'register', component: RegisterComponent },
//     // otherwise redirect to home
//     { path: '**', redirectTo: '' }
// ];

// export const routing = RouterModule.forRoot(appRoutes);


