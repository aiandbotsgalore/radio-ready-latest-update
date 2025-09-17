import type { NamedProject, CurrentSession, ProjectData } from '../types';
import { NEUTRON_5_MANUAL } from './initialData';

const DB_NAME = 'PluginManualsDB';
const MANUAL_STORE_NAME = 'manuals';
const SESSION_STORE_NAME = 'session';
const PROJECTS_STORE_NAME = 'projects';
const DB_VERSION = 3; // Incremented version for new schema

let db: IDBDatabase | null = null;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      reject('Error opening IndexedDB.');
    };

    request.onsuccess = () => {
      db = request.result;

      // --- Seed initial data if not present ---
      try {
        const manualTx = db.transaction(MANUAL_STORE_NAME, 'readwrite');
        const manualStore = manualTx.objectStore(MANUAL_STORE_NAME);
        const getReq = manualStore.get(NEUTRON_5_MANUAL.name);
        
        getReq.onsuccess = () => {
          if (!getReq.result) {
            console.log(`Seeding knowledge base with: ${NEUTRON_5_MANUAL.name}`);
            manualStore.put(NEUTRON_5_MANUAL);
          }
        };
      } catch (e) {
        console.error("Failed to seed initial data:", e);
      }
      // --- End seeding ---

      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(MANUAL_STORE_NAME)) {
        dbInstance.createObjectStore(MANUAL_STORE_NAME, { keyPath: 'name' });
      }
      if (!dbInstance.objectStoreNames.contains(SESSION_STORE_NAME)) {
        dbInstance.createObjectStore(SESSION_STORE_NAME, { keyPath: 'id' });
      }
       if (!dbInstance.objectStoreNames.contains(PROJECTS_STORE_NAME)) {
        const projectsStore = dbInstance.createObjectStore(PROJECTS_STORE_NAME, { keyPath: 'id' });
        projectsStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

// --- Manuals Management ---

export const addManual = async (name: string, content: string): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(MANUAL_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(MANUAL_STORE_NAME);
  store.put({ name, content });

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getAllManuals = async (): Promise<{ name: string; content: string }[]> => {
  const db = await openDB();
  const transaction = db.transaction(MANUAL_STORE_NAME, 'readonly');
  const store = transaction.objectStore(MANUAL_STORE_NAME);
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteManual = async (name: string): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction(MANUAL_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(MANUAL_STORE_NAME);
  store.delete(name);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

// --- Current Session Management (for auto-save and crash recovery) ---

export const saveCurrentSession = async (state: ProjectData): Promise<void> => {
    const db = await openDB();
    const transaction = db.transaction(SESSION_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(SESSION_STORE_NAME);
    store.put({ id: 'current_session', ...state });

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};

export const loadCurrentSession = async (): Promise<CurrentSession | null> => {
    const db = await openDB();
    const transaction = db.transaction(SESSION_STORE_NAME, 'readonly');
    const store = transaction.objectStore(SESSION_STORE_NAME);
    const request = store.get('current_session');

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
};

export const clearCurrentSession = async (): Promise<void> => {
    const db = await openDB();
    const transaction = db.transaction(SESSION_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(SESSION_STORE_NAME);
    store.delete('current_session');

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};


// --- Named Project Management ---

export const saveNamedProject = async (name: string, state: ProjectData, id?: string): Promise<NamedProject> => {
    const db = await openDB();
    const transaction = db.transaction(PROJECTS_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(PROJECTS_STORE_NAME);
    const project: NamedProject = {
        id: id || crypto.randomUUID(),
        name,
        timestamp: Date.now(),
        ...state
    };
    store.put(project);

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(project);
        transaction.onerror = () => reject(transaction.error);
    });
};

export const getAllNamedProjects = async (): Promise<NamedProject[]> => {
    const db = await openDB();
    const transaction = db.transaction(PROJECTS_STORE_NAME, 'readonly');
    const store = transaction.objectStore(PROJECTS_STORE_NAME);
    const index = store.index('timestamp'); // Use index to sort by most recent
    const request = index.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result.reverse()); // Reverse to show newest first
        request.onerror = () => reject(request.error);
    });
};

export const loadNamedProject = async (id: string): Promise<NamedProject | null> => {
    const db = await openDB();
    const transaction = db.transaction(PROJECTS_STORE_NAME, 'readonly');
    const store = transaction.objectStore(PROJECTS_STORE_NAME);
    const request = store.get(id);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
};

export const deleteNamedProject = async (id: string): Promise<void> => {
    const db = await openDB();
    const transaction = db.transaction(PROJECTS_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(PROJECTS_STORE_NAME);
    store.delete(id);

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};