import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AttendanceRecord } from '../types';
import { loadLocalCache, saveLocalCache } from './storage';

const COLLECTION_NAME = 'attendance_records';

export function subscribeToAttendanceRecords(
  onData: (records: AttendanceRecord[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    return onSnapshot(
      q,
      (snapshot) => {
        const records: AttendanceRecord[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            district: data.district,
            males: Number(data.males) || 0,
            females: Number(data.females) || 0,
            total: (Number(data.males) || 0) + (Number(data.females) || 0),
            date: data.date,
            serviceType: data.serviceType || 'AYAC 2026',
            reportedBy: data.reportedBy || '',
            remarks: data.remarks || '',
            createdAt: data.createdAt || Date.now(),
            updatedAt: data.updatedAt || Date.now(),
          } as AttendanceRecord;
        });

        // Sort records by createdAt descending
        records.sort((a, b) => b.createdAt - a.createdAt);

        // Update local cache as backup
        saveLocalCache(records);
        onData(records);
      },
      (error) => {
        console.error('Firestore subscription error:', error);
        if (onError) onError(error);
        // Fallback to local cache if Firestore network error
        const local = loadLocalCache();
        onData(local);
      }
    );
  } catch (err) {
    console.error('Failed to set up Firestore listener:', err);
    const local = loadLocalCache();
    onData(local);
    return () => {};
  }
}

export async function fetchFirestoreRecords(): Promise<AttendanceRecord[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const records: AttendanceRecord[] = querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        district: data.district,
        males: Number(data.males) || 0,
        females: Number(data.females) || 0,
        total: (Number(data.males) || 0) + (Number(data.females) || 0),
        date: data.date,
        serviceType: data.serviceType || 'AYAC 2026',
        reportedBy: data.reportedBy || '',
        remarks: data.remarks || '',
        createdAt: data.createdAt || Date.now(),
        updatedAt: data.updatedAt || Date.now(),
      } as AttendanceRecord;
    });

    records.sort((a, b) => b.createdAt - a.createdAt);
    saveLocalCache(records);
    return records;
  } catch (err) {
    console.error('Error fetching Firestore records:', err);
    return loadLocalCache();
  }
}

export async function saveRecordToFirestore(
  recordData: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>,
  id?: string
): Promise<void> {
  const maleNum = Math.max(0, Number(recordData.males) || 0);
  const femaleNum = Math.max(0, Number(recordData.females) || 0);
  const computedTotal = maleNum + femaleNum;

  let docId = id;

  if (!docId) {
    // Check if record exists for same district and date
    const existing = await fetchFirestoreRecords();
    const match = existing.find(
      (r) => r.district === recordData.district && r.date === recordData.date
    );
    if (match) {
      docId = match.id;
    } else {
      docId = `rec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    }
  }

  const docRef = doc(db, COLLECTION_NAME, docId);
  await setDoc(docRef, {
    district: recordData.district,
    males: maleNum,
    females: femaleNum,
    total: computedTotal,
    date: recordData.date,
    serviceType: recordData.serviceType || 'AYAC 2026',
    reportedBy: recordData.reportedBy || '',
    remarks: recordData.remarks || '',
    updatedAt: Date.now(),
    createdAt: Date.now(),
  }, { merge: true });
}

export async function deleteRecordFromFirestore(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

export async function resetFirestoreRecordsToZero(): Promise<void> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  const batch = writeBatch(db);
  snapshot.docs.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });
  await batch.commit();
  saveLocalCache([]);
}
