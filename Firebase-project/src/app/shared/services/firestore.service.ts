import {
  Injectable
} from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore,
  QueryFn,
  DocumentReference,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import {
  Observable
} from 'rxjs';
import {
  map
} from 'rxjs/operators';
import {
  firestore
} from 'firebase';
import {
  environment
} from 'src/environments/environment';
import {
  UserPublic
} from '../interfaces/user/user-public.model';
import {
  UserPrivate
} from '../interfaces/user/user-private.model';
import {
  ForumPost
} from '../interfaces/forum/forum-post.model';
import {
  ForumComment
} from '../interfaces/forum/forum-comment.model';
import {
  PostLike
} from '../interfaces/forum/post-like.model';
import {
  CommentLike
} from '../interfaces/forum/comment-like.model';


type CollectionPredicate < T > = string | AngularFirestoreCollection < T > ;
type DocPredicate < T > = string | AngularFirestoreDocument < T > ;

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private PREFIX = environment.mainCollection;

  constructor(
    private afStore: AngularFirestore
  ) {}


  private col < T > (ref: CollectionPredicate < T > , queryFn ? ): AngularFirestoreCollection < T > {
    return typeof ref === 'string' ? this.afStore.collection < T > (ref, queryFn) : ref;
  }

  private doc < T > (ref: DocPredicate < T > ): AngularFirestoreDocument < T > {
    return typeof ref === 'string' ? this.afStore.doc < T > (ref) : ref;
  }


  // == -------------
  // == COLLECTIONS
  // == -------------

  public getUsersPublicCol(queryFn ? : QueryFn): AngularFirestoreCollection < UserPublic > {
    return this.col < UserPublic > (this.PREFIX + '/collections/users/public/public_user_data', queryFn);
  }

  public getUsersPrivateCol(queryFn ? : QueryFn): AngularFirestoreCollection < UserPrivate > {
    return this.col < UserPrivate > (this.PREFIX + '/collections/users/private/private_user_data', queryFn);
  }

  public getForumPostsCol(queryFn ? : QueryFn): AngularFirestoreCollection < ForumPost > {
    return this.col < ForumPost > (this.PREFIX + '/collections/forum-posts', queryFn);
  }

  public getForumCommentsCol(queryFn ? : QueryFn): AngularFirestoreCollection < ForumComment > {
    return this.col < ForumComment > (this.PREFIX + '/collections/forum-comments', queryFn);
  }

  public getForumPostLikesCol(queryFn ? : QueryFn): AngularFirestoreCollection < PostLike > {
    return this.col < PostLike > (this.PREFIX + '/collections/forum-post-likes', queryFn);
  }

  public getForumCommentLikesCol(queryFn ? : QueryFn): AngularFirestoreCollection < CommentLike > {
    return this.col < CommentLike > (this.PREFIX + '/collections/forum-comment-likes', queryFn);
  }



  // == --------
  // == READS
  // == --------

  public getDocObs < T > (ref: AngularFirestoreDocument < T > , toFrontendObjectTransformer: (data: any) => T): Observable < T > {
    return ref.snapshotChanges().pipe(
      map(doc => {
        return toFrontendObjectTransformer(doc.payload.data());
      }));
  }

  public getCollObs < T > (ref: AngularFirestoreCollection < T > , toFrontendObjectTransformer: (data: any) => T): Observable < T[] > {
    return ref.valueChanges({
      idField: 'ID'
    }).pipe(
      map(d => {
        const results = d.filter(dd => dd !== null && Object.keys(dd).includes('createdAt')).map(toFrontendObjectTransformer);
        return results;
      })
    );
  }

  public getCollAndLastDocProm$ < T > (ref: AngularFirestoreCollection < T > , toFrontendObjectTransformer: (data: any) => T): Promise < {data: T[], last: QueryDocumentSnapshot<T>} > {

    return new Promise((resolve, reject) =>
      ref.get().subscribe(
        (querySnapshot) => {
          const result = [];
          let last;
          querySnapshot.forEach((doc) => {
            if (Object.keys(doc.data()).includes('createdAt')) {
              result.push(toFrontendObjectTransformer({ID: doc.id, ...doc.data()}));
              last = doc;
            }
          });
          resolve({data: result, last});
        },
        (error) => {
          reject(error);
        }));
  }

  // public doc$ < T > (ref: DocPredicate < T > ): Observable < T > {
  //   return this.doc(ref).snapshotChanges().pipe(
  //     map(doc => {
  //       return doc.payload.data() as T;
  //     }));
  // }



  // public col$ < T > (ref: CollectionPredicate < T > , toFrontendObjectTransformer: (data: any) => T, queryFn ? : QueryFn): Observable < T[] > {
  //   return this.col(ref, queryFn).snapshotChanges().pipe(
  //     map(docs => {
  //       return docs.map(a => toFrontendObjectTransformer(a.payload.doc.data()));
  //     })
  //   );
  // }






  // == ---------
  // == CREATE
  // == ---------

  private get timestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  private addTimestamps(obj: any): any {
    const timestamp = this.timestamp;
    return {
      ...obj,
      updatedAt: timestamp,
      createdAt: timestamp
    };
  }

  public createDoc$ < T > (ref: AngularFirestoreDocument < T > , data: T, toFirestoreObjTransformer: (data: T) => any): Promise < void > {
    const transformedData = this.addTimestamps(toFirestoreObjTransformer(data));
    return ref.set(transformedData);
  }

  public createDocAutoId$ < T > (ref: AngularFirestoreCollection < T > , data: T, toFirestoreObjTransformer: (data: T) => any): Promise < DocumentReference > {
    const transformedData = this.addTimestamps(toFirestoreObjTransformer(data));
    return ref.add(transformedData);
  }



  // public createWithID$ < T > (ref: DocPredicate < T > , id: string, data: T, toFirestoreObjTransformer: (data: T) => any): Promise < void > {
  //   const timestamp = this.timestamp;
  //   const transformedData = toFirestoreObjTransformer(data);
  //   return this.doc(ref + id).set({
  //     ...transformedData,
  //     updatedAt: timestamp,
  //     createdAt: timestamp
  //   });
  // }

  // public create$ < T > (ref: CollectionPredicate < T > , data: T, toFirestoreObjTransformer: (data: T) => any): Promise < DocumentReference > {
  //   const timestamp = this.timestamp;
  //   const transformedData = toFirestoreObjTransformer(data);
  //   return this.col(ref).add({
  //     ...transformedData,
  //     updatedAt: timestamp,
  //     createdAt: timestamp
  //   });
  // }



  // == ---------
  // == UPDATE
  // == ---------

  public updateDoc$ < T > (ref: AngularFirestoreDocument < T > , newData: T, toFirestoreObjTransformer: (data: T) => any): Promise < void > {
    const timestamp = this.timestamp;
    const transformedData = toFirestoreObjTransformer(newData);
    return ref.update({
      ...transformedData,
      updatedAt: timestamp,
    });
  }

  public updateDocArrayField$ < T > (ref: AngularFirestoreDocument < T > , arrayFieldName: string, extraValue: any, withCountVar = false): Promise < void > {
    const timestamp = this.timestamp;
    const updatedObj = {
      updatedAt: timestamp,
    };
    updatedObj[arrayFieldName] = firestore.FieldValue.arrayUnion(extraValue);
    if (withCountVar) {
      updatedObj[arrayFieldName + '_count'] = firestore.FieldValue.increment(1);
    }
    return ref.update(updatedObj as unknown as Partial < T > );
  }


  // == ---------
  // == REMOVE
  // == ---------

  public removeDoc$(ref: AngularFirestoreDocument): Promise < void > {
    return ref.delete();
  }

  public removeDocArrayField$ < T > (ref: AngularFirestoreDocument < T > , arrayFieldName: string, valueToRemove: any, withCountVar = false): Promise < void > {
    const timestamp = this.timestamp;
    const updatedObj = {
      updatedAt: timestamp,
    };
    updatedObj[arrayFieldName] = firestore.FieldValue.arrayRemove(valueToRemove);
    if (withCountVar) {
      updatedObj[arrayFieldName + '_count'] = firestore.FieldValue.increment(-1);
    }
    return ref.update(updatedObj as unknown as Partial < T > );
  }



  // public update$ < T > (ref: DocPredicate < T > , data: T, toFirestoreObjTransformer: (data: T) => any): Promise < void > {
  //   const timestamp = this.timestamp;
  //   const transformedData = toFirestoreObjTransformer(data);
  //   return this.doc(ref).update({
  //     ...transformedData,
  //     updatedAt: timestamp,
  //   });
  // }


}
