/// <reference path="../../dependency_loader.ts" />
/// <reference path="../../dependency_resolver.ts" />
/// <reference path="../../polyfiller.ts" />
/// <reference path="../../entry_point.ts" />

namespace __sharpangles {
    export class BrowserEntryPoint extends EntryPoint<any> {
        constructor(public dependencyPolicy: DependencyPolicy<any>, public baseUrl: string = '/') {
            super(dependencyPolicy, baseUrl);
        }

        protected createModuleLoader() {
            return new BrowserModuleLoader(this.baseUrl);
        }
    }
}