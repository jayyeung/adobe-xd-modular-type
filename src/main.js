const reactShim = require('./react-shim');
const React = require('react');
const { Provider } = require('mobx-react');

const styles = require('./styles/main.scss');
const stores = require('./stores/store').default;
const dialog = require('./dialog').default;
const ModularType = require('./components/ModularType').default;

dialog.createDialog(
    <Provider dialog={dialog} typeStore={stores.typeStore}>
        <ModularType/>
    </Provider>
);

module.exports.commands = {
    menuCommand: async function(selection) {
        dialog.selection = selection;
        const res = await dialog.getDialog();
        switch(res) {
            case 'reasonCanceled': case 'USER_CLOSE':
                throw new Error('Rejected: User canceled dialog');
        }
    }
}