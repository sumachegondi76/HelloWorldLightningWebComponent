/* eslint-disable no-prototype-builtins */
import { LightningElement, track } from 'lwc';
import executeCode from '@salesforce/apex/CodeExecutor.executeCode';

export default class CodeEditor extends LightningElement {
    @track selectedLanguage = '';
    @track codeByLanguage = {}; // Object to store code by language
    @track formattedCode = '';
    @track errors = '';

    languageOptions = [
        { label: 'C', value: 'c' },
        { label: 'C++', value: 'cpp' },
        { label: 'Java', value: 'java' },
        { label: 'Python', value: 'python3' }
    ];

    handleCodeChange(event) {
        this.codeByLanguage[this.selectedLanguage] = event.target.value;
    }

    handleLanguageChange(event) {
        this.selectedLanguage = event.target.value;

        // If there's code stored for the selected language, load it back into the textarea
        if (this.codeByLanguage.hasOwnProperty(this.selectedLanguage)) {
            this.template.querySelector('.code-input').value = this.codeByLanguage[this.selectedLanguage];
        } else {
            this.template.querySelector('.code-input').value = '';
        }
        
        this.formattedCode = ''; // Clear previous output when language changes
        this.errors = ''; // Clear previous errors when language changes
    }

    async runCode() {
        this.errors = '';

        let code = this.codeByLanguage[this.selectedLanguage] || this.template.querySelector('.code-input').value;
        this.codeByLanguage[this.selectedLanguage] = code;

        try {
            const result = await executeCode({ language: this.selectedLanguage, code: code });
            console.log('API Response:', result);
            this.formattedCode = result.output;
            this.errors = result.errors;
        } catch (error) {
            console.error('API Error:', error);
            this.errors = 'Error executing code: ' + error.body.message;
        }
    }
}
