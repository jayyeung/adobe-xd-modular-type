import { autorun, observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import React, { Component } from 'react';

import { Text } from 'scenegraph';
import TDComponent from './TDComponent.jsx';

@inject('typeStore')
@observer
class TDContainer extends Component {
    @observable currentStep = null;

    componentDidMount() { autorun(this._propagateTypeStep); }

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

    acceptDialog = () => this.closeDialog('USER_ACCEPT');
    closeDialog = (reason) => this.props.dialog.close(reason || 'USER_CANCEL') 

    render() {
        return <TDComponent 
                typeStore={this.props.typeStore}
                currentStep={this.currentStep}
                selectStep={this._selectStep}
                acceptDialog={this.acceptDialog}
                closeDialog={this.closeDialog}
        />;
    }
}

export default TDContainer;

