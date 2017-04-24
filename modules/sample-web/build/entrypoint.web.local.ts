/// <reference path="../../bootstrap/src/dependency.ts" />
/// <reference path="../../bootstrap/src/dependency_module_policy.ts" />
/// <reference path="../../bootstrap/src/platforms/browser/systemjs/systemjs_bundle_library_policy.ts" />
/// <reference path="../../bootstrap/src/platforms/browser/systemjs/systemjs_browser_entry_point.ts" />
/// <reference path="../../bootstrap/src/features/angular_platform_browser_dynamic_feature.ts" />
/// <reference path="../../bootstrap/src/features/corejs_feature.ts" />
/// <reference path="../../bootstrap/src/features/systemjs_config_feature.ts" />
/// <reference path="../../bootstrap/src/feature.ts" />

namespace __sharpangles.app {
    /**
     * A local entry point convenient for development.
     * This particular example is set up around running an http-server at the platform root.
     */
    class EntryPointWebLocal extends SystemJSBrowserEntryPoint {
        constructor() {
            super('__artifacts/serve/polyfills/system.src.js', EntryPointWebLocal.depencencyModulePolicy, EntryPointWebLocal.libraryPolicy, EntryPointWebLocal.libraryFeatures);
        }

        static depencencyModulePolicy = new ScopedDependencyModulePolicy('@sharpangles', 'build/dependencies.local');

        static dependenciesLibraryPolicy = new SystemJSBundleLibraryPolicy();
        static rootLibraryPolicy = new SystemJSLibraryPolicy('@sharpangles/sample-web');
        static libraryPolicy = new SplitLibraryPolicy(EntryPointWebLocal.rootLibraryPolicy, EntryPointWebLocal.dependenciesLibraryPolicy);

        static libraryFeatures = [
            new CoreJSFeature(),
            new AngularPlatformBrowserDynamicFeature('app.module'),
            new SystemJSConfigFeature({
                warnings: true,
                map: {
                    'core-js/es7/reflect': 'core-js/client/shim.js'
                },
                packages: {
                    // 'core-js': {
                    //    defaultExtension: 'js'
                    // },
                    '@sharpangles/sample-web': {
                        defaultExtension: 'js',
                        // map: {
                        //     './': '__artifacts/build/app/'
                        // }
                    }
                },
                paths: {
                    'npm:': '/node_modules/',
                    'npm:@sharpangles/': '/modules/',
                    'core-js/': 'node_modules/core-js/',
                    '@sharpangles/sample-web/': '__artifacts/build/app/'
                }
            })
        ];
    }

    new EntryPointWebLocal().startAsync();
}