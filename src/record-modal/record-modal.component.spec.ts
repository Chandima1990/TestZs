import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordModalComponent } from './record-modal.component';

describe('RecordModalComponent', () => {
  let component: RecordModalComponent;
  let fixture: ComponentFixture<RecordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
