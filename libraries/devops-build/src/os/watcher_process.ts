import { TrackerProcess } from '../processes/tracker_process';
import { Observable } from 'rxjs/Observable';
import * as chokidar from 'chokidar';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/buffer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounce';

/**
 * A process that starts, progresses, and the completes.
 * Completion can be due to success, failure, or cancellation.
 */
export class WatcherProcess extends TrackerProcess<string[], Error> {
    constructor(public patterns: string | string[], cwd?: string, public delta: number = 100) {
        super();
        this.cwd = cwd || process.cwd();
    }

    cwd: string;

    start() {
        this.watcher = chokidar.watch(this.patterns, { cwd: this.cwd });
        let obs = Observable.fromEvent<string>(this.watcher, 'change');
        // Buffer a set of saved files so long as changes keep occuring within x.  Only emit distinct.
        obs.buffer(obs.debounce(() => Observable.timer(this.delta))).map(event => event.filter((v, i, s) => s.indexOf(v) === i)).subscribe(changes => this.setProgress(changes)); // @todo extraneous subject
    }

    public watcher: chokidar.FSWatcher;
    // changed: Observable<WatchChange>;
    changed: Observable<string[]>;

    dispose() {
        this.watcher.close();
    }
}