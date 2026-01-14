/**
 * IndexedDB Service for Shulte Training Records
 * Provides auto-incrementing IDs and efficient storage
 */

const DB_NAME = 'shuerte_db'
const DB_VERSION = 1
const STORE_NAME = 'records'

let dbPromise = null

/**
 * Initialize the IndexedDB database
 * @returns {Promise<IDBDatabase>}
 */
export function initDB() {
  if (dbPromise) {
    return dbPromise
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      console.error('Failed to open IndexedDB:', request.error)
      reject(request.error)
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      // Create records store with auto-increment key
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        })

        // Create indexes for efficient queries
        store.createIndex('timestamp', 'timestamp', { unique: false })
        store.createIndex('result', 'result', { unique: false })
        store.createIndex('replayOf', 'replayOf', { unique: false })
        store.createIndex('mode', 'mode', { unique: false })
      }
    }
  })

  return dbPromise
}

/**
 * Get a database transaction
 * @param {string} mode - 'readonly' or 'readwrite'
 * @returns {Promise<IDBObjectStore>}
 */
async function getStore(mode = 'readonly') {
  const db = await initDB()
  const transaction = db.transaction(STORE_NAME, mode)
  return transaction.objectStore(STORE_NAME)
}

/**
 * Add a new record to the database
 * @param {Object} record - The record to add (ID will be auto-generated)
 * @returns {Promise<number>} - The auto-generated ID of the new record
 */
export async function addRecord(record) {
  const store = await getStore('readwrite')

  return new Promise((resolve, reject) => {
    const request = store.add(record)

    request.onsuccess = () => {
      resolve(request.result) // Returns the auto-generated key
    }

    request.onerror = () => {
      console.error('Failed to add record:', request.error)
      reject(request.error)
    }
  })
}

/**
 * Update an existing record
 * @param {Object} record - The record to update (must include id)
 * @returns {Promise<void>}
 */
export async function updateRecord(record) {
  const store = await getStore('readwrite')

  return new Promise((resolve, reject) => {
    const request = store.put(record)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      console.error('Failed to update record:', request.error)
      reject(request.error)
    }
  })
}

/**
 * Delete a record by ID
 * @param {number} id - The record ID to delete
 * @returns {Promise<void>}
 */
export async function deleteRecord(id) {
  const store = await getStore('readwrite')

  return new Promise((resolve, reject) => {
    const request = store.delete(id)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      console.error('Failed to delete record:', request.error)
      reject(request.error)
    }
  })
}

/**
 * Get a single record by ID
 * @param {number} id - The record ID
 * @returns {Promise<Object|null>}
 */
export async function getRecord(id) {
  const store = await getStore('readonly')

  return new Promise((resolve, reject) => {
    const request = store.get(id)

    request.onsuccess = () => {
      resolve(request.result || null)
    }

    request.onerror = () => {
      console.error('Failed to get record:', request.error)
      reject(request.error)
    }
  })
}

/**
 * Get all records, sorted by timestamp (newest first)
 * @returns {Promise<Array>}
 */
export async function getAllRecords() {
  const store = await getStore('readonly')

  return new Promise((resolve, reject) => {
    const index = store.index('timestamp')
    const request = index.getAll()

    request.onsuccess = () => {
      // Reverse to get newest first
      resolve(request.result.reverse())
    }

    request.onerror = () => {
      console.error('Failed to get all records:', request.error)
      reject(request.error)
    }
  })
}

/**
 * Get records by replayOf (all replays of a specific record)
 * @param {number} originalId - The original record ID
 * @returns {Promise<Array>}
 */
export async function getReplaysOf(originalId) {
  const store = await getStore('readonly')

  return new Promise((resolve, reject) => {
    const index = store.index('replayOf')
    const request = index.getAll(originalId)

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      console.error('Failed to get replays:', request.error)
      reject(request.error)
    }
  })
}

/**
 * Clear all records
 * @returns {Promise<void>}
 */
export async function clearAllRecords() {
  const store = await getStore('readwrite')

  return new Promise((resolve, reject) => {
    const request = store.clear()

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      console.error('Failed to clear records:', request.error)
      reject(request.error)
    }
  })
}

/**
 * Get the count of all records
 * @returns {Promise<number>}
 */
export async function getRecordCount() {
  const store = await getStore('readonly')

  return new Promise((resolve, reject) => {
    const request = store.count()

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      console.error('Failed to get count:', request.error)
      reject(request.error)
    }
  })
}

/**
 * Get the last record ID (highest ID)
 * @returns {Promise<number|null>}
 */
export async function getLastRecordId() {
  const store = await getStore('readonly')

  return new Promise((resolve, reject) => {
    const request = store.openCursor(null, 'prev')

    request.onsuccess = () => {
      const cursor = request.result
      if (cursor) {
        resolve(cursor.key)
      } else {
        resolve(null)
      }
    }

    request.onerror = () => {
      console.error('Failed to get last ID:', request.error)
      reject(request.error)
    }
  })
}
