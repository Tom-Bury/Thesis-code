import {
  Injectable
} from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore,
  DocumentReference,
  QueryFn
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


type CollectionPredicate < T > = string | AngularFirestoreCollection < T > ;
type DocPredicate < T > = string | AngularFirestoreDocument < T > ;

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private afStore: AngularFirestore
  ) {}


  public col < T >(ref: CollectionPredicate < T > , queryFn ? ): AngularFirestoreCollection < T > {
    return typeof ref === 'string' ? this.afStore.collection < T > (ref, queryFn) : ref;
  }

  public doc < T >(ref: DocPredicate < T > ): AngularFirestoreDocument < T > {
    return typeof ref === 'string' ? this.afStore.doc < T > (ref) : ref;
  }


  // --------
  // READS
  // --------

  public doc$ < T >(ref: DocPredicate < T > ): Observable < T > {
    return this.doc(ref).snapshotChanges().pipe(
      map(doc => {
        return doc.payload.data() as T;
      }));
  }

  // this.tasksCollection.snapshotChanges().pipe(
  //   map(
  //       changes => { return changes.map(a => {
  //       const data = a.payload.doc.data() as Task;
  //       data.id = a.payload.doc.id;
  //       return data;
  //     });
  //     }
  //   ))

  public col$ < T >(ref: CollectionPredicate < T > , toFrontendObjectTransformer: (data: any) => T, queryFn?: QueryFn ): Observable < T[] > {
    return this.col(ref, queryFn).snapshotChanges().pipe(
      map(docs => {
        return docs.map(a => toFrontendObjectTransformer(a.payload.doc.data()));
      })
    );
  }






  // ---------
  // WRITES
  // ---------

  private get timestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  public createWithID$ < T >(ref: DocPredicate < T > , id: string, data: T, toFirestoreObjTransformer: (data: T) => any): Promise < void > {
    const timestamp = this.timestamp;
    const transformedData = toFirestoreObjTransformer(data);
    return this.doc(ref + id).set({
      ...transformedData,
      updatedAt: timestamp,
      createdAt: timestamp
    });
  }

  public create$ < T >(ref: CollectionPredicate < T > , data: T, toFirestoreObjTransformer: (data: T) => any): Promise < DocumentReference > {
    const timestamp = this.timestamp;
    const transformedData = toFirestoreObjTransformer(data);
    return this.col(ref).add({
      ...transformedData,
      updatedAt: timestamp,
      createdAt: timestamp
    });
  }


  public update$ < T >(ref: DocPredicate < T > , data: T, toFirestoreObjTransformer: (data: T) => any): Promise < void > {
    const timestamp = this.timestamp;
    const transformedData = toFirestoreObjTransformer(data);
    return this.doc(ref).update({
      ...transformedData,
      updatedAt: timestamp,
    });
  }


}
