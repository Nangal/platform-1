import { ModuleLoader } from '../module_loaders/module_loader';
import { Polyfiller } from '../polyfills/polyfiller';
import { Feature, FeatureReference } from '../feature';
import { EntryPoint } from '../../entry_point';

let __karma__: any = (<any>window)['__karma__'];

export class KarmaFeature extends Feature {
    static create(): FeatureReference {
        return new FeatureReference(KarmaFeature).withDependency(Polyfiller).withDependency(ModuleLoader);
    }

    constructor(private _testFilter?: (path: string) => boolean) {
        super();
        if (!_testFilter)
            this._testFilter = path => !path.startsWith('/base/node_modules/') && /.spec\.js$/.test(path);
        __karma__.loaded = function () { };
    }

    protected async onRunAsync(entryPoint: EntryPoint) {
        await super.onRunAsync(entryPoint);
        try {
            await this.ensureKarmaTestsLoadedAsync(entryPoint);
        }
        catch (ex) {
            console.error(ex.stack || ex);
        }
        __karma__.start();
    }

    async ensureKarmaTestsLoadedAsync(entryPoint: EntryPoint) {
        await Promise.all(this.getKarmaTestFiles().map(fileName => this.loadTestsAsync(entryPoint, fileName)));
    }

    getKarmaTestFiles(): string[] {
        return Object.keys((<any>window).__karma__.files).filter(<any>this._testFilter);
    }

    async loadTestsAsync(entryPoint: EntryPoint, fileName: string) {
        await FeatureReference.getFeature<ModuleLoader>(ModuleLoader).loadModuleAsync({ key: fileName.replace((<any>System).baseURL, '').replace('.js', '') });
    }
}
