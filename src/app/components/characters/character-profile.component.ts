import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Character } from 'backend/models/character';

@Component({
  selector: 'app-character-profile',
  templateUrl: './character-profile.component.html',
  standalone: true,
})
export class CharacterProfileComponent {
  // @Input() character!: Character;
  // @Output() selectCharacter = new EventEmitter<Character>();
  // onSelect() {
  //   this.selectCharacter.emit(this.character);
  // }
}
