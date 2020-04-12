import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { FirestoreService } from './firestore.service';
import { ForumPicture } from '../interfaces/forum/forum-picture.model';
import { AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  private PREFIX = environment.mainCollection;
  private forumPicturesRef: AngularFireStorageReference;
  private forumPicsCollection: AngularFirestoreCollection<ForumPicture>;

  constructor(
    private afStorage: AngularFireStorage,
    private db: FirestoreService
  ) {
    this.forumPicturesRef = this.afStorage.ref(this.PREFIX + '/post-images');
    this.forumPicsCollection = this.db.getForumPostPicsCol();
  }


  public uploadForumPicture(file: File, uid: string): Promise<void> {
    return new Promise((resolve, reject) => {

      const pic = new ForumPicture(uid);
      console.log(pic);

      this.db.createDocAutoId$<ForumPicture>(this.forumPicsCollection, pic, ForumPicture.toFirestore)
        .then(ref => {
          const picId = ref.id;
          console.log('new picture id: ', picId);
          const fileRef: AngularFireStorageReference = this.forumPicturesRef.child(picId);
          const task = fileRef.put(file);
          task.then(_ => resolve()).catch(_ => reject());
        })
        .catch(err => reject(err));
    });
  }
}
