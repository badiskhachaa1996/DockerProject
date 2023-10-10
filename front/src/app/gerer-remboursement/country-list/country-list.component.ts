import { Component, OnInit } from '@angular/core';
import { CountryService } from '../country.service';


@Component({
  selector: 'app-country-list',
  template: `
    <h2>List of Countries</h2>
    <ul>
      <li *ngFor="let country of countries">{{ country.name }}</li>
    </ul>
  `,
})
export class CountryListComponent implements OnInit {
  countries: any[] = [];

  constructor(private countryService: CountryService) {}

  ngOnInit() {
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }
}

