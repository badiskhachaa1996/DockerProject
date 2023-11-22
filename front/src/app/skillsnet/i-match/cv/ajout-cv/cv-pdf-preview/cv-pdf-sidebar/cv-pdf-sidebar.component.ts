import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cv-pdf-sidebar',
  templateUrl: './cv-pdf-sidebar.component.html',
  styleUrls: ['./cv-pdf-sidebar.component.scss']
})
export class CvPdfSidebarComponent implements OnInit {

  @Input() sidebar: any = {
    apropos: 'Lorem ipsum dolor sit amet,  in semper sapien orci et ligula Lorem ipsum dolor sit amet,  in semper sapien orci et ligulav Lorem ipsum dolor sit amet,  in semper sapien orci et ligula.',
    interets: 'sport, gaming, jeux vidéo, lecture',
    competences: [
      {
        label: 'Value 1',
        value: 'Value 1'
      },
      {
        label: 'Value 1',
        value: 'Value 1'
      },
      {
        label: 'Value 1',
        value: 'Value 1'
      },
      {
        label: 'Value 1',
        value: 'Value 1'
      },
      {
        label: 'Value 1',
        value: 'Value 1'
      },
      {
        label: 'Value 1',
        value: 'Value 1'
      },
    ],
    langues: [
      {
        label: 'Value 1',
        value: 'Value 1'
      },
      {
        label: 'Value 1',
        value: 'Value 1'
      },
      {
        label: 'Value 1',
        value: 'Value 1'
      },
      {
        label: 'Value 1',
        value: 'Value 1'
      },
      {
        label: 'Value 1',
        value: 'Value 1'
      },
      {
        label: 'Value 1',
        value: 'Value 1'
      },
    ]

  }

  @Input() school

  constructor() { }

  ngOnInit(): void {
    let competences: any[] = []
    this.sidebar.competences.forEach(val => {
      if (val?.libelle && val._id)
        competences.push({ label: val.libelle, value: val._id })
      else if (val?.label && val.value)
        competences.push({ label: val.label, value: val.value })
      else
        console.log(val, 'skills')
    })
    this.sidebar.competences = competences

    let langues: any[] = []
    this.sidebar.langues.forEach(val => {
      if (val?.label && val.value)
        langues.push({ label: val.label, value: val.value })
      else if (typeof val == typeof 'str')
        langues.push({ label: val, value: val })
      else
        console.log(val, 'langues')
    })
    this.sidebar.langues = langues
  }

}
