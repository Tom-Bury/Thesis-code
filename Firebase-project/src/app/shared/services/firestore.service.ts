import {
  Injectable
} from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore,
  QueryFn,
  DocumentReference,
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
import { ForumPost } from '../interfaces/forum/forum-post.model';


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

  public getForumPostsCol(queryFn?: QueryFn): AngularFirestoreCollection<ForumPost> {
    return this.col<ForumPost>(this.PREFIX + '/collections/forum-posts', queryFn);
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
    return ref.valueChanges({idField: 'ID'}).pipe(
      map(d => {
        return d.map(dd => {
          if (Object.keys(dd).includes('createdAt')) {
            return toFrontendObjectTransformer(dd);
          }
        });
      })
    );
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






  // ---------
  // WRITES
  // ---------

  private get timestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  public createDoc$ < T > (ref: AngularFirestoreDocument < T > , data: T, toFirestoreObjTransformer: (data: T) => any): Promise < void > {
    const timestamp = this.timestamp;
    const transformedData = toFirestoreObjTransformer(data);
    return ref.set({
      ...transformedData,
      updatedAt: timestamp,
      createdAt: timestamp
    });
  }

  public createDocAutoId$ < T > (ref: AngularFirestoreCollection < T > , data: T, toFirestoreObjTransformer: (data: T) => any): Promise < DocumentReference > {
    const timestamp = this.timestamp;
    const transformedData = toFirestoreObjTransformer(data);
    return ref.add({
      ...transformedData,
      updatedAt: timestamp,
      createdAt: timestamp
    });
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


  // public update$ < T > (ref: DocPredicate < T > , data: T, toFirestoreObjTransformer: (data: T) => any): Promise < void > {
  //   const timestamp = this.timestamp;
  //   const transformedData = toFirestoreObjTransformer(data);
  //   return this.doc(ref).update({
  //     ...transformedData,
  //     updatedAt: timestamp,
  //   });
  // }


}
