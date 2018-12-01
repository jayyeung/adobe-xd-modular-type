import { autorun, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';

import { Text } from 'scenegraph';
import ModularTypeComponent from './ModularTypeComponent.jsx';

@observer
class ModularTypeContainer extends Component {
    componentDidMount() { 
        autorun(this._propagateTypeStep); 
        autorun(this.onDialogActive);
    }

    @observable currentStep = null;
    @observable currentSelection = null;

    get selectedTextItems() {
        const selection = this.props.selection.items;
        return selection.filter((item) => (item instanceof Text));
    }

    _selectStep = (step) => { this.currentStep = step; }
    _propagateTypeStep = () => {
        const scale = this.currentStep;
        if (!scale) return;
        
        this.selectedTextItems
            .map(item => {
                const { fontSize } = item.styleRanges[0];
                item.lineSpacing = (scale.fontSize) * (item.lineSpacing / fontSize);
                item.styleRanges = [{
                    fontSize: (scale.fontSize)
                }];
            }
        )
    }

    onDialogActive = () => {
        if (!this.props.active) return;

    }

    acceptDialog = () => this.closeDialog('USER_ACCEPT');
    closeDialog = (reason) => this.props.dialog.close(reason || 'USER_CANCEL') 


    render() {
        return <ModularTypeComponent 
                typeStore={this.props.typeStore}
                currentStep={this.currentStep}
                selectStep={this._selectStep}
                acceptDialog={this.acceptDialog}
                closeDialog={this.closeDialog}
        />;
    }
}

export default ModularTypeContainer;

