import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from "../../shared/components/hero/hero.component";
import { StatsBandComponent } from "../../shared/components/stats-band/stats-band.component";
import { FeaturesComponent } from "../../shared/components/features/features.component";
import { HowItWorksComponent } from "../../shared/components/how-it-works/how-it-works.component";
import { SecurityComponent } from "../../shared/components/security/security.component";
import { CtaComponent } from "../../shared/components/cta/cta.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroComponent, StatsBandComponent, FeaturesComponent, HowItWorksComponent, SecurityComponent, CtaComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}