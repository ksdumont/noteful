import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './AddFolder.css'
// import FolderValidationError from './FolderValidationError'
// import NotefulError from '../NotefulError/NotefulError'
// import PropTypes from 'prop-types';

export default class AddFolder extends Component {
    static defaultProps = {
        history: {
            push: () => {}
        },
    }
    static contextType = ApiContext;

    // validateFolderName(fieldValue) {
    //     fieldValue = fieldValue.trim();
    //     if (fieldValue.length === 0) {
    //         alert('Folder must have a name');
    //     }
    // }

    handleSubmit = e => {
        e.preventDefault()
        // this.validateFolderName(e.target['folder-name'].value);
        const folder = {
            name: e.target['folder-name'].value
        }
        fetch(`${config.API_ENDPOINT}/folders`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(folder),
        })
        .then(res => {
            if (!res.ok) 
                return res.json().then(e => Promise.reject(e))
                return res.json()
        })
        .then(folder => {
            this.context.addFolder(folder)
            this.props.history.push(`/folder/${folder.id}`)
        })
        .catch(error => {
            console.error({error})
        })
    }
    render() {
        return (
            <section className='AddFolder'>
                <h2>Create a folder</h2>
                <NotefulForm onSubmit={this.handleSubmit}>
                    <div className='field'>
                        <label htmlFor='folder-name-input'>
                            Name
                        </label>
                        <input type='text' id='folder-name-input' name='folder-name' required />
                    </div>
                    <div className='buttons'>
                        <button type='submit'>
                            Add Folder
                        </button>
                    </div>
                </NotefulForm>
            </section>
        )
    }
}