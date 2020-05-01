import {
  Component,
} from '@angular/core';
import {
  AboutEntry
} from '../shared/interfaces/about-entry.model';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  public aboutEntries: AboutEntry[] = [
    new AboutEntry('What is this project / thesis about?',
      'question',
      '<span>This thesis is done as part of the <b>Human-Computer Interaction research</b> group at KU Leuven.</span>\
      <span>It is about the design of an energy monitoring dashboard to <b>support sustainable behaviour in the workplace</b> among office workers.</span>\
      <hr class="my-2 h-0">\
      <span>Originally the goal was to do an in the wild study where a group of real users would have the chance to use the dashboard in their workplace for some time.</span>\
      <span>The goal was then to analyse usage statistics and do interviews to figure out which elements they found most motivating towards sustainable behaviour.</span>\
      <span>Due to the lockdown this evaluation is no longer possible, so the new research objective is to compare 2 versions of the dashboard and figure out \
      whether the inclusion of a specific element has an impact on the perceived usefullnes of the users.</span>'),

    new AboutEntry('What is Wattness?',
      'bolt',
      '<span><b>Wattness</b> is a startup that does <b>smart energy monitoring and benchmarking</b>.</span>\
      <span>By using machine learning on the gathered energy usage data Wattness can provide meaningfull insights into the energy usage of the monitored buildings.</span>\
      <span>Wattness provides the data that can be seen in this dashboard, which is real office usage data.</span>'),

    new AboutEntry('How is data gathered?',
      'database',
      '<span>The dashboard <b>does not gather any usage data.</b></span>\
      <span>Data is only gathered via online <b>questionnaires</b> that the participants will fill in during the study.</span>'),

    new AboutEntry('How are points earned?',
      'trophy',
      '<span><i>Please note that right now the scoring system is <b>not implemented concretely</b>, since no in the wild study could be done.</span>\
      <span>So any scores you see now in the dashboard are static dummy values.</i></span>\
      <span><i>It would have worked as follows:</i></span> \
      <hr class="m-3">\
      <span>Points can be earned in general by interacting with the dashboard.</span>\
      <span>This means you will get points for:</span>\
      <ul>\
        <li><b>Daily usage</b> of the dahsboard</li>\
        <li>Being active on the discussion board: <b>posting, liking, commenting</b></li>\
        <li>Checking off sustainable actions you did in the <b>checklist</b></li>\
        <li><b>Exploring the data</b> via the charts in the explore tab</li>\
        <il>Scoring one time only bonus points with <b>achievements</b></il>\
      </ul>\
      <span>The scores will <b>reset each weak</b> to give everyone a chance of becoming the winner for a week.</span>\
      <span>An overview of this week\'s scores is given in the leaderboard.</span>'),


  ];

  constructor() {}



}
