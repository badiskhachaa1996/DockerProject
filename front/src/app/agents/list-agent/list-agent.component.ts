import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-list-agent',
  templateUrl: './list-agent.component.html',
  styleUrls: ['./list-agent.component.scss']
})
export class ListAgentComponent implements OnInit {
  agents: User[]
  constructor(private UserService: AuthService, private ToastService: MessageService, private router: Router) { }

  ngOnInit(): void {
    this.UserService.getAllAgentPopulate().subscribe(data => {
      this.agents = data
    })
  }

  delete(agent: User) {
    if (confirm('Cette agent sera supprimé définitevement, êtes-vous sûr de vous ?'))
      this.UserService.delete(agent._id).subscribe(d => {
        this.agents.splice(this.agents.indexOf(agent), 1)
        this.ToastService.add({ severity: 'success', summary: "Cette agent a été supprimé" })
      })
  }

  update(agent: User) {
    this.router.navigate(['/agent/update', agent._id])
  }

}
