import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { EditUserDialogComponent } from './edit-user-dialog.component';

describe('EditUserDialogComponent', () => {
  let component: EditUserDialogComponent;
  let fixture: ComponentFixture<EditUserDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<EditUserDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj<MatDialogRef<EditUserDialogComponent>>('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [EditUserDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            fullName: 'Jane Doe',
            email: 'jane@example.com',
            phone: '12345678',
            userType: 'ADMIN',
            enabled: true
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
