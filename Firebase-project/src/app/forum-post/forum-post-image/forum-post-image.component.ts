import {
  Component,
  OnInit,
  Input
} from '@angular/core';

@Component({
  selector: 'app-forum-post-image',
  templateUrl: './forum-post-image.component.html',
  styleUrls: ['./forum-post-image.component.scss']
})
export class ForumPostImageComponent implements OnInit {

  @Input() imgUrl = '';

  constructor() {}

  ngOnInit(): void {
    // Get the modal
    const modal = document.getElementById('myModal');

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    const img = document.getElementById('myImg');
    img.onclick = () => {
      modal.style.display = 'block';
    };

    // Get the <span> element that closes the modal
    // When the user clicks on <span> (x), close the modal
    const span = document.getElementsByClassName('close')[0];
    span.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

}
