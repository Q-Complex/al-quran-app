/**
 * KV Storage utils
 */

import { Storage } from 'expo-sqlite/kv-store'

import { TVerse } from '../types'

const KVStore = {
  bookmarks: {
    /**
     * Load bookmarks
     * @param callback called when succeeded
     * @returns void
     */
    load: async (callback: (value: string | null) => void) =>
      await KVStore.utils.get('bookmarks', (v) => callback(v)),

    /**
     * Save bookmarks
     * @param bookmarks bookmarks to be saved
     * @param callback called when succeeded
     * @returns void
     */
    save: async (bookmarks: string, callback: () => void) =>
      await KVStore.utils.set('bookmarks', bookmarks, () => callback()),

    /**
     * Add a bookmark
     * @param item to be added
     * @param bookmarks current bookmarks
     * @param callback called when succeeded
     * @returns void
     */
    add: async (
      item: TVerse,
      bookmarks: TVerse[],
      callback: (bookmarks: string) => void,
    ) => KVStore.bookmarks.toggle(item, bookmarks, callback),

    /**
     * Remove a bookmark
     * @param item to be removed
     * @param bookmarks current bookmarks
     * @param callback called when succeeded
     * @returns void
     */
    remove: async (
      item: TVerse,
      bookmarks: TVerse[],
      callback: (bookmarks: string) => void,
    ) => KVStore.bookmarks.toggle(item, bookmarks, callback),

    /**
     * Adds a bookmark if not exists, removes otherwise
     * @param item to be added or removed
     * @param bookmarks current bookmarks
     * @param callback called when succeeded
     * @returns void
     */
    toggle: async (
      item: TVerse,
      bookmarks: TVerse[],
      callback: (bookmarks: string) => void,
    ) => {
      const newBookmarks = !bookmarks.map((v) => v.id).includes(item.id)
        ? JSON.stringify([...bookmarks, item])
        : JSON.stringify(bookmarks.filter((b) => b.id !== item.id))

      return KVStore.bookmarks.save(newBookmarks, () => callback(newBookmarks))
    },
  },
  history: {
    /**
     * Load search history
     * @param callback called when succeeded
     * @returns void
     */
    load: async (callback: (value: string | null) => void) =>
      await KVStore.utils.get('history', callback),

    /**
     * Save history
     * @param value to be set
     * @param callback called when succeeded
     * @returns void
     */
    save: async (value: string, callback: () => void) =>
      await KVStore.utils.set('history', value, callback),

    /**
     * Delete search history
     * @param callback called when succeeded
     * @returns void
     */
    delete: async (callback: () => void) =>
      await KVStore.utils.set('history', JSON.stringify([]), callback),
  },
  settings: {
    /**
     * Load settings
     * @param callback called when succeeded
     * @returns void
     */
    load: async (callback: (value: string | null) => void) =>
      await KVStore.utils.get('settings', callback),

    /**
     * Save settings
     * @param settings to be saved
     * @param callback called when succeeded
     * @returns void
     */
    save: async (settings: string, callback: () => void) =>
      await KVStore.utils.set('settings', settings, () => callback()),
  },
  utils: {
    /**
     * Get value for key
     * @param key key of value
     * @param callback called when succeeded
     * @returns void
     */
    get: async (key: string, callback: (value: string | null) => void) =>
      await Storage.getItemAsync(key)
        .then((v) => callback(v))
        .catch((err) => console.error(err)),

    /**
     * Set value for key
     * @param key key of value
     * @param value value to set
     * @param callback called when succeeded
     * @returns void
     */
    set: async (key: string, value: string, callback: () => void) =>
      await Storage.setItemAsync(key, value)
        .then(() => callback())
        .catch((err) => console.error(err)),
  },
}

export { KVStore }
