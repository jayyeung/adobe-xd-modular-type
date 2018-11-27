import { observable, computed, action } from 'mobx';

class TypeStore {
    @observable ratio = 1.25;
    @observable range = 4;
    @observable baseSize = 16;

    @computed get modularScale() {
        const { range, ratio, baseSize } = this;
        let step; let steps = [];
        for (let i = range; i >= -4; i--) {
            step = { step: i, fontSize: baseSize*(ratio**i) };
            step.fontSizeEm = step.fontSize / baseSize;
            steps.push(step);
        }
        return steps;
    }

    @action.bound setRatio(ratio) {
        const limit = 3;
        this.ratio = Math.max(Math.min(ratio, limit), 1);
    }

    @action.bound setRange(range) {
        const limit = 15;
        this.range = Math.max(Math.min(range, limit), 1);
    }

    @action.bound setBaseSize(size) {
        this.baseSize = Math.max(1, size);
    }

    // constructor() { this._fetchUserPref(); }

    /* async _fetchUserPref() {
        // TODO: add saving preferences
        // when needed in the future
    }*/
}

const typeStore = new TypeStore();
export default typeStore;