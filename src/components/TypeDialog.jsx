import { autorun, observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import React, { Component } from 'react';

import { Text } from 'scenegraph';
import NumberInput from './NumberInput.jsx';

@inject('typeStore')
@observer
class TypeDialog extends Component {
    @observable selectedStep = null;

    componentDidMount() {
        this._propagateTypeStep();
    }

    _propagateTypeStep() {
        const { selection } = this.props;

        autorun(() => {
            const scale = this.selectedStep;
            if (!scale) return;
            
            (selection.items).filter(item => {
                return item instanceof Text;
            }).map(item => {
                const { fontSize } = item.styleRanges[0];
                item.lineSpacing = (scale.fontSize) * (item.lineSpacing / fontSize);
                item.styleRanges = [{
                    fontSize: (scale.fontSize)
                }];
            })
        });
    }

    _selectStep(step) { this.selectedStep = step; }
    acceptDialog() { return this.closeDialog('USER_ACCEPT'); }
    closeDialog(reason) { return this.props.dialog.close(reason || 'USER_CANCEL'); }   

    render() {
        const { typeConfig, setConfig, modularScale } = this.props.typeStore;
        const { ratio, range, baseSize } = typeConfig;

        return (
            <form className='c-type-dialog' onSubmit={()=>this.acceptDialog()}>
                <h1>Modulize Type</h1>
                <p>Automatically scale your selected text layers based on a chosen font size/step.</p>
                <hr/>

                <fieldset className='c-type-dialog__params' style={{margin: '8px 0 20px'}}>
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
                    { modularScale.map(step_i => {
                        const { step, fontSize, fontSizeEm } = step_i;
                        const isBase = (step === 0) ? 'base' : '';
                        const isActive = (this.selectedStep && this.selectedStep.step === step) ? 'active' : '';
                        const pStyles = {
                            fontSize
                        };

                        return ( 
                            <li className={`c-type-dialog__preview-item ${isBase} ${isActive}`}
                                onClick={()=>this._selectStep(step_i)}
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
                        onClick={()=>this.closeDialog()}>Cancel</button>
                    <button type='submit' uxp-variant='cta'>Apply Scale</button>
                </footer>
            </form>
        );
    }
}

export default TypeDialog;

