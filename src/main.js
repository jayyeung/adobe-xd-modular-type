const reactShim = require('./react-shim');
const React = require('react');

const styles = require('./styles/main.scss');
const stores = require('./stores/store').default;
const dialog = require('./dialog').default;
const ModularType = require('./components/ModularType').default;

dialog.createDialog(
    <ModularType
        dialog={dialog}       
        typeStore={stores.typeStore} 
    />
);

module.exports.commands = {
    menuCommand: async function(selection) {
        dialog.selection = selection;
        const res = await dialog.getDialog();
        switch(res) {
            case 'reasonCanceled':
                throw new Error('Rejected: User canceled dialog');
        }
    }
}