import { observable, action } from 'mobx';
import React from 'react';
import ReactDOM from 'react-dom';

class Dialog {
    @observable active = false;
    target = null;

    createDialog = (component) => {
        if (this.target == null) {
            this.target = document.createElement('dialog');
            ReactDOM.render(component, this.target);
        }
        return this.target;
    }

    async getDialog() {
        this._setActive(true);
        const res = await document.body
            .appendChild(this.target)
            .showModal();
        this._setActive(false);
        return res;
    }

    @action _setActive = (active) => { this.active = active; }
    closeDialog = () => { this.target.close('USER_CLOSE'); }
    acceptDialog = () => { this.target.close('USER_ACCEPT'); }
}

const dialog = new Dialog();
export default dialog;