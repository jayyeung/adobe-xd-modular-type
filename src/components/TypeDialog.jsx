import { autorun, observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import React, { Component } from 'react';

import { Text } from 'scenegraph';
import NumberInput from './NumberInput.jsx';
import presets from '../assets/presets';

@inject('typeStore')
@observer
class TypeDialog extends Component {
    @observable selectedStep = null;

    componentDidMount() { autorun(this._propagateTypeStep); }

    _selectStep = (step) => { this.selectedStep = step; }
    _propagateTypeStep = () => {
        const selection = this.props.selection;
        const scale = this.selectedStep;
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
        const { acceptDialog, closeDialog, selectedStep, _selectStep } = this;
        const { typeConfig, setConfig, modularScale } = this.props.typeStore;
        const { ratio, range, baseSize } = typeConfig;

        return (
            <form className='c-type-dialog' onSubmit={acceptDialog}>
                <h1>Modulize Type</h1>
                <p>Automatically scale your selected text layers based on a chosen font size/step.</p>
                <hr/>

                <fieldset className='c-type-dialog__params'>
                    <div className='row'>
                        <NumberInput title='Font Size (px)' 
                            onChange={setConfig('baseSize')}
                            input={{
                                autoFocus: true,
                                value: baseSize,
                                placeholder: 'Eg. 16'
                            }}
                        />
                    </div>

                    <div className='row'>
                        <NumberInput title='Scale Ratio' 
                            onChange={setConfig('ratio')}
                            input={{
                                value: ratio,
                                placeholder: 'Eg. 1.618'
                            }} 
                        />

                        <label style={{marginRight: 28}}>
                            <span></span>
                            <select uxp-quiet='true' onChange={(e)=>setConfig('ratio')(e.target.value || ratio)}> 
                                <option value>Custom Ratio</option>

                                { presets.map((step, i) => (
                                    <option key={`preset-${i}`} value={step.value}>
                                        {`${step.label} – ${step.value}`}
                                    </option>
                                )) }
                            </select>
                        </label>

                        <NumberInput title='Range'
                            onChange={setConfig('range')}
                            input={{
                                value: range,
                                style: {width: 40},
                                placeholder: 'Eg. 4'
                            }}
                        />
                    </div>
                </fieldset>

                <ul className='c-type-dialog__preview'>
                    { modularScale.map((step_i) => {
                        const { step, fontSize, fontSizeEm } = step_i;
                        const isBase = (step === 0) ? 'base' : '';
                        const isActive = (selectedStep && selectedStep.step === step) ? 'active' : '';
                        const pStyles = { fontSize };

                        return ( 
                            <li className={`c-type-dialog__preview-item ${isBase} ${isActive}`}
                                onClick={()=>_selectStep(step_i)}
                                key={`step-${step}`}>

                                <p style={pStyles}>The quick brown fox jumps over the lazy dog</p>
                                <div className='row' style={{opacity: 0.7, marginLeft: 12}}>
                                    <span>{`${(isBase) ? 'Base' : `Step ${step}`} –`}</span>
                                    <span>{` ${fontSize.toFixed(3)}px / ${fontSizeEm.toFixed(3)}em`}</span>
                                </div>
                            </li>
                        );
                    }) }
                </ul>

                <footer>
                    <button uxp-variant='secondary' uxp-quiet='true'
                        onClick={()=>closeDialog()}>Cancel</button>
                    <button type='submit' uxp-variant='cta'>Apply Scale</button>
                </footer>
            </form>
        );
    }
}

export default TypeDialog;

