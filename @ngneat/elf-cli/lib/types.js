"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ID_KEY = exports.baseFeatures = exports.baseClassStorePlaces = void 0;
exports.baseClassStorePlaces = [
    { name: 'Outside of a class', value: false },
    { name: 'Inside a class constructor', value: true },
];
exports.baseFeatures = [
    { name: 'Props', value: 'withProps' },
    { name: 'Entities', value: 'withEntities' },
    {
        name: 'UIEntities',
        value: 'withUIEntities',
    },
    {
        name: 'Active Id',
        value: 'withActiveId',
    },
    {
        name: 'Active Ids',
        value: 'withActiveIds',
    },
    {
        name: 'Requests Cache',
        value: 'withRequestsCache',
    },
    {
        name: 'Requests Status',
        value: 'withRequestsStatus',
    },
];
exports.DEFAULT_ID_KEY = 'id';
//# sourceMappingURL=types.js.map