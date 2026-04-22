import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crowdfunding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crowdfunding.component.html',
  styleUrl: './crowdfunding.component.scss'
})
export class CrowdfundingComponent {
  cards = [
    {
      title: 'Campaigns',
      description: 'Manage active and closed crowdfunding campaigns.',
      value: 0,
      action: 'Open Campaigns'
    },
    {
      title: 'Investors',
      description: 'Track investors and contributor profiles.',
      value: 0,
      action: 'Open Investors'
    },
    {
      title: 'Contributions',
      description: 'Monitor contributions, amounts, and payment status.',
      value: 0,
      action: 'Open Contributions'
    },
    {
      title: 'Milestones',
      description: 'Follow milestones and funding progress objectives.',
      value: 0,
      action: 'Open Milestones'
    },
    {
      title: 'Funding Progress',
      description: 'Analyze funding rates and campaign performance.',
      value: 0,
      action: 'Open Progress'
    },
    {
      title: 'Withdrawals',
      description: 'Manage withdrawal requests and fund release.',
      value: 0,
      action: 'Open Withdrawals'
    }
  ];
}