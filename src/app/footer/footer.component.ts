import { Component, OnInit } from '@angular/core';
import * as express from "express";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }
  version:string ="";
  ngOnInit(): void {
    const config = require("../../environments/version.json");
    this.version=config.version;
  }

}
