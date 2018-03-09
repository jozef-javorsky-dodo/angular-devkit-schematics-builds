"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const of_1 = require("rxjs/observable/of");
const operators_1 = require("rxjs/operators");
const src_1 = require("../src");
const call_1 = require("../src/rules/call");
const node_1 = require("../tasks/node");
const tools_1 = require("../tools");
class UnitTestTree extends src_1.DelegateTree {
    get files() {
        const result = [];
        this.visit(path => result.push(path));
        return result;
    }
    readContent(path) {
        const buffer = this.read(path);
        if (buffer === null) {
            return '';
        }
        return buffer.toString();
    }
}
exports.UnitTestTree = UnitTestTree;
class SchematicTestRunner {
    constructor(_collectionName, collectionPath) {
        this._collectionName = _collectionName;
        this._engineHost = new tools_1.NodeModulesTestEngineHost();
        this._engine = new src_1.SchematicEngine(this._engineHost);
        this._engineHost.registerCollection(_collectionName, collectionPath);
        this._logger = new core_1.logging.Logger('test');
        const registry = new core_1.schema.CoreSchemaRegistry(src_1.formats.standardFormats);
        this._engineHost.registerOptionsTransform(tools_1.validateOptionsWithSchema(registry));
        this._engineHost.registerTaskExecutor(node_1.BuiltinTaskExecutor.NodePackage);
        this._engineHost.registerTaskExecutor(node_1.BuiltinTaskExecutor.RepositoryInitializer);
        this._collection = this._engine.createCollection(this._collectionName);
    }
    get logger() { return this._logger; }
    runSchematicAsync(schematicName, opts, tree) {
        const schematic = this._collection.createSchematic(schematicName, true);
        const host = of_1.of(tree || new src_1.VirtualTree);
        return schematic.call(opts || {}, host, { logger: this._logger })
            .pipe(operators_1.map(tree => new UnitTestTree(tree)));
    }
    runSchematic(schematicName, opts, tree) {
        const schematic = this._collection.createSchematic(schematicName, true);
        let result = null;
        const host = of_1.of(tree || new src_1.VirtualTree);
        schematic.call(opts || {}, host, { logger: this._logger })
            .subscribe(t => result = new UnitTestTree(t));
        if (result === null) {
            throw new Error('Schematic is async, please use runSchematicAsync');
        }
        return result;
    }
    runExternalSchematicAsync(collectionName, schematicName, opts, tree) {
        const externalCollection = this._engine.createCollection(collectionName);
        const schematic = externalCollection.createSchematic(schematicName, true);
        const host = of_1.of(tree || new src_1.VirtualTree);
        return schematic.call(opts || {}, host, { logger: this._logger })
            .pipe(operators_1.map(tree => new UnitTestTree(tree)));
    }
    runExternalSchematic(collectionName, schematicName, opts, tree) {
        const externalCollection = this._engine.createCollection(collectionName);
        const schematic = externalCollection.createSchematic(schematicName, true);
        let result = null;
        const host = of_1.of(tree || new src_1.VirtualTree);
        schematic.call(opts || {}, host, { logger: this._logger })
            .subscribe(t => result = new UnitTestTree(t));
        if (result === null) {
            throw new Error('Schematic is async, please use runSchematicAsync');
        }
        return result;
    }
    callRule(rule, tree, parentContext) {
        const context = this._engine.createContext({}, parentContext);
        return call_1.callRule(rule, of_1.of(tree), context);
    }
}
exports.SchematicTestRunner = SchematicTestRunner;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hdGljLXRlc3QtcnVubmVyLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3Rlc3Rpbmcvc2NoZW1hdGljLXRlc3QtcnVubmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0NBQXVEO0FBRXZELDJDQUF3RDtBQUN4RCw4Q0FBcUM7QUFDckMsZ0NBVWdCO0FBQ2hCLDRDQUE2QztBQUM3Qyx3Q0FBb0Q7QUFDcEQsb0NBR2tCO0FBR2xCLGtCQUEwQixTQUFRLGtCQUFZO0lBQzVDLElBQUksS0FBSztRQUNQLE1BQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRXRDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELFdBQVcsQ0FBQyxJQUFZO1FBQ3RCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNaLENBQUM7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzNCLENBQUM7Q0FDRjtBQWhCRCxvQ0FnQkM7QUFFRDtJQU1FLFlBQW9CLGVBQXVCLEVBQUUsY0FBc0I7UUFBL0Msb0JBQWUsR0FBZixlQUFlLENBQVE7UUFMbkMsZ0JBQVcsR0FBRyxJQUFJLGlDQUF5QixFQUFFLENBQUM7UUFDOUMsWUFBTyxHQUE0QixJQUFJLHFCQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBSy9FLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsZUFB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QUNyRCxDQUFDO0NBQ0Y7QUE5RkQsa0RBOEZDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgbG9nZ2luZywgc2NoZW1hIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBvZiBhcyBvYnNlcnZhYmxlT2YgfSBmcm9tICdyeGpzL29ic2VydmFibGUvb2YnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtcbiAgQ29sbGVjdGlvbixcbiAgRGVsZWdhdGVUcmVlLFxuICBSdWxlLFxuICBTY2hlbWF0aWMsXG4gIFNjaGVtYXRpY0NvbnRleHQsXG4gIFNjaGVtYXRpY0VuZ2luZSxcbiAgVHJlZSxcbiAgVmlydHVhbFRyZWUsXG4gIGZvcm1hdHMsXG59IGZyb20gJy4uL3NyYyc7XG5pbXBvcnQgeyBjYWxsUnVsZSB9IGZyb20gJy4uL3NyYy9ydWxlcy9jYWxsJztcbmltcG9ydCB7IEJ1aWx0aW5UYXNrRXhlY3V0b3IgfSBmcm9tICcuLi90YXNrcy9ub2RlJztcbmltcG9ydCB7XG4gIE5vZGVNb2R1bGVzVGVzdEVuZ2luZUhvc3QsXG4gIHZhbGlkYXRlT3B0aW9uc1dpdGhTY2hlbWEsXG59IGZyb20gJy4uL3Rvb2xzJztcblxuXG5leHBvcnQgY2xhc3MgVW5pdFRlc3RUcmVlIGV4dGVuZHMgRGVsZWdhdGVUcmVlIHtcbiAgZ2V0IGZpbGVzKCkge1xuICAgIGNvbnN0IHJlc3VsdDogc3RyaW5nW10gPSBbXTtcbiAgICB0aGlzLnZpc2l0KHBhdGggPT4gcmVzdWx0LnB1c2gocGF0aCkpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHJlYWRDb250ZW50KHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5yZWFkKHBhdGgpO1xuICAgIGlmIChidWZmZXIgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICByZXR1cm4gYnVmZmVyLnRvU3RyaW5nKCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNjaGVtYXRpY1Rlc3RSdW5uZXIge1xuICBwcml2YXRlIF9lbmdpbmVIb3N0ID0gbmV3IE5vZGVNb2R1bGVzVGVzdEVuZ2luZUhvc3QoKTtcbiAgcHJpdmF0ZSBfZW5naW5lOiBTY2hlbWF0aWNFbmdpbmU8e30sIHt9PiA9IG5ldyBTY2hlbWF0aWNFbmdpbmUodGhpcy5fZW5naW5lSG9zdCk7XG4gIHByaXZhdGUgX2NvbGxlY3Rpb246IENvbGxlY3Rpb248e30sIHt9PjtcbiAgcHJpdmF0ZSBfbG9nZ2VyOiBsb2dnaW5nLkxvZ2dlcjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBjb2xsZWN0aW9uUGF0aDogc3RyaW5nKSB7XG4gICAgdGhpcy5fZW5naW5lSG9zdC5yZWdpc3RlckNvbGxlY3Rpb24oX2NvbGxlY3Rpb25OYW1lLCBjb2xsZWN0aW9uUGF0aCk7XG4gICAgdGhpcy5fbG9nZ2VyID0gbmV3IGxvZ2dpbmcuTG9nZ2VyKCd0ZXN0Jyk7XG5cbiAgICBjb25zdCByZWdpc3RyeSA9IG5ldyBzY2hlbWEuQ29yZVNjaGVtYVJlZ2lzdHJ5KGZvcm1hdHMuc3RhbmRhcmRGb3JtYXRzKTtcblxuICAgIHRoaXMuX2VuZ2luZUhvc3QucmVnaXN0ZXJPcHRpb25zVHJhbnNmb3JtKHZhbGlkYXRlT3B0aW9uc1dpdGhTY2hlbWEocmVnaXN0cnkpKTtcbiAgICB0aGlzLl9lbmdpbmVIb3N0LnJlZ2lzdGVyVGFza0V4ZWN1dG9yKEJ1aWx0aW5UYXNrRXhlY3V0b3IuTm9kZVBhY2thZ2UpO1xuICAgIHRoaXMuX2VuZ2luZUhvc3QucmVnaXN0ZXJUYXNrRXhlY3V0b3IoQnVpbHRpblRhc2tFeGVjdXRvci5SZXBvc2l0b3J5SW5pdGlhbGl6ZXIpO1xuXG4gICAgdGhpcy5fY29sbGVjdGlvbiA9IHRoaXMuX2VuZ2luZS5jcmVhdGVDb2xsZWN0aW9uKHRoaXMuX2NvbGxlY3Rpb25OYW1lKTtcbiAgfVxuXG4gIGdldCBsb2dnZXIoKTogbG9nZ2luZy5Mb2dnZXIgeyByZXR1cm4gdGhpcy5fbG9nZ2VyOyB9XG5cbiAgcnVuU2NoZW1hdGljQXN5bmM8U2NoZW1hdGljU2NoZW1hVD4oXG4gICAgc2NoZW1hdGljTmFtZTogc3RyaW5nLFxuICAgIG9wdHM/OiBTY2hlbWF0aWNTY2hlbWFULFxuICAgIHRyZWU/OiBUcmVlLFxuICApOiBPYnNlcnZhYmxlPFVuaXRUZXN0VHJlZT4ge1xuICAgIGNvbnN0IHNjaGVtYXRpYyA9IHRoaXMuX2NvbGxlY3Rpb24uY3JlYXRlU2NoZW1hdGljKHNjaGVtYXRpY05hbWUsIHRydWUpO1xuICAgIGNvbnN0IGhvc3QgPSBvYnNlcnZhYmxlT2YodHJlZSB8fCBuZXcgVmlydHVhbFRyZWUpO1xuXG4gICAgcmV0dXJuIHNjaGVtYXRpYy5jYWxsKG9wdHMgfHwge30sIGhvc3QsIHsgbG9nZ2VyOiB0aGlzLl9sb2dnZXIgfSlcbiAgICAgIC5waXBlKG1hcCh0cmVlID0+IG5ldyBVbml0VGVzdFRyZWUodHJlZSkpKTtcbiAgfVxuXG4gIHJ1blNjaGVtYXRpYzxTY2hlbWF0aWNTY2hlbWFUPihcbiAgICBzY2hlbWF0aWNOYW1lOiBzdHJpbmcsXG4gICAgb3B0cz86IFNjaGVtYXRpY1NjaGVtYVQsXG4gICAgdHJlZT86IFRyZWUsXG4gICk6IFVuaXRUZXN0VHJlZSB7XG4gICAgY29uc3Qgc2NoZW1hdGljID0gdGhpcy5fY29sbGVjdGlvbi5jcmVhdGVTY2hlbWF0aWMoc2NoZW1hdGljTmFtZSwgdHJ1ZSk7XG5cbiAgICBsZXQgcmVzdWx0OiBVbml0VGVzdFRyZWUgfCBudWxsID0gbnVsbDtcbiAgICBjb25zdCBob3N0ID0gb2JzZXJ2YWJsZU9mKHRyZWUgfHwgbmV3IFZpcnR1YWxUcmVlKTtcblxuICAgIHNjaGVtYXRpYy5jYWxsKG9wdHMgfHwge30sIGhvc3QsIHsgbG9nZ2VyOiB0aGlzLl9sb2dnZXIgfSlcbiAgICAgIC5zdWJzY3JpYmUodCA9PiByZXN1bHQgPSBuZXcgVW5pdFRlc3RUcmVlKHQpKTtcblxuICAgIGlmIChyZXN1bHQgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2NoZW1hdGljIGlzIGFzeW5jLCBwbGVhc2UgdXNlIHJ1blNjaGVtYXRpY0FzeW5jJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHJ1bkV4dGVybmFsU2NoZW1hdGljQXN5bmM8U2NoZW1hdGljU2NoZW1hVD4oXG4gICAgY29sbGVjdGlvbk5hbWU6IHN0cmluZyxcbiAgICBzY2hlbWF0aWNOYW1lOiBzdHJpbmcsXG4gICAgb3B0cz86IFNjaGVtYXRpY1NjaGVtYVQsXG4gICAgdHJlZT86IFRyZWUsXG4gICk6IE9ic2VydmFibGU8VW5pdFRlc3RUcmVlPiB7XG4gICAgY29uc3QgZXh0ZXJuYWxDb2xsZWN0aW9uID0gdGhpcy5fZW5naW5lLmNyZWF0ZUNvbGxlY3Rpb24oY29sbGVjdGlvbk5hbWUpO1xuICAgIGNvbnN0IHNjaGVtYXRpYyA9IGV4dGVybmFsQ29sbGVjdGlvbi5jcmVhdGVTY2hlbWF0aWMoc2NoZW1hdGljTmFtZSwgdHJ1ZSk7XG4gICAgY29uc3QgaG9zdCA9IG9ic2VydmFibGVPZih0cmVlIHx8IG5ldyBWaXJ0dWFsVHJlZSk7XG5cbiAgICByZXR1cm4gc2NoZW1hdGljLmNhbGwob3B0cyB8fCB7fSwgaG9zdCwgeyBsb2dnZXI6IHRoaXMuX2xvZ2dlciB9KVxuICAgICAgLnBpcGUobWFwKHRyZWUgPT4gbmV3IFVuaXRUZXN0VHJlZSh0cmVlKSkpO1xuICB9XG5cbiAgcnVuRXh0ZXJuYWxTY2hlbWF0aWM8U2NoZW1hdGljU2NoZW1hVD4oXG4gICAgY29sbGVjdGlvbk5hbWU6IHN0cmluZyxcbiAgICBzY2hlbWF0aWNOYW1lOiBzdHJpbmcsXG4gICAgb3B0cz86IFNjaGVtYXRpY1NjaGVtYVQsXG4gICAgdHJlZT86IFRyZWUsXG4gICk6IFVuaXRUZXN0VHJlZSB7XG4gICAgY29uc3QgZXh0ZXJuYWxDb2xsZWN0aW9uID0gdGhpcy5fZW5naW5lLmNyZWF0ZUNvbGxlY3Rpb24oY29sbGVjdGlvbk5hbWUpO1xuICAgIGNvbnN0IHNjaGVtYXRpYyA9IGV4dGVybmFsQ29sbGVjdGlvbi5jcmVhdGVTY2hlbWF0aWMoc2NoZW1hdGljTmFtZSwgdHJ1ZSk7XG5cbiAgICBsZXQgcmVzdWx0OiBVbml0VGVzdFRyZWUgfCBudWxsID0gbnVsbDtcbiAgICBjb25zdCBob3N0ID0gb2JzZXJ2YWJsZU9mKHRyZWUgfHwgbmV3IFZpcnR1YWxUcmVlKTtcblxuICAgIHNjaGVtYXRpYy5jYWxsKG9wdHMgfHwge30sIGhvc3QsIHsgbG9nZ2VyOiB0aGlzLl9sb2dnZXIgfSlcbiAgICAgIC5zdWJzY3JpYmUodCA9PiByZXN1bHQgPSBuZXcgVW5pdFRlc3RUcmVlKHQpKTtcblxuICAgIGlmIChyZXN1bHQgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2NoZW1hdGljIGlzIGFzeW5jLCBwbGVhc2UgdXNlIHJ1blNjaGVtYXRpY0FzeW5jJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGNhbGxSdWxlKHJ1bGU6IFJ1bGUsIHRyZWU6IFRyZWUsIHBhcmVudENvbnRleHQ/OiBQYXJ0aWFsPFNjaGVtYXRpY0NvbnRleHQ+KTogT2JzZXJ2YWJsZTxUcmVlPiB7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMuX2VuZ2luZS5jcmVhdGVDb250ZXh0KHt9IGFzIFNjaGVtYXRpYzx7fSwge30+LCBwYXJlbnRDb250ZXh0KTtcblxuICAgIHJldHVybiBjYWxsUnVsZShydWxlLCBvYnNlcnZhYmxlT2YodHJlZSksIGNvbnRleHQpO1xuICB9XG59XG4iXX0=