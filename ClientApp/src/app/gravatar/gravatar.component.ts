import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gravatar',
  templateUrl: './gravatar.component.html',
  styleUrls: ['./gravatar.component.scss']
})
export class GravatarComponent implements OnInit {

  @Input("hash") gravatarHash: string;
  @Input("size") size: string;
  @Input("altText") altText: string;

  get gravatarUrl(): string {
    return `https://www.gravatar.com/avatar/${this.gravatarHash}?s=${encodeURIComponent(this.size)}`;
  }

  constructor() { }

  ngOnInit() {
  }

}
