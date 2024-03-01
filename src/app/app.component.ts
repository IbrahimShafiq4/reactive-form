// # Using FormGroup and FormControl

// import { Component, OnInit, inject } from '@angular/core';
// import {
//   FormArray,
//   FormBuilder,
//   FormControl,
//   FormGroup,
//   Validators,
// } from '@angular/forms';
// import { Observable } from 'rxjs';
// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css'],
// })
// export class AppComponent implements OnInit {
//   genders: string[] = ['male', 'female'];
//   signupForm: FormGroup;

//   forbiddenUsernames: string[] = ['Ibrahim', 'Shafiq'];

//   fb = inject(FormBuilder);

//   ngOnInit(): void {

//     this.signupForm = new FormGroup({
//       userData: new FormGroup({
//         username: new FormControl('', [
//           Validators.required,
//           Validators.minLength(0),
//           this.forbiddenNames.bind(this),
//           this.emptySpace.bind(this)
//         ]),
//         email: new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmail)
//       }),
//       gender: new FormControl('male'),
//       hobbies: new FormArray([]),
//     });

//     // this.signupForm.get('userData.username').statusChanges.subscribe((status) => {
//     //   console.log(status);
//     // })

//     // this.signupForm.get('userData.username').valueChanges.subscribe((value) => {
//     //   console.log(value);
//     // })

//     // this.signupForm.reset({
//     //   'userData': {
//     //     'username': '',
//     //     'email': ''
//     //   },
//     //   gender: '',
//     //   hobbies: []
//     // })
//   }

//   // onSubmit() {
//   //   if (this.signupForm.valid) {
//   //     // Form is valid, handle form submission
//   //     console.log(this.signupForm.value);
//   //   } else {
//   //     // Form is invalid, mark all fields as touched to display validation errors
//   //     this.signupForm.markAllAsTouched();
//   //     this.signupForm.markAsDirty();
//   //     this.signupForm.markAsPending();
//   //     this.signupForm.markAsPristine();
//   //   }
//   // }

//   onSubmit() {
//     console.log(this.signupForm);
//   }

//   getControls() {
//     return (<FormArray>this.signupForm.get('hobbies')).controls;
//   }

//   get controls() {
//     return (this.signupForm.get('hobbies') as FormArray).controls;
//   }

//   onAddHobby() {
//     const control = new FormControl(null, [
//       Validators.required,
//       Validators.minLength(3),
//     ]);
//     (<FormArray>this.signupForm.get('hobbies')).push(control);
//   }

//   onRemoveInput(index: number) {
//     (<FormArray>this.signupForm.get('hobbies')).removeAt(index);
//   }

//   forbiddenNames(control: FormControl): { [s: string]: boolean } {
//     const value = control.value;
//     const lowercaseValue = value.toLowerCase();

//     const lowerCaseForbiddenUserNames = this.forbiddenUsernames.map(name => name.toLowerCase())

//     if (!value || lowerCaseForbiddenUserNames.indexOf(lowercaseValue) !== -1) {
//       return { nameIsForbidden: true };
//     }
//     return null;
//   }

//   emptySpace(control: FormControl): { [s: string]: boolean } {
//     const value = control.value;
//     if (!value.includes('')) {
//       return { space: true };
//     }
//     return null;
//   }

//   forbiddenEmail(control: FormControl): Promise<any> | Observable<any> {
//     const promise = new Promise<any>((resolve, reject) => {
//       setTimeout(() => {
//         if (control.value === 'test@test.com') {
//           resolve( { 'emailIsForbidden': true } )
//         } else {
//           resolve(null)
//         }
//       }, 1500)
//     })

//     return promise;
//   }
// }

// # Using FormBuilder
import { AbstractType, Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
  AbstractControlDirective,
  AbstractFormGroupDirective,
} from '@angular/forms';
import { Observable } from 'rxjs';

import { User } from './user';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  genders: string[] = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenUsernames: string[] = ['Ibrahim', 'Shafiq'];

  user: User = {
    username: '',
    email: '',
    gender: '',
    hobbies: []
  };

  submitted: boolean = false;

  fb = inject(FormBuilder)

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      userData: this.fb.group({
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            this.forbiddenNames.bind(this)
          ],
        ],
        email: [
          null,
          [Validators.required, Validators.email],
          this.forbiddenEmail,
        ],
      }),
      gender: ['male'],
      hobbies: this.fb.array([]),
    });

    // Uncomment below to subscribe to form control changes
    // this.signupForm.get('userData.username').statusChanges.subscribe((status) => {
    //   console.log(status);
    // });

    // this.signupForm.get('userData.username').valueChanges.subscribe((value) => {
    //   console.log(value);
    // });

    // Uncomment below to reset the form
    // this.signupForm.reset({
    //   userData: {
    //     username: '',
    //     email: ''
    //   },
    //   gender: '',
    //   hobbies: []
    // });
  }

  onSubmit() {
    this.submitted = true;
    this.user.username = this.signupForm.get('userData.username').value;
    this.user.email = this.signupForm.get('userData.email').value;
    this.user.gender = this.signupForm.get('gender').value;
    this.user.hobbies = this.signupForm.get('hobbies').value;
    
    this.signupForm.reset({
      userData: {
        username: '',
        email: '',
      },
      gender: '',
      hobbies: []
    })
  }

  getControls() {
    return (this.signupForm.get('hobbies') as FormArray).controls;
  }

  get controls(): AbstractControl[] {
    return (<FormArray>this.signupForm.get('hobbies')).controls;
  }

  onAddHobby() {
    const control = this.fb.control(null, [
      Validators.required,
      Validators.minLength(3),
    ]);
    (this.signupForm.get('hobbies') as FormArray).push(control);
  }

  onRemoveInput(index: number) {
    (this.signupForm.get('hobbies') as FormArray).removeAt(index);
  }

  forbiddenNames(control: FormControl): { [s: string]: boolean } {
    const value = control.value;
    const lowercaseValue = value.toLowerCase();
    const lowerCaseForbiddenUserNames = this.forbiddenUsernames.map((name) =>
      name.toLowerCase()
    );

    if (!value || lowerCaseForbiddenUserNames.indexOf(lowercaseValue) !== -1) {
      return { nameIsForbidden: true };
    }
    return null;
  }

  emptySpace(control: FormControl): { [s: string]: boolean } {
    const value = control.value;
    if (!value.includes(' ')) {
      return { space: true };
    }
    return null;
  }

  forbiddenEmail(control: FormControl): Promise<any> | Observable<any> {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({ emailIsForbidden: true });
        } else {
          resolve(null);
        }
      }, 1500);
    });
  }
}
