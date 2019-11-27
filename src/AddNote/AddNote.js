import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import NoteValidationError from './NoteValidationError'
// import NotefulError from '../NotefulError/NotefulError'
// import PropTypes from 'prop-types';
import './AddNote.css'

export default class AddNote extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nameValid: false,
            folderValid: false,
            formValid: false,
            name: '',
            folder: null,
            validationMessages: {
                name: '',
                folder: ''
            }
        }
    }
    static defaultProps = {
        history: {
            push: () => {}
        },
    }
    static contextType = ApiContext;

    validateFolder(folderId) {
        const fieldErrors = this.state.validationMessages;
        let hasError = false;
        if (!this.context.folders.find(f => f.id === folderId)) {
            fieldErrors.folder = 'Folder is required';
            hasError = true;
        }
        this.setState({
            validationMessages: fieldErrors,
            folderValid: !hasError
        }, () => this.formValid());
    }

    validateName(fieldValue) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;
        fieldValue = fieldValue.trim();
        if (fieldValue.length === 0) {
            fieldErrors.name = 'Name is required';
            hasError = true;
        }
        this.setState({
            validationMessages: fieldErrors,
            nameValid: !hasError
        }, () => this.formValid()); 
    }
    formValid() {
        this.setState({
            formValid: this.state.nameValid && this.state.folderValid
        });
    }
    updateName(name){
        this.setState({name}, ()=>{this.validateName(name)});
      }
      updateFolder(folder) {
          this.setState({folder}, () => {this.validateFolder(folder)});
      }

    handleSubmit = e => {
        e.preventDefault()
        
        this.validateFolder(e.target['note-folder-id'].value);
        this.validateName(e.target['note-name'].value);

        if (!this.state.formValid)
        return;
        
        const newNote = {
            name: e.target['note-name'].value,
            content: e.target['note-content'].value,
            folderId: e.target['note-folder-id'].value,
            modified: new Date(),
        }
        fetch(`${config.API_ENDPOINT}/notes`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newNote),
        })
        .then(res => {
            if (!res.ok)
            return res.json().then(e => Promise.reject(e))
            return res.json()
        })
        .then(note => {
            this.context.addNote(note)
            this.props.history.push(`/folder/${note.folderId}`)
        })
        .catch(error => {
            alert('There was an error communicating with the server');
            console.error({error})
        })
    }
    render() {
        const {folders=[]} = this.context;
        return (
            <section className='AddNote'>
                <h2>Create a Note</h2>
                <NotefulForm onSubmit={this.handleSubmit}>
                    <div className='field'>
                        <label htmlFor='note-name-input'>
                            Name
                        </label>
                        <input type='text' id='note-name-input' name='note-name' onChange={e => this.updateName(e.target.value)} required />
                        <NoteValidationError className='validationError' hasError={!this.state.nameValid} message={this.state.validationMessages.name}></NoteValidationError>
                    </div>
                    <div className='field'>
                        <label htmlFor='note-content-input'>
                            Content
                        </label>
                        <textarea id='note-content-input' name='note-content' />
                    </div>
                    <div className='field'>
                        <label htmlFor='note-folder-select'>
                            Folder
                        </label>
                        <select id='note-folder-select' name='note-folder-id' onChange={e => this.updateFolder(e.target.value)}>
                            <option value={null}>...</option>
                            {folders.map(folder =>
                                <option key={folder.id} value={folder.id}>
                                    {folder.name}
                                </option>
                                )}
                        </select>
                        <NoteValidationError className='validationError' hasError={!this.state.folderValid} message={this.state.validationMessages.folder} />
                    </div>
                    <div className='buttons'>
                        <button type='submit'>
                            Add note
                        </button>
                        </div>               
                </NotefulForm>
            </section>
        )
    }
}