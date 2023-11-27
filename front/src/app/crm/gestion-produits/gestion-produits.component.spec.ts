import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MemberCrmComponent} from "../teams-crm/member-crm/member-crm.component";



describe('MemberCrmComponent', () => {
  let component: MemberCrmComponent;
  let fixture: ComponentFixture<MemberCrmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberCrmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberCrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
