import type { SiteContent } from './content-store'
export type Pending = Record<string, { b64: string; preview: string }>
export interface Draft { content: SiteContent; pending: Pending; base: string; savedAt: number }
function openDb(): Promise<IDBDatabase> { return new Promise((resolve,reject)=>{ const r=indexedDB.open('birlik-admin-drafts',1); r.onupgradeneeded=()=>r.result.createObjectStore('drafts'); r.onsuccess=()=>resolve(r.result); r.onerror=()=>reject(r.error) }) }
async function operation<T>(mode: IDBTransactionMode, fn:(s:IDBObjectStore)=>IDBRequest<T>):Promise<T>{const db=await openDb();try{return await new Promise<T>((resolve,reject)=>{const tx=db.transaction('drafts',mode);const r=fn(tx.objectStore('drafts'));tx.oncomplete=()=>resolve(r.result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}finally{db.close()}}
export const loadDraft=()=>operation<Draft|undefined>('readonly',s=>s.get('current'))
export const saveDraft=(d:Draft)=>operation('readwrite',s=>s.put(d,'current'))
export const clearDraft=()=>operation('readwrite',s=>s.delete('current'))
export function downloadBackup(content:SiteContent,pending:Pending){const blob=new Blob([JSON.stringify({version:1,content,pending,createdAt:new Date().toISOString()},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`birlik-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
