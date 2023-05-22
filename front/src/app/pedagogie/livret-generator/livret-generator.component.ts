import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Diplome } from 'src/app/models/Diplome';
import { Etudiant } from 'src/app/models/Etudiant';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-livret-generator',
  templateUrl: './livret-generator.component.html',
  styleUrls: ['./livret-generator.component.scss']
})
export class LivretGeneratorComponent implements OnInit {
  ID = this.route.snapshot.paramMap.get('id');
  constructor(private route: ActivatedRoute) { }

  diplome: Diplome
  user: User
  etudiant: Etudiant
  notes = {
    annee_1: {
      semestre_1: {
        'Culture générale et expression': 6
      },
      semestre_2: {
        'Culture générale et expression': 8
      },
      moyenne: {
        'Culture générale et expression': 7
      }
    },
    annee_2: {
      semestre_1: {
        'Culture générale et expression': 10
      },
      semestre_2: {
        'Culture générale et expression': 12
      },
      moyenne: {
        'Culture générale et expression': 11
      }
    },
    appreciations: {
      'Culture générale et expression': 'Moyen +1 '
    }
  }

  options = {
    plugins: {
      legend: {
        display: false
      }
    },
  };

  basicData = {
    labels: ['Culture générale et expression', 'Langue Vivante 1', 'Culture économique, juridique et managériale', 'Développement de la relation client et vente conseil', 'Animation et dynamisation de l\'offre commerciale', 'Gestion opérationnelle', 'Management de l\'équipe commerciale', 'Langue vivante facultative 2', 'Parcours de professionnalisation à l’étranger', 'Entrepreneuriat'],
    datasets: [
      {
        label: 'Classe',
        fill: false,
        borderColor: '#00000',
        tension: 0,
        pointRadius: 0,
        data: [20, 18, 17, 16, 8, 13, 17, 10, 18, 7]
      },
      {
        label: 'Candidat',
        fill: false,
        borderColor: '#00000',
        pointRadius: 0,
        tension: 0,
        data: [20, 1, 10, 8, 16, 13, 17, 9, 20, 10]
      }
    ]
  };

  ngOnInit(): void {

  }

}
