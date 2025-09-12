import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cadastros',
  imports: [CommonModule, RouterLink],
  templateUrl: './cadastros.html',
  styleUrl: './cadastros.css',
})
export class Cadastros {}
