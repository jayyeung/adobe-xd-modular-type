const reactShim = require('./react-shim');
const { Provider } = require('mobx-react');
const React = require('react');
const ReactDOM = require('react-dom');

const styles = require('./styles/main.scss');
const stores = require('./stores/store').default;
const TypeDialog = require('./components/TypeDialog.jsx').default;

let dialog;
function getDialog(selection) {
    if (dialog == null) {
        dialog = document.createElement('dialog');
        ReactDOM.render(
            <Provider {...stores}>
                <TypeDialog
                    selection={selection} 
                    dialog={dialog} />
            </Provider>
        , dialog);
    }
    return dialog;
}

module.exports.commands = {
    menuCommand: async function(selection) {
        const res = await document.body.appendChild(getDialog(selection)).showModal();
        switch(res) {
            case 'reasonCanceled': case 'USER_CANCEL':
                throw new Error('Rejected: User canceled dialog');
        }
    }
}