import { autorun, observable, when } from 'mobx';
import { observer, inject } from 'mobx-react';
import React, { Component } from 'react';

import { Text } from 'scenegraph';
import ModularTypeComponent from './ModularTypeComponent.jsx';

@inject('typeStore')
@observer
class ModularTypeContainer extends Component {
    @observable currentStep = null;

    componentDidMount() { 
        autorun(this._propagateTypeStep); 
        autorun(this.onOpenDialog);
    }

    _selectStep = (step) => { this.currentStep = step; }
    _propagateTypeStep = () => {
        const selection = this.props.selection;
        const scale = this.currentStep;
        if (!scale) return;
        
        (selection.items)
            .filter((item) => (item instanceof Text))
            .map(item => {
                const { fontSize } = item.styleRanges[0];
                item.lineSpacing = (scale.fontSize) * (item.lineSpacing / fontSize);
                item.styleRanges = [{
                    fontSize: (scale.fontSize)
                }];
            }
        )
    }

    onOpenDialog = () => {
        if (!this.props.open.get()) return;
        console.log("I'm open mate!")
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

