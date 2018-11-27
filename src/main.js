const { observable } = require('mobx');
const reactShim = require('./react-shim');
const React = require('react');
const ReactDOM = require('react-dom');

const styles = require('./styles/main.scss');
const TypeStore = require('./store').default;
const TypeDialog = require('./components/TypeDialog.jsx').default;

let dialog; 

function getDialog(selection) {
    if (dialog == null) {
        dialog = document.createElement('dialog');
        ReactDOM.render(<TypeDialog
            selection={selection} 
            store={TypeStore} 
            dialog={dialog} />
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