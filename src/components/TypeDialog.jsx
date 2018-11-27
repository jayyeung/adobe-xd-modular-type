import { autorun, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';

import { Text } from 'scenegraph';
import NumberInput from './NumberInput.jsx';

@observer
class TypeDialog extends Component {
    @observable selectedStep = null;

    componentDidMount() {
        this._propagateTypeStep();
    }

    _propagateTypeStep() {
        const { selection } = this.props;

        // MobX's autorun triggers whenever
        // selectedStep (observable) value changes
        autorun(() => {
            if (!this.selectedStep) return;
            
            (selection.items).filter(item => {
                return item instanceof Text;
            }).map(item => {
                const { fontSize } = item.styleRanges[0];
                item.lineSpacing = (this.selectedStep.fontSize) * (item.lineSpacing / fontSize);
                item.styleRanges = [{
                    fontSize: (this.selectedStep.fontSize)
                }];
            })
        });
    }

    _selectStep(step) { this.selectedStep = step; }
    acceptDialog() { return this.closeDialog('USER_ACCEPT'); }
    closeDialog(reason) { return this.props.dialog.close(reason || 'USER_CANCEL'); }   

    render() {
        const typeStore = this.props.store;
        const { ratio, baseSize, range, modularScale } = typeStore;
        const { setRatio, setRange, setBaseSize } = typeStore;

        return (
            <form className='c-type-dialog' onSubmit={()=>this.acceptDialog()}>
                <h1>Modulize Type</h1>
                <p>Automatically scale your selected text layers based on a chosen font size/step.</p>
                <hr/>

                <fieldset className='c-type-dialog__params' style={{margin: '8px 0 20px'}}>
                    <div className='row'>
                        <NumberInput title='Font Size (px)' input={{
                            autoFocus: true,
                            value: baseSize,
                            onValidChange: setBaseSize,
                            placeholder: 'Eg. 16'
                        }} />
                    </div>

                    <div className='row'>
                        <NumberInput title='Scale Ratio' input={{
                            value: ratio,
                            onValidChange: setRatio,
                            placeholder: 'Eg. 1.618'
                        }} />

                        <label style={{marginRight: 28}}>
                            <span></span>
                            <select uxp-quiet='true' onChange={(e)=>setRatio(e.target.value || ratio)}> 
                                <option disabled>Custom Ratio</option>
                                <option value='1.125'>Major Second – 8:9</option>
                                <option value='1.2'>Minor Third – 5:6</option>
                                <option value='1.25'>Major Third – 4:5</option>
                                <option value='1.333'>Fourth – 3:4</option>
                                <option value='1.414'>Augmented Fourth – 1:&radic;4</option>
                                <option value='1.5'>Fifth – 2:3</option>
                                <option value='1.667'>Minor Sixth – 5:8</option>
                            </select>
                        </label>

                        <NumberInput title='Range' input={{
                            value: range,
                            onValidChange: setRange,
                            style: {width: 40},
                            ['uxp-quiet']: true,
                            placeholder: 'Eg. 4'
                        }} />
                    </div>
                </fieldset>

                <ul className='c-type-dialog__preview'>
                    { modularScale.map(step_i => {
                        const { step, fontSize, fontSizeEm } = step_i;
                        const isBase = (step === 0) ? 'base' : '';
                        const isActive = (this.selectedStep && this.selectedStep.step === step) ? 'active' : '';
                        return ( 
                            <li className={`c-type-dialog__preview-item ${isBase} ${isActive}`}
                                onClick={()=>this._selectStep(step_i)} key={`step-${step}`}>
                                <p style={{fontSize: fontSize}}>The quick brown fox jumps over the lazy dog</p>
                                <div className='row' style={{opacity: 0.7, marginLeft: 12}}>
                                    <span className='u-style-italic'>{`${(isBase) ? 'Base' : `Step ${step}`} –`}</span>
                                    <span>{` ${fontSize.toFixed(3)}px / ${fontSizeEm.toFixed(3)}em`}</span>
                                </div>
                            </li>
                        );
                    }) }
                </ul>

                <footer>
                    <button uxp-variant='secondary' uxp-quiet='true'
                        onClick={()=>this.closeDialog()}>Cancel</button>
                    <button type='submit' uxp-variant='cta'>Apply Scale</button>
                </footer>
            </form>
        );
    }
}

export default TypeDialog;

