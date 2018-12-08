import { autorun, observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import React, { Component, createRef } from 'react';

import { Text } from 'scenegraph';
import ModularTypeComponent from './ModularTypeComponent.jsx';

@inject('dialog', 'typeStore')
@observer
class ModularTypeContainer extends Component {
    @observable currentStep = null;
    @observable validSelection = false;

    inputRef = {
        ratio: createRef(),
        ratioDD: createRef()
    };

    componentDidMount() { 
        autorun(this._onDialogActive);
        autorun(this._propagateTypeStep); 
    }

    get selectedTextItems() {
        const selection = this.props.dialog.selection.items;
        return selection.filter((item) => (item instanceof Text));
    }

    _selectStep = (step) => { this.currentStep = step; }

    _editConfig = (key) => (val) => { this.props.typeStore.setConfig(key, val); }
    
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

    _onDialogActive = () => {
        // trigger when modal is open
        if (!this.props.dialog.active) return;

        // check if current selection is valid
        this.validSelection = (this.selectedTextItems.length > 0);
    }

    render() {
        if (!this.validSelection) 
            return <ErrorDialog />;

        return <ModularTypeComponent 
            currentStep={this.currentStep} 
            selectStep={this._selectStep}
            inpRef={this.inputRef}
        />;
    }
}

const ErrorDialog = (props) => {
    return (
        <form style={{width: 300}}>
            <h1>Modular Type — Selection error</h1>
            <hr/>
            <p>Please select at least one text element directly.</p>
            <footer>
                <button type='submit' uxp-variant='cta'>Close</button>
            </footer>
        </form>
    );
}

export default ModularTypeContainer;

