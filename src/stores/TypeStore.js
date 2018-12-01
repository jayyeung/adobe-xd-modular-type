import { observable, computed, action } from 'mobx';

class TypeStore {
    @observable typeConfig = {
        ratio: 1.25,
        range: 4,
        baseSize: 16
    };

    @computed get modularScale() {
        const { range, ratio, baseSize } = this.typeConfig;
        let step, i; let steps = [];
        for (i = range; i >= -4; i--) {
            step = { step: i, fontSize: baseSize*(ratio**i) };
            step.fontSizeEm = step.fontSize / baseSize;
            steps.push(step);
        }
        return steps;
    }

    @action setConfigKey = (key, value) => {
        if (!(key in this.typeConfig)) return;
        
        // TODO: implement better bounds checking
        let min = 1, max = value;
        switch(key) {
            case 'ratio': max = 3; break;
            case 'range': max = 15;  break;
            case 'baseSize': max = 100; break;
        }

        this.typeConfig[key] = Math.max(Math.min(value, max), min);
    }

    // Temporary curry function used
    // for <NumberInput />'s 'onValidChange' function
    setConfig = (key) => ((value) => this.setConfigKey(key, value));

    // constructor() { this._fetchUserPref(); }

    /* async _fetchUserPref() {
        // TODO: add saving preferences
        // when needed in the future
    }*/
}

const typeStore = new TypeStore();
export default typeStore;