import { BehaviorSubject } from 'rxjs';
export declare const batchInProgress: BehaviorSubject<boolean>;
export declare const batchDone$: import("rxjs").Observable<boolean>;
export declare function emitOnce<T>(cb: () => T): T;
