import {
  Component,
  OnInit
} from '@angular/core';
import {
  AboutEntry
} from '../shared/interfaces/about-entry.model';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  public aboutEntries: AboutEntry[] = [
    new AboutEntry('What is this project / thesis about?',
      'question',
      'This thesis is done as part of the Human-Computer Interaction research group at KU Leuven. \
      The thesis is about the design of an energy monitoring dashboard to support sustainable behaviour in the workplace among office workers. \
      Originally the goal was to do an in the wild study where a group of real users would have the chance to use the dashboard in their workplace for some time. \
      The goal was then to analyse usage statistics and do interviews to figure out which elements they found most motivating towards sustainable behaviour. \
      Due to the lockdown this evaluation is no longer possible, so the new research objective is to compare 2 versions of the dashboard and figure out \
      whether the inclusion of a specific element has an impact on the perceived usefullnes of the users.'),

    new AboutEntry('What is Wattness?',
      'bolt',
      'Wattness is a startup that does smart energy monitoring and benchmarking. By using machine learning on the gathered energy usage data \
      Wattness can provide meaningfull insights into the energy usage of the monitored buildings. Wattness provides the data that can be seen in this dashboard.'),

    new AboutEntry('Contact information',
      'at',
      'You can reach me via e-mail at tom.bury@student.kuleuven.be. I\'ll gladly answer any questions you might have, or send you the thesis when it is done. \
      Any feedback you would like to send me is greatly appreciated.'),

    new AboutEntry('How is data gathered?',
      'database',
      'The dashboard does not gather any usage data. Data is gathered via online questionnaires that the participants will fill in during the study.'),

    new AboutEntry('How are points earned?',
      'trophy',
      'Right now the scoring system is not implemented concretely, since no in the wild study could be done. It would have worked as follows. \
      Points can be earned in general by interacting with the dashboard. This means you will get points for frequent logins, exploring the data \
      and posting/liking/commenting on the discussion board. The points you get from dashboard interaction will be given automatically. \
      You can also get points by checking of sustainable actions you did in your checklist. Finally achievements act as one time only bonus points \
      that you get automatically whenever you satisfy the achievement\'s requirements. The scores will reset each weak to give everyone a chance \
      of becomen the winner for a week. An overview of this week\'s scores is given in the leaderboard.'),



  ];

  constructor() {}

  ngOnInit() {}

}
