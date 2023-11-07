import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cv-pdf-sidebar',
  templateUrl: './cv-pdf-sidebar.component.html',
  styleUrls: ['./cv-pdf-sidebar.component.scss']
})
export class CvPdfSidebarComponent implements OnInit {

  @Input() sidebar

  @Input() school 

  constructor() { }

  ngOnInit(): void {

    console.log('compétences')
    this.sidebar = {
      apropos : 'Lorem ipsum dolor sit amet,  in semper sapien orci et ligula Lorem ipsum dolor sit amet,  in semper sapien orci et ligulav Lorem ipsum dolor sit amet,  in semper sapien orci et ligula.',
      interets : 'sport, gaming, jeux vidéo, lecture',
      competences : [
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
      langues : [
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
    console.log(this.sidebar)
  }

}
