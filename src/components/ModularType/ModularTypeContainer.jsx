import { autorun, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component, createRef } from 'react';

import { Text } from 'scenegraph';
import ModularTypeComponent from './ModularTypeComponent.jsx';

@observer
class ModularTypeContainer extends Component {
    @observable currentStep = null;

    componentDidMount() { 
        autorun(this.onDialogActive);
        autorun(this._propagateTypeStep); 
    }

    get selectedTextItems() {
        const selection = this.props.dialog.selection.items;
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
        if (!this.props.dialog.active) return;
        if (this.selectedTextItems.length <= 0)
            console.log('error')
    }

    render() {
        return <ModularTypeComponent 
            typeStore={this.props.typeStore}
            currentStep={this.currentStep}
            selectStep={this._selectStep}
            acceptDialog={this.props.dialog.acceptDialog}
            closeDialog={this.props.dialog.closeDialog}
        />;
    }
}

export default ModularTypeContainer;

