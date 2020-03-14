import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  banners = [
    {
      img: '../../assets/imgs/Banners/home4.jpeg',
      text: 'our volunteers'
    },
    {
      img: '../../assets/imgs/Banners/home5.jpeg',
      text: 'our volunteers'
    },
    {
      img: '../../assets/imgs/Banners/home6.jpeg',
      text: 'our volunteers'
    },
    {
      img: '../../assets/imgs/Banners/home7.jpeg',
      text: 'our volunteers'
    },
    {
      img: '../../assets/imgs/Banners/home8.jpeg',
      text: 'our volunteers'
    },
    {
      img: '../../assets/imgs/Banners/home9.jpeg',
      text: 'our volunteers'
    }
  ];
  currentBanner: any;
  index = 0;

  contents = [
    {
      title: 'who are we?',
      content: 'We are Indian Innovators foundation trust (IIFT). We are a health NGO. We are registered with goverment with reg. no. 1837/12/10/12-Delhi.'
    },
    {
      title: 'what we do?',
      content: `We are a health NGO. We spread enlight on women's health. We made world first class, safe and comfortable sanatiry pads.`
    }
  ];

  constructor() { }

  ngOnInit() {
    this.currentBanner = this.banners[this.index];
  }

  changeBanner(state: string): void {
    if (state.toLowerCase() === 'pre') {
      if (this.index === 0) {
        this.index = this.banners.length - 1;
        this.currentBanner = this.banners[this.index];
      } else {
        this.currentBanner = this.banners[this.index - 1];
      }
    }
    if (state.toLowerCase() === 'next') {
      if (this.index === (this.banners.length - 1)) {
        this.index = 0;
        this.currentBanner = this.banners[this.index];
      } else {
        this.currentBanner = this.banners[this.index + 1];
      }
    }
  }
}
