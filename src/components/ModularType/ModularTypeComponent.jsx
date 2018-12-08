import { observer, inject } from 'mobx-react';
import React from 'react';

import NumberInput from '../NumberInput.jsx';
import presets from '../../assets/presets';

const ModularTypeComponent = inject('dialog', 'typeStore')(observer((props) => {
    const { currentStep, selectStep, inpRef } = props;

    const { acceptDialog, closeDialog } = props.dialog;
    const { typeConfig, editConfig, modularScale } = props.typeStore;
    const { ratio, range, baseSize } = typeConfig;

    return (
        <form className='c-type-dialog' onSubmit={acceptDialog}>
            <h1>Modulize Type</h1>
            <p>Automatically scale your selected text layers based on a chosen font size/step.</p>
            <hr/>

            <fieldset className='c-type-dialog__params'>
                <div className='row'>
                    <NumberInput title='Font Size (px)' 
                        onChange={(v)=>editConfig('baseSize', v)}
                        input={{
                            autoFocus: true,
                            value: baseSize,
                            style: {width: 72},
                            placeholder: 'Eg. 16'
                        }}
                    />
                </div>

                <div className='row'>
                    <NumberInput title='Scale Ratio'
                        ref={inpRef.ratio}
                        onChange={(v)=>{editConfig('ratio', v); inpRef.ratioDD.current.selectedIndex = 0}}
                        input={{
                            value: ratio,
                            placeholder: 'Eg. 1.618'
                        }} 
                    />

                    <label style={{marginRight: 20}}>
                        <span></span>
                        <select uxp-quiet='true'
                            ref={inpRef.ratioDD}
                            onChange={(e)=>{inpRef.ratio.current.setValue(e.target.value); editConfig('ratio', e.target.value)}}>

                            <option value={ratio}>Custom Ratio</option>

                            { presets.map((step, i) => (
                                <option key={`preset-${i}`} value={step.value}>
                                    {`${step.label} – ${step.value}`}
                                </option>
                            )) }
                        </select>
                    </label>

                    <NumberInput title='Range'
                        onChange={(v)=>editConfig('range', v)}
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
                    const isActive = (currentStep && currentStep.step === step) ? 'active' : '';
                    const pStyles = { fontSize };

                    return ( 
                        <li className={`c-type-dialog__preview-item ${isBase} ${isActive}`}
                            onClick={()=>selectStep(step_i)}
                            key={`step-${step}`}>

                            <p style={pStyles}>The quick brown fox jumps over the lazy dog</p>
                            <div className='row' style={{opacity: 0.7, marginLeft: 12}}>
                                <span>{`${(isBase) ? 'Base' : `Step ${step}`} –`}</span>
                                <span>{` ${parseFloat(fontSize.toFixed(3))}px / ${parseFloat(fontSizeEm.toFixed(3))}em`}</span>
                            </div>
                        </li>
                    );
                }) }
            </ul>

            <footer className='c-type-dialog__footer'>
                <button uxp-variant='secondary' uxp-quiet='true'
                    onClick={closeDialog}>Cancel</button>
                <button type='submit' uxp-variant='cta'>Apply Step</button>
            </footer>
        </form>
    );
}));

export default ModularTypeComponent;