"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const Observable_1 = require("rxjs/Observable");
const defer_1 = require("rxjs/observable/defer");
const empty_1 = require("rxjs/observable/empty");
const from_1 = require("rxjs/observable/from");
const of_1 = require("rxjs/observable/of");
const operators_1 = require("rxjs/operators");
const exception_1 = require("../exception/exception");
const action_1 = require("../tree/action");
const Noop = function () { };
class SimpleSinkBase {
    constructor() {
        this.preCommitAction = Noop;
        this.postCommitAction = Noop;
        this.preCommit = Noop;
        this.postCommit = Noop;
    }
    _fileAlreadyExistException(path) {
        throw new exception_1.FileAlreadyExistException(path);
    }
    _fileDoesNotExistException(path) {
        throw new exception_1.FileDoesNotExistException(path);
    }
    _validateOverwriteAction(action) {
        return this._validateFileExists(action.path)
            .pipe(operators_1.map(b => { if (!b) {
            this._fileDoesNotExistException(action.path);
        } }));
    }
    _validateCreateAction(action) {
        return this._validateFileExists(action.path)
            .pipe(operators_1.map(b => { if (b) {
            this._fileAlreadyExistException(action.path);
        } }));
    }
    _validateRenameAction(action) {
        return this._validateFileExists(action.path).pipe(operators_1.map(b => { if (!b) {
            this._fileDoesNotExistException(action.path);
        } }), operators_1.mergeMap(() => this._validateFileExists(action.to)), operators_1.map(b => { if (b) {
            this._fileAlreadyExistException(action.to);
        } }));
    }
    _validateDeleteAction(action) {
        return this._validateFileExists(action.path)
            .pipe(operators_1.map(b => { if (!b) {
            this._fileDoesNotExistException(action.path);
        } }));
    }
    validateSingleAction(action) {
        switch (action.kind) {
            case 'o': return this._validateOverwriteAction(action);
            case 'c': return this._validateCreateAction(action);
            case 'r': return this._validateRenameAction(action);
            case 'd': return this._validateDeleteAction(action);
            default: throw new action_1.UnknownActionException(action);
        }
    }
    commitSingleAction(action) {
        return empty_1.empty().pipe(operators_1.concat(new Observable_1.Observable(observer => {
            return this.validateSingleAction(action).subscribe(observer);
        })), operators_1.concat(new Observable_1.Observable(observer => {
            let committed = null;
            switch (action.kind) {
                case 'o':
                    committed = this._overwriteFile(action.path, action.content);
                    break;
                case 'c':
                    committed = this._createFile(action.path, action.content);
                    break;
                case 'r':
                    committed = this._renameFile(action.path, action.to);
                    break;
                case 'd':
                    committed = this._deleteFile(action.path);
                    break;
            }
            if (committed) {
                committed.subscribe(observer);
            }
            else {
                observer.complete();
            }
        })));
    }
    commit(tree) {
        const actions = from_1.from(tree.actions);
        return (this.preCommit() || empty_1.empty()).pipe(operators_1.concat(defer_1.defer(() => actions)), operators_1.concatMap((action) => {
            const maybeAction = this.preCommitAction(action);
            if (!maybeAction) {
                return of_1.of(action);
            }
            else if (action_1.isAction(maybeAction)) {
                return of_1.of(maybeAction);
            }
            else {
                return maybeAction;
            }
        }), operators_1.concatMap((action) => {
            return this.commitSingleAction(action).pipe(operators_1.ignoreElements(), operators_1.concat([action]));
        }), operators_1.concatMap((action) => this.postCommitAction(action) || empty_1.empty()), operators_1.concat(defer_1.defer(() => this._done())), operators_1.concat(defer_1.defer(() => this.postCommit() || empty_1.empty())));
    }
}
exports.SimpleSinkBase = SimpleSinkBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luay5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3NyYy9zaW5rL3NpbmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxnREFBNkM7QUFDN0MsaURBQWlFO0FBQ2pFLGlEQUE4QztBQUM5QywrQ0FBOEQ7QUFDOUQsMkNBQXdEO0FBQ3hELDhDQU13QjtBQUN4QixzREFBOEY7QUFDOUYsMkNBUXdCO0FBYXhCLE1BQU0sSUFBSSxHQUFHLGNBQVksQ0FBQyxDQUFDO0FBRzNCO0lBQUE7UUFDRSxvQkFBZSxHQUcyQyxJQUFJLENBQUM7UUFDL0QscUJBQWdCLEdBQWdELElBQUksQ0FBQztRQUNyRSxjQUFTLEdBQWtDLElBQUksQ0FBQztRQUNoRCxlQUFVLEdBQWtDLElBQUksQ0FBQztJQTZGbkQsQ0FBQztJQWxGVywwQkFBMEIsQ0FBQyxJQUFZO1FBQy9DLE1BQU0sSUFBSSxxQ0FBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBQ1MsMEJBQTBCLENBQUMsSUFBWTtRQUMvQyxNQUFNLElBQUkscUNBQXlCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVTLHdCQUF3QixDQUFDLE1BQTJCO1FBQzVELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQzthQUN6QyxJQUFJLENBQUMsZUFBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25GLENBQUM7SUFDUyxxQkFBcUIsQ0FBQyxNQUF3QjtR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QUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxPQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUIsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxpQkFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsTUFBTSxDQUFDLE9BQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNuQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sTUFBTSxDQUFDLFdBQVcsQ0FBQztZQUNyQixDQUFDO1FBQ0gsQ0FBQyxDQUFDLEVBQ0YscUJBQVMsQ0FBQyxDQUFDLE1BQWMsRUFBRSxFQUFFO1lBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUN6QywwQkFBYyxFQUFFLEVBQ2hCLGtCQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsQ0FBQyxDQUFDLEVBQ0YscUJBQVMsQ0FBQyxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLGFBQUssRUFBUSxDQUFDLEVBQzdFLGtCQUFNLENBQUMsYUFBZSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQzNDLGtCQUFNLENBQUMsYUFBZSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxhQUFLLEVBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RSxDQUFDO0NBQ0Y7QUFwR0Qsd0NBb0dDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBkZWZlciBhcyBkZWZlck9ic2VydmFibGUgfSBmcm9tICdyeGpzL29ic2VydmFibGUvZGVmZXInO1xuaW1wb3J0IHsgZW1wdHkgfSBmcm9tICdyeGpzL29ic2VydmFibGUvZW1wdHknO1xuaW1wb3J0IHsgZnJvbSBhcyBvYnNlcnZhYmxlRnJvbSB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZS9mcm9tJztcbmltcG9ydCB7IG9mIGFzIG9ic2VydmFibGVPZiB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZS9vZic7XG5pbXBvcnQge1xuICBjb25jYXQsXG4gIGNvbmNhdE1hcCxcbiAgaWdub3JlRWxlbWVudHMsXG4gIG1hcCxcbiAgbWVyZ2VNYXAsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEZpbGVBbHJlYWR5RXhpc3RFeGNlcHRpb24sIEZpbGVEb2VzTm90RXhpc3RFeGNlcHRpb24gfSBmcm9tICcuLi9leGNlcHRpb24vZXhjZXB0aW9uJztcbmltcG9ydCB7XG4gIEFjdGlvbixcbiAgQ3JlYXRlRmlsZUFjdGlvbixcbiAgRGVsZXRlRmlsZUFjdGlvbixcbiAgT3ZlcndyaXRlRmlsZUFjdGlvbixcbiAgUmVuYW1lRmlsZUFjdGlvbixcbiAgVW5rbm93bkFjdGlvbkV4Y2VwdGlvbixcbiAgaXNBY3Rpb24sXG59IGZyb20gJy4uL3RyZWUvYWN0aW9uJztcbmltcG9ydCB7IFRyZWUgfSBmcm9tICcuLi90cmVlL2ludGVyZmFjZSc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBTaW5rIHtcbiAgcHJlQ29tbWl0QWN0aW9uOiAoYWN0aW9uOiBBY3Rpb24pID0+IHZvaWQgfCBQcm9taXNlTGlrZTxBY3Rpb24+IHwgT2JzZXJ2YWJsZTxBY3Rpb24+IHwgQWN0aW9uO1xuICBwcmVDb21taXQ6ICgpID0+IHZvaWQgfCBPYnNlcnZhYmxlPHZvaWQ+O1xuICBwb3N0Q29tbWl0OiAoKSA9PiB2b2lkIHwgT2JzZXJ2YWJsZTx2b2lkPjtcblxuICBjb21taXQodHJlZTogVHJlZSk6IE9ic2VydmFibGU8dm9pZD47XG59XG5cblxuY29uc3QgTm9vcCA9IGZ1bmN0aW9uKCkge307XG5cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNpbXBsZVNpbmtCYXNlIGltcGxlbWVudHMgU2luayB7XG4gIHByZUNvbW1pdEFjdGlvbjogKGFjdGlvbjogQWN0aW9uKSA9PiB2b2lkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBBY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFByb21pc2VMaWtlPEFjdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IE9ic2VydmFibGU8QWN0aW9uPiA9IE5vb3A7XG4gIHBvc3RDb21taXRBY3Rpb246IChhY3Rpb246IEFjdGlvbikgPT4gdm9pZCB8IE9ic2VydmFibGU8dm9pZD4gPSBOb29wO1xuICBwcmVDb21taXQ6ICgpID0+IHZvaWQgfCBPYnNlcnZhYmxlPHZvaWQ+ID0gTm9vcDtcbiAgcG9zdENvbW1pdDogKCkgPT4gdm9pZCB8IE9ic2VydmFibGU8dm9pZD4gPSBOb29wO1xuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfdmFsaWRhdGVGaWxlRXhpc3RzKHA6IHN0cmluZyk6IE9ic2VydmFibGU8Ym9vbGVhbj47XG5cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9vdmVyd3JpdGVGaWxlKHBhdGg6IHN0cmluZywgY29udGVudDogQnVmZmVyKTogT2JzZXJ2YWJsZTx2b2lkPjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9jcmVhdGVGaWxlKHBhdGg6IHN0cmluZywgY29udGVudDogQnVmZmVyKTogT2JzZXJ2YWJsZTx2b2lkPjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9yZW5hbWVGaWxlKHBhdGg6IHN0cmluZywgdG86IHN0cmluZyk6IE9ic2VydmFibGU8dm9pZD47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfZGVsZXRlRmlsZShwYXRoOiBzdHJpbmcpOiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfZG9uZSgpOiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG4gIHByb3RlY3RlZCBfZmlsZUFscmVhZHlFeGlzdEV4Y2VwdGlvbihwYXRoOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aHJvdyBuZXcgRmlsZUFscmVhZHlFeGlzdEV4Y2VwdGlvbihwYXRoKTtcbiAgfVxuICBwcm90ZWN0ZWQgX2ZpbGVEb2VzTm90RXhpc3RFeGNlcHRpb24ocGF0aDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IEZpbGVEb2VzTm90RXhpc3RFeGNlcHRpb24ocGF0aCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3ZhbGlkYXRlT3ZlcndyaXRlQWN0aW9uKGFjdGlvbjogT3ZlcndyaXRlRmlsZUFjdGlvbik6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl92YWxpZGF0ZUZpbGVFeGlzdHMoYWN0aW9uLnBhdGgpXG4gICAgICAucGlwZShtYXAoYiA9PiB7IGlmICghYikgeyB0aGlzLl9maWxlRG9lc05vdEV4aXN0RXhjZXB0aW9uKGFjdGlvbi5wYXRoKTsgfSB9KSk7XG4gIH1cbiAgcHJvdGVjdGVkIF92YWxpZGF0ZUNyZWF0ZUFjdGlvbihhY3Rpb246IENyZWF0ZUZpbGVBY3Rpb24pOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fdmFsaWRhdGVGaWxlRXhpc3RzKGFjdGlvbi5wYXRoKVxuICAgICAgLnBpcGUobWFwKGIgPT4geyBpZiAoYikgeyB0aGlzLl9maWxlQWxyZWFkeUV4aXN0RXhjZXB0aW9uKGFjdGlvbi5wYXRoKTsgfSB9KSk7XG4gIH1cbiAgcHJvdGVjdGVkIF92YWxpZGF0ZVJlbmFtZUFjdGlvbihhY3Rpb246IFJlbmFtZUZpbGVBY3Rpb24pOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fdmFsaWRhdGVGaWxlRXhpc3RzKGFjdGlvbi5wYXRoKS5waXBlKFxuICAgICAgbWFwKGIgPT4geyBpZiAoIWIpIHsgdGhpcy5fZmlsZURvZXNOb3RFeGlzdEV4Y2VwdGlvbihhY3Rpb24ucGF0aCk7IH0gfSksXG4gICAgICBtZXJnZU1hcCgoKSA9PiB0aGlzLl92YWxpZGF0ZUZpbGVFeGlzdHMoYWN0aW9uLnRvKSksXG4gICAgICBtYXAoYiA9PiB7IGlmIChiKSB7IHRoaXMuX2ZpbGVBbHJlYWR5RXhpc3RFeGNlcHRpb24oYWN0aW9uLnRvKTsgfSB9KSk7XG4gIH1cbiAgcHJvdGVjdGVkIF92YWxpZGF0ZURlbGV0ZUFjdGlvbihhY3Rpb246IERlbGV0ZUZpbGVBY3Rpb24pOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fdmFsaWRhdGVGaWxlRXhpc3RzKGFjdGlvbi5wYXRoKVxuICAgICAgLnBpcGUobWFwKGIgPT4geyBpZiAoIWIpIHsgdGhpcy5fZmlsZURvZXNOb3RFeGlzdEV4Y2VwdGlvbihhY3Rpb24ucGF0aCk7IH0gfSkpO1xuICB9XG5cbiAgdmFsaWRhdGVTaW5nbGVBY3Rpb24oYWN0aW9uOiBBY3Rpb24pOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICBzd2l0Y2ggKGFjdGlvbi5raW5kKSB7XG4gICAgICBjYXNlICdvJzogcmV0dXJuIHRoaXMuX3ZhbGlkYXRlT3ZlcndyaXRlQWN0aW9uKGFjdGlvbik7XG4gICAgICBjYXNlICdjJzogcmV0dXJuIHRoaXMuX3ZhbGlkYXRlQ3JlYXRlQWN0aW9uKGFjdGlvbik7XG4gICAgICBjYXNlICdyJzogcmV0dXJuIHRoaXMuX3ZhbGlkYXRlUmVuYW1lQWN0aW9uKGFjdGlvbik7XG4gICAgICBjYXNlICdkJzogcmV0dXJuIHRoaXMuX3ZhbGlkYXRlRGVsZXRlQWN0aW9uKGFjdGlvbik7XG4gICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgVW5rbm93bkFjdGlvbkV4Y2VwdGlvbihhY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIGNvbW1pdFNpbmdsZUFjdGlvbihhY3Rpb246IEFjdGlvbik6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiBlbXB0eTx2b2lkPigpLnBpcGUoXG4gICAgICBjb25jYXQobmV3IE9ic2VydmFibGU8dm9pZD4ob2JzZXJ2ZXIgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZVNpbmdsZUFjdGlvbihhY3Rpb24pLnN1YnNjcmliZShvYnNlcnZlcik7XG4gICAgICB9KSksXG4gICAgICBjb25jYXQobmV3IE9ic2VydmFibGU8dm9pZD4ob2JzZXJ2ZXIgPT4ge1xuICAgICAgICBsZXQgY29tbWl0dGVkID0gbnVsbDtcbiAgICAgICAgc3dpdGNoIChhY3Rpb24ua2luZCkge1xuICAgICAgICAgIGNhc2UgJ28nOiBjb21taXR0ZWQgPSB0aGlzLl9vdmVyd3JpdGVGaWxlKGFjdGlvbi5wYXRoLCBhY3Rpb24uY29udGVudCk7IGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2MnOiBjb21taXR0ZWQgPSB0aGlzLl9jcmVhdGVGaWxlKGFjdGlvbi5wYXRoLCBhY3Rpb24uY29udGVudCk7IGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3InOiBjb21taXR0ZWQgPSB0aGlzLl9yZW5hbWVGaWxlKGFjdGlvbi5wYXRoLCBhY3Rpb24udG8pOyBicmVhaztcbiAgICAgICAgICBjYXNlICdkJzogY29tbWl0dGVkID0gdGhpcy5fZGVsZXRlRmlsZShhY3Rpb24ucGF0aCk7IGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbW1pdHRlZCkge1xuICAgICAgICAgIGNvbW1pdHRlZC5zdWJzY3JpYmUob2JzZXJ2ZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pKSk7XG4gIH1cblxuICBjb21taXQodHJlZTogVHJlZSk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIGNvbnN0IGFjdGlvbnMgPSBvYnNlcnZhYmxlRnJvbSh0cmVlLmFjdGlvbnMpO1xuXG4gICAgcmV0dXJuICh0aGlzLnByZUNvbW1pdCgpIHx8IGVtcHR5PHZvaWQ+KCkpLnBpcGUoXG4gICAgICBjb25jYXQoZGVmZXJPYnNlcnZhYmxlKCgpID0+IGFjdGlvbnMpKSxcbiAgICAgIGNvbmNhdE1hcCgoYWN0aW9uOiBBY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgbWF5YmVBY3Rpb24gPSB0aGlzLnByZUNvbW1pdEFjdGlvbihhY3Rpb24pO1xuICAgICAgICBpZiAoIW1heWJlQWN0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihhY3Rpb24pO1xuICAgICAgICB9IGVsc2UgaWYgKGlzQWN0aW9uKG1heWJlQWN0aW9uKSkge1xuICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YobWF5YmVBY3Rpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBtYXliZUFjdGlvbjtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBjb25jYXRNYXAoKGFjdGlvbjogQWN0aW9uKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbW1pdFNpbmdsZUFjdGlvbihhY3Rpb24pLnBpcGUoXG4gICAgICAgICAgaWdub3JlRWxlbWVudHMoKSxcbiAgICAgICAgICBjb25jYXQoW2FjdGlvbl0pKTtcbiAgICAgIH0pLFxuICAgICAgY29uY2F0TWFwKChhY3Rpb246IEFjdGlvbikgPT4gdGhpcy5wb3N0Q29tbWl0QWN0aW9uKGFjdGlvbikgfHwgZW1wdHk8dm9pZD4oKSksXG4gICAgICBjb25jYXQoZGVmZXJPYnNlcnZhYmxlKCgpID0+IHRoaXMuX2RvbmUoKSkpLFxuICAgICAgY29uY2F0KGRlZmVyT2JzZXJ2YWJsZSgoKSA9PiB0aGlzLnBvc3RDb21taXQoKSB8fCBlbXB0eTx2b2lkPigpKSkpO1xuICB9XG59XG4iXX0=