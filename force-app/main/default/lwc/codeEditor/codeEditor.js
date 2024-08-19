/* eslint-disable no-undef */
import { LightningElement, track } from 'lwc';
import executeCode from '@salesforce/apex/CodeExecutor.executeCode';
import MONACO_EDITOR from '@salesforce/resourceUrl/MonacoEditor';
import { loadScript } from 'lightning/platformResourceLoader';


export default class CodeEditor extends LightningElement {
    @track output = '';
    editor;
    renderedCallback() {
        if (this.monacoInitialized) {
            return;
        }
        loadScript(this, MONACO_EDITOR + '/vs/loader.js')
            .then(() => {
                require.config({ paths: { 'vs': MONACO_EDITOR + '/vs' } });
                require(['vs/editor/editor.main'], () => {
                    this.initializeMonaco();
                });
            })
            .catch(error => {
                console.error('Error loading Monaco Editor:', error);
            });
    }
    runCode() {
        const code = this.editor.getValue();
        executeCode({ language: 'javascript', code: code })
            .then(result => {
                this.output = result.output;
            })
            .catch(error => {
                this.output = 'Error executing code: ' + error.body.message;
            });
    }
}
