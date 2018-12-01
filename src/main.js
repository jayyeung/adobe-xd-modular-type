const reactShim = require('./react-shim');
const { observable } = require('mobx');
const { Provider } = require('mobx-react');
const React = require('react');
const ReactDOM = require('react-dom');

const styles = require('./styles/main.scss');
const stores = require('./stores/store').default;
const ModularType = require('./components/ModularType').default;

let dialog; let dialogOpen = observable.box(false);
function getDialog(selection) {
    if (dialog == null) {
        dialog = document.createElement('dialog');
        ReactDOM.render(
            <Provider {...stores}>
                <ModularType
                    selection={selection}
                    open={dialogOpen}
                    dialog={dialog} />
            </Provider>
        , dialog);
    }
    return dialog;
} 

module.exports.commands = {
    menuCommand: async function(selection) {
        dialogOpen.set(true);
        const res = await document.body.appendChild(getDialog(selection)).showModal();
        dialogOpen.set(false);

        switch(res) {
            case 'reasonCanceled': case 'USER_CANCEL':
                throw new Error('Rejected: User canceled dialog');
        }
    }
}