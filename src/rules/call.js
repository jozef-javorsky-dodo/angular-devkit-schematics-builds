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
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const interface_1 = require("../tree/interface");
function _getTypeOfResult(value) {
    if (value === undefined) {
        return 'undefined';
    }
    else if (value === null) {
        return 'null';
    }
    else if (typeof value == 'function') {
        return `Function()`;
    }
    else if (typeof value != 'object') {
        return `${typeof value}(${JSON.stringify(value)})`;
    }
    else {
        if (Object.getPrototypeOf(value) == Object) {
            return `Object(${JSON.stringify(value)})`;
        }
        else if (value.constructor) {
            return `Instance of class ${value.constructor.name}`;
        }
        else {
            return 'Unknown Object';
        }
    }
}
/**
 * When a rule or source returns an invalid value.
 */
class InvalidRuleResultException extends core_1.BaseException {
    constructor(value) {
        super(`Invalid rule result: ${_getTypeOfResult(value)}.`);
    }
}
exports.InvalidRuleResultException = InvalidRuleResultException;
class InvalidSourceResultException extends core_1.BaseException {
    constructor(value) {
        super(`Invalid source result: ${_getTypeOfResult(value)}.`);
    }
}
exports.InvalidSourceResultException = InvalidSourceResultException;
function callSource(source, context) {
    const result = source(context);
    if (core_1.isObservable(result)) {
        // Only return the last Tree, and make sure it's a Tree.
        return result.pipe(operators_1.defaultIfEmpty(), operators_1.last(), operators_1.tap(inner => {
            if (!inner || !(interface_1.TreeSymbol in inner)) {
                throw new InvalidSourceResultException(inner);
            }
        }));
    }
    else if (result && interface_1.TreeSymbol in result) {
        return rxjs_1.of(result);
    }
    else {
        return rxjs_1.throwError(new InvalidSourceResultException(result));
    }
}
exports.callSource = callSource;
function callRule(rule, input, context) {
    return input.pipe(operators_1.mergeMap(inputTree => {
        const result = rule(inputTree, context);
        if (result === undefined) {
            return rxjs_1.of(inputTree);
        }
        else if (typeof result == 'function') {
            // This is considered a Rule, chain the rule and return its output.
            return callRule(result, rxjs_1.of(inputTree), context);
        }
        else if (core_1.isObservable(result)) {
            // Only return the last Tree, and make sure it's a Tree.
            return result.pipe(operators_1.defaultIfEmpty(), operators_1.last(), operators_1.tap(inner => {
                if (!inner || !(interface_1.TreeSymbol in inner)) {
                    throw new InvalidRuleResultException(inner);
                }
            }));
        }
        else if (interface_1.TreeSymbol in result) {
            return rxjs_1.of(result);
        }
        else {
            return rxjs_1.throwError(new InvalidRuleResultException(result));
        }
    }));
}
exports.callRule = callRule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsbC5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvc2NoZW1hdGljcy9zcmMvcnVsZXMvY2FsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILCtDQUFtRTtBQUNuRSwrQkFBa0U7QUFDbEUsOENBQXFFO0FBRXJFLGlEQUFxRDtBQUdyRCwwQkFBMEIsS0FBVTtJQUNsQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN4QixNQUFNLENBQUMsV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLFlBQVksQ0FBQztJQUN0QixDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDcEMsTUFBTSxDQUFDLEdBQUcsT0FBTyxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0lBQ3JELENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMzQyxNQUFNLENBQUMsVUFBVSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDNUMsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUM3QixNQUFNLENBQUMscUJBQXFCLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sTUFBTSxDQUFDLGdCQUFnQixDQUFDO1FBQzFCLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQUdEOztHQUVHO0FBQ0gsZ0NBQXdDLFNBQVEsb0JBQWE7SUFDM0QsWUFBWSxLQUFVO1FBQ3BCLEtBQUssQ0FBQyx3QkFBd0IsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVELENBQUM7Q0FDRjtBQUpELGdFQUlDO0FBR0Qsa0NBQTBDLFNBQVEsb0JBQWE7SUFDN0QsWUFBWSxLQUFVO1FBQ3BCLEtBQUssQ0FBQywwQkFBMEIsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlELENBQUM7Q0FDRjtBQUpELG9FQUlDO0FBR0Qsb0JBQTJCLE1BQWMsRUFBRSxPQUF5QjtJQUNsRSxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFL0IsRUFBRSxDQUFDLENBQUMsbUJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekIsd0RBQXdEO1FBQ3hELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUNoQiwwQkFBYyxFQUFFLEVBQ2hCLGdCQUFJLEVBQUUsRUFDTixlQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDVixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsc0JBQVUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLE1BQU0sSUFBSSw0QkFBNEIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoRCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLHNCQUFVLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsU0FBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sQ0FBQyxpQkFBVSxDQUFDLElBQUksNEJBQTRCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0FBQ0gsQ0FBQztBQW5CRCxnQ0FtQkM7QUFHRCxrQkFDRSxJQUFVLEVBQ1YsS0FBdUIsRUFDdkIsT0FBeUI7SUFFekIsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsb0JBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUNyQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXhDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sQ0FBQyxTQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakMsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLE1BQU0sSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLG1FQUFtRTtZQUNuRSxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxTQUFZLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxtQkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyx3REFBd0Q7WUFDeEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ2hCLDBCQUFjLEVBQUUsRUFDaEIsZ0JBQUksRUFBRSxFQUNOLGVBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDVixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsc0JBQVUsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JDLE1BQU0sSUFBSSwwQkFBMEIsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDOUMsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUNILENBQUM7UUFDSixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLHNCQUFVLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLENBQUMsU0FBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxpQkFBVSxDQUFDLElBQUksMEJBQTBCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM1RCxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNOLENBQUM7QUE5QkQsNEJBOEJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgQmFzZUV4Y2VwdGlvbiwgaXNPYnNlcnZhYmxlIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YgYXMgb2JzZXJ2YWJsZU9mLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWZhdWx0SWZFbXB0eSwgbGFzdCwgbWVyZ2VNYXAsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IFJ1bGUsIFNjaGVtYXRpY0NvbnRleHQsIFNvdXJjZSB9IGZyb20gJy4uL2VuZ2luZS9pbnRlcmZhY2UnO1xuaW1wb3J0IHsgVHJlZSwgVHJlZVN5bWJvbCB9IGZyb20gJy4uL3RyZWUvaW50ZXJmYWNlJztcblxuXG5mdW5jdGlvbiBfZ2V0VHlwZU9mUmVzdWx0KHZhbHVlPzoge30pOiBzdHJpbmcge1xuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiAndW5kZWZpbmVkJztcbiAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAnbnVsbCc7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gYEZ1bmN0aW9uKClgO1xuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBgJHt0eXBlb2YgdmFsdWV9KCR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfSlgO1xuICB9IGVsc2Uge1xuICAgIGlmIChPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpID09IE9iamVjdCkge1xuICAgICAgcmV0dXJuIGBPYmplY3QoJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSl9KWA7XG4gICAgfSBlbHNlIGlmICh2YWx1ZS5jb25zdHJ1Y3Rvcikge1xuICAgICAgcmV0dXJuIGBJbnN0YW5jZSBvZiBjbGFzcyAke3ZhbHVlLmNvbnN0cnVjdG9yLm5hbWV9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdVbmtub3duIE9iamVjdCc7XG4gICAgfVxuICB9XG59XG5cblxuLyoqXG4gKiBXaGVuIGEgcnVsZSBvciBzb3VyY2UgcmV0dXJucyBhbiBpbnZhbGlkIHZhbHVlLlxuICovXG5leHBvcnQgY2xhc3MgSW52YWxpZFJ1bGVSZXN1bHRFeGNlcHRpb24gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IodmFsdWU/OiB7fSkge1xuICAgIHN1cGVyKGBJbnZhbGlkIHJ1bGUgcmVzdWx0OiAke19nZXRUeXBlT2ZSZXN1bHQodmFsdWUpfS5gKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBJbnZhbGlkU291cmNlUmVzdWx0RXhjZXB0aW9uIGV4dGVuZHMgQmFzZUV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHZhbHVlPzoge30pIHtcbiAgICBzdXBlcihgSW52YWxpZCBzb3VyY2UgcmVzdWx0OiAke19nZXRUeXBlT2ZSZXN1bHQodmFsdWUpfS5gKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBjYWxsU291cmNlKHNvdXJjZTogU291cmNlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KTogT2JzZXJ2YWJsZTxUcmVlPiB7XG4gIGNvbnN0IHJlc3VsdCA9IHNvdXJjZShjb250ZXh0KTtcblxuICBpZiAoaXNPYnNlcnZhYmxlKHJlc3VsdCkpIHtcbiAgICAvLyBPbmx5IHJldHVybiB0aGUgbGFzdCBUcmVlLCBhbmQgbWFrZSBzdXJlIGl0J3MgYSBUcmVlLlxuICAgIHJldHVybiByZXN1bHQucGlwZShcbiAgICAgIGRlZmF1bHRJZkVtcHR5KCksXG4gICAgICBsYXN0KCksXG4gICAgICB0YXAoaW5uZXIgPT4ge1xuICAgICAgICBpZiAoIWlubmVyIHx8ICEoVHJlZVN5bWJvbCBpbiBpbm5lcikpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZFNvdXJjZVJlc3VsdEV4Y2VwdGlvbihpbm5lcik7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICk7XG4gIH0gZWxzZSBpZiAocmVzdWx0ICYmIFRyZWVTeW1ib2wgaW4gcmVzdWx0KSB7XG4gICAgcmV0dXJuIG9ic2VydmFibGVPZihyZXN1bHQpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aHJvd0Vycm9yKG5ldyBJbnZhbGlkU291cmNlUmVzdWx0RXhjZXB0aW9uKHJlc3VsdCkpO1xuICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbGxSdWxlKFxuICBydWxlOiBSdWxlLFxuICBpbnB1dDogT2JzZXJ2YWJsZTxUcmVlPixcbiAgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCxcbik6IE9ic2VydmFibGU8VHJlZT4ge1xuICByZXR1cm4gaW5wdXQucGlwZShtZXJnZU1hcChpbnB1dFRyZWUgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHJ1bGUoaW5wdXRUcmVlLCBjb250ZXh0KTtcblxuICAgIGlmIChyZXN1bHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG9ic2VydmFibGVPZihpbnB1dFRyZWUpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlc3VsdCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBUaGlzIGlzIGNvbnNpZGVyZWQgYSBSdWxlLCBjaGFpbiB0aGUgcnVsZSBhbmQgcmV0dXJuIGl0cyBvdXRwdXQuXG4gICAgICByZXR1cm4gY2FsbFJ1bGUocmVzdWx0LCBvYnNlcnZhYmxlT2YoaW5wdXRUcmVlKSwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmIChpc09ic2VydmFibGUocmVzdWx0KSkge1xuICAgICAgLy8gT25seSByZXR1cm4gdGhlIGxhc3QgVHJlZSwgYW5kIG1ha2Ugc3VyZSBpdCdzIGEgVHJlZS5cbiAgICAgIHJldHVybiByZXN1bHQucGlwZShcbiAgICAgICAgZGVmYXVsdElmRW1wdHkoKSxcbiAgICAgICAgbGFzdCgpLFxuICAgICAgICB0YXAoaW5uZXIgPT4ge1xuICAgICAgICAgIGlmICghaW5uZXIgfHwgIShUcmVlU3ltYm9sIGluIGlubmVyKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRSdWxlUmVzdWx0RXhjZXB0aW9uKGlubmVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKFRyZWVTeW1ib2wgaW4gcmVzdWx0KSB7XG4gICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKHJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKG5ldyBJbnZhbGlkUnVsZVJlc3VsdEV4Y2VwdGlvbihyZXN1bHQpKTtcbiAgICB9XG4gIH0pKTtcbn1cbiJdfQ==