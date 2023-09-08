"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DryRunSink = void 0;
const core_1 = require("@angular-devkit/core");
const node_1 = require("@angular-devkit/core/node");
const rxjs_1 = require("rxjs");
const host_1 = require("./host");
class DryRunSink extends host_1.HostSink {
    constructor(host, force = false) {
        super(typeof host == 'string'
            ? new core_1.virtualFs.ScopedHost(new node_1.NodeJsSyncHost(), (0, core_1.normalize)(host))
            : host, force);
        this._subject = new rxjs_1.Subject();
        this._fileDoesNotExistExceptionSet = new Set();
        this._fileAlreadyExistExceptionSet = new Set();
        this.reporter = this._subject.asObservable();
    }
    _fileAlreadyExistException(path) {
        this._fileAlreadyExistExceptionSet.add(path);
    }
    _fileDoesNotExistException(path) {
        this._fileDoesNotExistExceptionSet.add(path);
    }
    _done() {
        this._fileAlreadyExistExceptionSet.forEach((path) => {
            this._subject.next({
                kind: 'error',
                description: 'alreadyExist',
                path,
            });
        });
        this._fileDoesNotExistExceptionSet.forEach((path) => {
            this._subject.next({
                kind: 'error',
                description: 'doesNotExist',
                path,
            });
        });
        this._filesToDelete.forEach((path) => {
            // Check if this is a renaming.
            for (const [from] of this._filesToRename) {
                if (from == path) {
                    // The event is sent later on.
                    return;
                }
            }
            this._subject.next({ kind: 'delete', path });
        });
        this._filesToRename.forEach(([path, to]) => {
            this._subject.next({ kind: 'rename', path, to });
        });
        this._filesToCreate.forEach((content, path) => {
            // Check if this is a renaming.
            for (const [, to] of this._filesToRename) {
                if (to == path) {
                    // The event is sent later on.
                    return;
                }
            }
            if (this._fileAlreadyExistExceptionSet.has(path) ||
                this._fileDoesNotExistExceptionSet.has(path)) {
                return;
            }
            this._subject.next({ kind: 'create', path, content });
        });
        this._filesToUpdate.forEach((content, path) => {
            this._subject.next({ kind: 'update', path, content });
        });
        this._subject.complete();
        return (0, rxjs_1.of)(undefined);
    }
}
exports.DryRunSink = DryRunSink;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJ5cnVuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5ndWxhcl9kZXZraXQvc2NoZW1hdGljcy9zcmMvc2luay9kcnlydW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsK0NBQTREO0FBQzVELG9EQUEyRDtBQUMzRCwrQkFBK0M7QUFDL0MsaUNBQWtDO0FBa0NsQyxNQUFhLFVBQVcsU0FBUSxlQUFRO0lBYXRDLFlBQVksSUFBNkIsRUFBRSxLQUFLLEdBQUcsS0FBSztRQUN0RCxLQUFLLENBQ0gsT0FBTyxJQUFJLElBQUksUUFBUTtZQUNyQixDQUFDLENBQUMsSUFBSSxnQkFBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLHFCQUFjLEVBQUUsRUFBRSxJQUFBLGdCQUFTLEVBQUMsSUFBSSxDQUFDLENBQUM7WUFDakUsQ0FBQyxDQUFDLElBQUksRUFDUixLQUFLLENBQ04sQ0FBQztRQWxCTSxhQUFRLEdBQUcsSUFBSSxjQUFPLEVBQWUsQ0FBQztRQUN0QyxrQ0FBNkIsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1FBQ2xELGtDQUE2QixHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7UUFFbkQsYUFBUSxHQUE0QixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBZTFFLENBQUM7SUFFa0IsMEJBQTBCLENBQUMsSUFBWTtRQUN4RCxJQUFJLENBQUMsNkJBQTZCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFDa0IsMEJBQTBCLENBQUMsSUFBWTtRQUN4RCxJQUFJLENBQUMsNkJBQTZCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFUSxLQUFLO1FBQ1osSUFBSSxDQUFDLDZCQUE2QixDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ2xELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUNqQixJQUFJLEVBQUUsT0FBTztnQkFDYixXQUFXLEVBQUUsY0FBYztnQkFDM0IsSUFBSTthQUNMLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLDZCQUE2QixDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ2xELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUNqQixJQUFJLEVBQUUsT0FBTztnQkFDYixXQUFXLEVBQUUsY0FBYztnQkFDM0IsSUFBSTthQUNMLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNuQywrQkFBK0I7WUFDL0IsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDeEMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO29CQUNoQiw4QkFBOEI7b0JBQzlCLE9BQU87aUJBQ1I7YUFDRjtZQUVELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3pDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQzVDLCtCQUErQjtZQUMvQixLQUFLLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ3hDLElBQUksRUFBRSxJQUFJLElBQUksRUFBRTtvQkFDZCw4QkFBOEI7b0JBQzlCLE9BQU87aUJBQ1I7YUFDRjtZQUNELElBQ0UsSUFBSSxDQUFDLDZCQUE2QixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7Z0JBQzVDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQzVDO2dCQUNBLE9BQU87YUFDUjtZQUVELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQzVDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFekIsT0FBTyxJQUFBLFNBQUUsRUFBTyxTQUFTLENBQUMsQ0FBQztJQUM3QixDQUFDO0NBQ0Y7QUFwRkQsZ0NBb0ZDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7IG5vcm1hbGl6ZSwgdmlydHVhbEZzIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgTm9kZUpzU3luY0hvc3QgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZS9ub2RlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QsIG9mIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBIb3N0U2luayB9IGZyb20gJy4vaG9zdCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRHJ5UnVuRXJyb3JFdmVudCB7XG4gIGtpbmQ6ICdlcnJvcic7XG4gIGRlc2NyaXB0aW9uOiAnYWxyZWFkeUV4aXN0JyB8ICdkb2VzTm90RXhpc3QnO1xuICBwYXRoOiBzdHJpbmc7XG59XG5leHBvcnQgaW50ZXJmYWNlIERyeVJ1bkRlbGV0ZUV2ZW50IHtcbiAga2luZDogJ2RlbGV0ZSc7XG4gIHBhdGg6IHN0cmluZztcbn1cbmV4cG9ydCBpbnRlcmZhY2UgRHJ5UnVuQ3JlYXRlRXZlbnQge1xuICBraW5kOiAnY3JlYXRlJztcbiAgcGF0aDogc3RyaW5nO1xuICBjb250ZW50OiBCdWZmZXI7XG59XG5leHBvcnQgaW50ZXJmYWNlIERyeVJ1blVwZGF0ZUV2ZW50IHtcbiAga2luZDogJ3VwZGF0ZSc7XG4gIHBhdGg6IHN0cmluZztcbiAgY29udGVudDogQnVmZmVyO1xufVxuZXhwb3J0IGludGVyZmFjZSBEcnlSdW5SZW5hbWVFdmVudCB7XG4gIGtpbmQ6ICdyZW5hbWUnO1xuICBwYXRoOiBzdHJpbmc7XG4gIHRvOiBzdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIERyeVJ1bkV2ZW50ID1cbiAgfCBEcnlSdW5FcnJvckV2ZW50XG4gIHwgRHJ5UnVuRGVsZXRlRXZlbnRcbiAgfCBEcnlSdW5DcmVhdGVFdmVudFxuICB8IERyeVJ1blVwZGF0ZUV2ZW50XG4gIHwgRHJ5UnVuUmVuYW1lRXZlbnQ7XG5cbmV4cG9ydCBjbGFzcyBEcnlSdW5TaW5rIGV4dGVuZHMgSG9zdFNpbmsge1xuICBwcm90ZWN0ZWQgX3N1YmplY3QgPSBuZXcgU3ViamVjdDxEcnlSdW5FdmVudD4oKTtcbiAgcHJvdGVjdGVkIF9maWxlRG9lc05vdEV4aXN0RXhjZXB0aW9uU2V0ID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIHByb3RlY3RlZCBfZmlsZUFscmVhZHlFeGlzdEV4Y2VwdGlvblNldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gIHJlYWRvbmx5IHJlcG9ydGVyOiBPYnNlcnZhYmxlPERyeVJ1bkV2ZW50PiA9IHRoaXMuX3N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7aG9zdH0gZGlyIFRoZSBob3N0IHRvIHVzZSB0byBvdXRwdXQuIFRoaXMgc2hvdWxkIGJlIHNjb3BlZC5cbiAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSBXaGV0aGVyIHRvIGZvcmNlIG92ZXJ3cml0aW5nIGZpbGVzIHRoYXQgYWxyZWFkeSBleGlzdC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGhvc3Q6IHZpcnR1YWxGcy5Ib3N0LCBmb3JjZT86IGJvb2xlYW4pO1xuXG4gIGNvbnN0cnVjdG9yKGhvc3Q6IHZpcnR1YWxGcy5Ib3N0IHwgc3RyaW5nLCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgc3VwZXIoXG4gICAgICB0eXBlb2YgaG9zdCA9PSAnc3RyaW5nJ1xuICAgICAgICA/IG5ldyB2aXJ0dWFsRnMuU2NvcGVkSG9zdChuZXcgTm9kZUpzU3luY0hvc3QoKSwgbm9ybWFsaXplKGhvc3QpKVxuICAgICAgICA6IGhvc3QsXG4gICAgICBmb3JjZSxcbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF9maWxlQWxyZWFkeUV4aXN0RXhjZXB0aW9uKHBhdGg6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuX2ZpbGVBbHJlYWR5RXhpc3RFeGNlcHRpb25TZXQuYWRkKHBhdGgpO1xuICB9XG4gIHByb3RlY3RlZCBvdmVycmlkZSBfZmlsZURvZXNOb3RFeGlzdEV4Y2VwdGlvbihwYXRoOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9maWxlRG9lc05vdEV4aXN0RXhjZXB0aW9uU2V0LmFkZChwYXRoKTtcbiAgfVxuXG4gIG92ZXJyaWRlIF9kb25lKCkge1xuICAgIHRoaXMuX2ZpbGVBbHJlYWR5RXhpc3RFeGNlcHRpb25TZXQuZm9yRWFjaCgocGF0aCkgPT4ge1xuICAgICAgdGhpcy5fc3ViamVjdC5uZXh0KHtcbiAgICAgICAga2luZDogJ2Vycm9yJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdhbHJlYWR5RXhpc3QnLFxuICAgICAgICBwYXRoLFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGhpcy5fZmlsZURvZXNOb3RFeGlzdEV4Y2VwdGlvblNldC5mb3JFYWNoKChwYXRoKSA9PiB7XG4gICAgICB0aGlzLl9zdWJqZWN0Lm5leHQoe1xuICAgICAgICBraW5kOiAnZXJyb3InLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ2RvZXNOb3RFeGlzdCcsXG4gICAgICAgIHBhdGgsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2ZpbGVzVG9EZWxldGUuZm9yRWFjaCgocGF0aCkgPT4ge1xuICAgICAgLy8gQ2hlY2sgaWYgdGhpcyBpcyBhIHJlbmFtaW5nLlxuICAgICAgZm9yIChjb25zdCBbZnJvbV0gb2YgdGhpcy5fZmlsZXNUb1JlbmFtZSkge1xuICAgICAgICBpZiAoZnJvbSA9PSBwYXRoKSB7XG4gICAgICAgICAgLy8gVGhlIGV2ZW50IGlzIHNlbnQgbGF0ZXIgb24uXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3N1YmplY3QubmV4dCh7IGtpbmQ6ICdkZWxldGUnLCBwYXRoIH0pO1xuICAgIH0pO1xuICAgIHRoaXMuX2ZpbGVzVG9SZW5hbWUuZm9yRWFjaCgoW3BhdGgsIHRvXSkgPT4ge1xuICAgICAgdGhpcy5fc3ViamVjdC5uZXh0KHsga2luZDogJ3JlbmFtZScsIHBhdGgsIHRvIH0pO1xuICAgIH0pO1xuICAgIHRoaXMuX2ZpbGVzVG9DcmVhdGUuZm9yRWFjaCgoY29udGVudCwgcGF0aCkgPT4ge1xuICAgICAgLy8gQ2hlY2sgaWYgdGhpcyBpcyBhIHJlbmFtaW5nLlxuICAgICAgZm9yIChjb25zdCBbLCB0b10gb2YgdGhpcy5fZmlsZXNUb1JlbmFtZSkge1xuICAgICAgICBpZiAodG8gPT0gcGF0aCkge1xuICAgICAgICAgIC8vIFRoZSBldmVudCBpcyBzZW50IGxhdGVyIG9uLlxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICB0aGlzLl9maWxlQWxyZWFkeUV4aXN0RXhjZXB0aW9uU2V0LmhhcyhwYXRoKSB8fFxuICAgICAgICB0aGlzLl9maWxlRG9lc05vdEV4aXN0RXhjZXB0aW9uU2V0LmhhcyhwYXRoKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc3ViamVjdC5uZXh0KHsga2luZDogJ2NyZWF0ZScsIHBhdGgsIGNvbnRlbnQgfSk7XG4gICAgfSk7XG4gICAgdGhpcy5fZmlsZXNUb1VwZGF0ZS5mb3JFYWNoKChjb250ZW50LCBwYXRoKSA9PiB7XG4gICAgICB0aGlzLl9zdWJqZWN0Lm5leHQoeyBraW5kOiAndXBkYXRlJywgcGF0aCwgY29udGVudCB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuX3N1YmplY3QuY29tcGxldGUoKTtcblxuICAgIHJldHVybiBvZjx2b2lkPih1bmRlZmluZWQpO1xuICB9XG59XG4iXX0=