import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from './NoteListNav/NoteListNav';
import NotePageNav from './NotePageNav/NotePageNav';
import NoteListMain from './NoteListMain/NoteListMain';
import NotePageMain from './NotePageMain/NotePageMain';
import ApiContext from './ApiContext';
import config from './config';
import './App.css';
import AddFolder from './AddFolder/AddFolder';
import AddNote from './AddNote/AddNote';
import NotefulError from './NotefulError/NotefulError';


class App extends Component {
  state = {
    notes: [],
    folders: [],
  };
  componentDidMount() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/api/notes`),
      fetch(`${config.API_ENDPOINT}/api/folders`)
    ])
    .then(([notesRes, folderRes]) => {
      if (!notesRes.ok)
        return notesRes.json().then(e => Promise.reject(e));
      if (!folderRes.ok)
        return folderRes.json().then(e => Promise.reject(e));
        return Promise.all([notesRes.json(), folderRes.json()]);
    })
    .then(([notes, folders]) => {
      this.setState({notes, folders});
    })
    .catch(error => {
      console.error({error});
    });
  }
  handleAddFolder = folder => {
    this.setState({
      folders: [...this.state.folders, folder]
    })
  }
  handleAddNote = note => {
    this.setState({
      notes: [...this.state.notes, note]
    })
  }
  handleDeleteNote = noteId => {
    this.setState({
      notes: this.state.notes.filter(note => note.id !== noteId)
    });
  };
  renderNavRoutes() {
    return (
      <>
        {['/', '/folder/:folderId'].map(path => (
          <Route 
          exact
          key={path}
          path={path}
          component={NoteListNav}
          /> 
        ))}
        <Route path="/note/:noteId" component={NotePageNav} />
        <Route path="/add-folder" component={AddFolder} />
        <Route path="/add-note" component={AddNote} />
      </>
    );
  }
  renderMainRoutes() {
    return (
      <>
        {['/', '/folder/:folderId'].map(path => (
          <Route
            exact
            key={path}
            path={path}
            component={NoteListMain}
          />
        ))}
          <Route path='/note/:noteId' component={NotePageMain} />
      </>
    );
  }
  render() {
    const value = {
      notes: this.state.notes,
      folders: this.state.folders,
      addFolder: this.handleAddFolder,
      addNote: this.handleAddNote,
      deleteNote: this.handleDeleteNote,
    };
    return (
      <ApiContext.Provider value={value}>
        <div className="App">
        <NotefulError>
            <nav className="App__nav">{this.renderNavRoutes()}</nav>
            <header className="App__header">
                <h1>
                    <Link to="/">Noteful</Link>{' '}
                    <FontAwesomeIcon icon="check-double" />
                </h1>
            </header>
            <main className="App__main">{this.renderMainRoutes()}</main>
        </NotefulError>
        </div>
      </ApiContext.Provider>
    );
  }
}
export default App;
